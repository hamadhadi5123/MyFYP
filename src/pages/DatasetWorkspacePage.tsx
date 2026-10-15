import React, { useState, useRef } from 'react';
import { useDataMind } from '../context/DataMindContext';
import { parseCSV } from '../utils/csvParser';
import { exportDatasetToCSV } from '../utils/csvExporter';
import { DatasetColumn } from '../types';
import { 
  Upload, 
  Download, 
  FileText, 
  RefreshCw, 
  AlertTriangle, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  BarChart2, 
  Table, 
  ShieldAlert, 
  Check, 
  SlidersHorizontal,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ReasoningPanel } from '../components/common/ReasoningPanel';

export const DatasetWorkspacePage: React.FC = () => {
  const { 
    currentDataset, 
    loadSampleDataset, 
    loadCustomDataset, 
    applyDataCleaning, 
    resetCurrentDataset, 
    activeDatasetKey,
    addToast 
  } = useDataMind();

  // Active Workspace Tab
  const [activeTab, setActiveTab] = useState<'preview' | 'stats' | 'quality' | 'viz'>('preview');

  // Table filtering & pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Data Quality State
  const [selectedImputeCol, setSelectedImputeCol] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<'mean' | 'median' | 'drop'>('median');
  const [showImputePreview, setShowImputePreview] = useState(false);

  // Visualization State
  const [vizType, setVizType] = useState<'scatter' | 'bar' | 'line'>('scatter');
  const [selectedXCol, setSelectedXCol] = useState<string>('');
  const [selectedYCol, setSelectedYCol] = useState<string>('');

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);

    const file = e.dataTransfer.files?.[0];
    if (file) processUploadedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (file) processUploadedFile(file);
  };

  const processUploadedFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setUploadError('Invalid file format. Please upload a valid .csv file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text, file.name);
        loadCustomDataset(parsed);
        addToast(`Uploaded ${file.name} successfully`, 'success');
        setCurrentPage(1);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file.');
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading local file.');
    };
    reader.readAsText(file);
  };

  const handleExportCSV = () => {
    if (!currentDataset) return;
    const success = exportDatasetToCSV(currentDataset, '_datamind_cleaned');
    if (success) {
      addToast(`Exported ${currentDataset.name} as CSV`, 'success');
    } else {
      addToast('Export failed', 'error');
    }
  };

  // Filter rows
  const filteredRows = currentDataset?.rows.filter(row => {
    if (!searchQuery) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const numericColumns = currentDataset?.columns.filter(c => c.type === 'numeric') || [];
  const missingColumns = currentDataset?.columns.filter(c => c.missingCount > 0) || [];

  // Initialize viz default selections if unset
  React.useEffect(() => {
    if (numericColumns.length >= 2) {
      if (!selectedXCol) setSelectedXCol(numericColumns[0].name);
      if (!selectedYCol) setSelectedYCol(numericColumns[1].name);
    } else if (currentDataset?.columns.length) {
      if (!selectedXCol) setSelectedXCol(currentDataset.columns[0].name);
      if (!selectedYCol) setSelectedYCol(currentDataset.columns[1]?.name || currentDataset.columns[0].name);
    }
    if (missingColumns.length > 0 && !selectedImputeCol) {
      setSelectedImputeCol(missingColumns[0].name);
    }
  }, [currentDataset]);

  // Chart data preparation
  const chartData = currentDataset?.rows
    .filter(r => r[selectedXCol] !== null && r[selectedYCol] !== null && r[selectedXCol] !== '' && r[selectedYCol] !== '')
    .map((r, idx) => ({
      index: idx + 1,
      x: r[selectedXCol],
      y: Number(r[selectedYCol]),
      xNum: Number(r[selectedXCol]),
      raw: r
    })) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls: Dataset Switcher + Upload + Export */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active In-Browser Data Engine
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
              Local Memory
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <span>{currentDataset?.name || 'No Dataset Loaded'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentDataset?.description || 'Upload a CSV or select an educational benchmark below.'}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sample dataset selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => loadSampleDataset('student')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDatasetKey === 'student'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Student Benchmark
            </button>
            <button
              onClick={() => loadSampleDataset('sales')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDatasetKey === 'sales'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Retail Sales
            </button>
            <button
              onClick={() => loadSampleDataset('weather')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeDatasetKey === 'weather'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Weather Grid
            </button>
          </div>

          {/* Reset Snapshot Button */}
          <button
            onClick={resetCurrentDataset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
            title="Reset dataset modifications"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* CSV Drag-and-Drop Uploader (Collapsible/compact) */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-5 rounded-2xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
            : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              Import Your Own CSV Dataset
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Drag & drop file here or choose from your computer. Parsing runs 100% in your browser.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            Choose CSV File
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Dataset Summary Metrics Bar */}
      {currentDataset && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Total Rows</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{currentDataset.rowCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Observations</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Attributes</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{currentDataset.columnCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Features analyzed</div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Missing Values</div>
            <div className={`text-2xl font-bold mt-1 ${currentDataset.missingValueCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {currentDataset.missingValueCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {currentDataset.missingValueCount > 0 ? 'Requires attention' : 'Clean / Complete'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Duplicates</div>
            <div className={`text-2xl font-bold mt-1 ${currentDataset.duplicateRowCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {currentDataset.duplicateRowCount}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {currentDataset.duplicateRowCount > 0 ? 'Duplicate records flagged' : 'Zero duplicates'}
            </div>
          </div>
        </div>
      )}

      {/* Workspace Tabs */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50/50 dark:bg-slate-950/40 overflow-x-auto">
          {[
            { id: 'preview', label: 'Data Preview', icon: Table },
            { id: 'stats', label: 'Statistics', icon: SlidersHorizontal },
            { id: 'quality', label: 'Data Quality & Imputation', icon: ShieldAlert, badge: currentDataset?.missingValueCount ? `${currentDataset.missingValueCount}` : null },
            { id: 'viz', label: 'Visualizations', icon: BarChart2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: DATA PREVIEW                                          */}
        {/* ============================================================ */}
        {activeTab === 'preview' && (
          <div className="p-6 space-y-4">
            {/* Search Bar & Pagination info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search table values..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-3">
                <span>Showing {paginatedRows.length} of {filteredRows.length} rows</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs px-2 font-bold">{currentPage} / {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3 w-12 text-slate-400">#</th>
                    {currentDataset?.columns.map(col => (
                      <th key={col.name} className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{col.name}</span>
                          <span className={`text-[9px] uppercase px-1 rounded font-mono ${
                            col.type === 'numeric'
                              ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}>
                            {col.type.slice(0, 3)}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginatedRows.length === 0 ? (
                    <tr>
                      <td colSpan={(currentDataset?.columns.length || 0) + 1} className="py-8 text-center text-slate-400">
                        No rows match your query.
                      </td>
                    </tr>
                  ) : (
                    paginatedRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3 text-slate-400 font-mono text-[10px]">
                          {(currentPage - 1) * rowsPerPage + idx + 1}
                        </td>
                        {currentDataset?.columns.map(col => {
                          const val = row[col.name];
                          const isMissing = val === null || val === undefined || val === '';
                          return (
                            <td key={col.name} className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                              {isMissing ? (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-sans font-bold">
                                  null
                                </span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <ReasoningPanel
              title="Data Quality Observation"
              rationale="Look closely at missing cells marked in amber. In standard automated workflows, tools silently drop or fill these without warning you about distribution distortion."
              assumptions={['Table shows raw in-memory dataset without hidden transformations.']}
              compact
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: STATISTICS                                            */}
        {/* ============================================================ */}
        {activeTab === 'stats' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Numerical Feature Descriptives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {numericColumns.map(col => {
                  const s = col.stats;
                  return (
                    <div key={col.name} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{col.name}</span>
                        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">numeric</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px]">Mean:</span>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s?.mean ?? 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Median:</span>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s?.median ?? 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Min - Max:</span>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s?.min} – {s?.max}</div>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Std Dev:</span>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s?.stdDev ?? 'N/A'}</div>
                        </div>
                      </div>
                      {/* Skew notice */}
                      {s?.mean !== undefined && s?.median !== undefined && Math.abs(s.mean - s.median) > 2 && (
                        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium pt-1">
                          ⚠️ Mean & Median diverge ({s.mean} vs {s.median}): Feature is skewed by outliers.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                Categorical Feature Distributions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDataset?.columns.filter(c => c.type !== 'numeric').map(col => (
                  <div key={col.name} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2 mb-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{col.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{col.uniqueCount} distinct values</span>
                    </div>
                    <div className="space-y-1.5">
                      {col.stats?.topValues?.map(tv => (
                        <div key={tv.value} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{tv.value || '<empty>'}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${(tv.count / (currentDataset?.rowCount || 1)) * 100}%` }}
                              />
                            </div>
                            <span className="text-slate-400 font-mono text-[10px] w-6 text-right">{tv.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: DATA QUALITY & IMPUTATION                             */}
        {/* ============================================================ */}
        {activeTab === 'quality' && (
          <div className="p-6 space-y-6">
            {/* Missing Values Breakdown */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Feature Missingness Health Map
              </h3>
              <div className="space-y-2">
                {currentDataset?.columns.map(col => {
                  const pct = Math.round((col.missingCount / (currentDataset.rowCount || 1)) * 100);
                  return (
                    <div key={col.name} className="flex items-center justify-between text-xs gap-3">
                      <span className="w-40 font-medium text-slate-800 dark:text-slate-200 truncate">{col.name}</span>
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${col.missingCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                      <span className={`w-28 text-right font-mono text-[11px] ${col.missingCount > 0 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                        {col.missingCount} missing ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Imputation Simulator */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Interactive Missing Value Treatment</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Preview how imputation affects statistical parameters before committing changes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Column Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Select Target Column
                  </label>
                  <select
                    value={selectedImputeCol}
                    onChange={(e) => setSelectedImputeCol(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {currentDataset?.columns.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name} ({c.missingCount} missing)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Strategy Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Select Strategy
                  </label>
                  <select
                    value={selectedStrategy}
                    onChange={(e) => setSelectedStrategy(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="median">Fill with Median (Robust to outliers)</option>
                    <option value="mean">Fill with Mean (Sensitive to skew)</option>
                    <option value="drop">Drop rows with missing values</option>
                  </select>
                </div>

                {/* Apply Action */}
                <div className="flex items-end gap-2">
                  <button
                    onClick={() => {
                      applyDataCleaning({
                        column: selectedImputeCol,
                        missingStrategy: selectedStrategy
                      });
                    }}
                    className="w-full p-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                  >
                    Apply Imputation
                  </button>
                </div>
              </div>

              {/* Duplicate Rows Action */}
              {currentDataset && currentDataset.duplicateRowCount > 0 && (
                <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between">
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    ⚠️ Found {currentDataset.duplicateRowCount} duplicate record(s) in this dataset.
                  </div>
                  <button
                    onClick={() => applyDataCleaning({ removeDuplicates: true })}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                  >
                    Remove Duplicate Rows
                  </button>
                </div>
              )}
            </div>

            <ReasoningPanel
              title="Pedagogical Rationale: Imputation Trade-offs"
              rationale="When imputing numerical features, check if the mean and median diverge. If mean > median, positive outliers exist, so median imputation protects your model against leverage distortion. If data is Missing Completely At Random (MCAR), mean is unbiased in large samples, but still deflates standard errors."
              assumptions={['Imputation is performed unconditionally on the single feature column.']}
              alternatives={['Multiple Imputation by Chained Equations (MICE)', 'KNN Imputation']}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: VISUALIZATIONS                                        */}
        {/* ============================================================ */}
        {activeTab === 'viz' && (
          <div className="p-6 space-y-6">
            {/* Viz Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Chart Type
                </label>
                <div className="flex bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg">
                  {(['scatter', 'bar', 'line'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setVizType(type)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded capitalize transition-all ${
                        vizType === type
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  X-Axis Variable
                </label>
                <select
                  value={selectedXCol}
                  onChange={(e) => setSelectedXCol(e.target.value)}
                  className="w-full p-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  {currentDataset?.columns.map(c => (
                    <option key={c.name} value={c.name}>{c.name} ({c.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Y-Axis (Numeric Measure)
                </label>
                <select
                  value={selectedYCol}
                  onChange={(e) => setSelectedYCol(e.target.value)}
                  className="w-full p-2 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                >
                  {numericColumns.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Real Chart Canvas */}
            <div className="h-80 w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <ResponsiveContainer width="100%" height="100%">
                {vizType === 'scatter' ? (
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis 
                      dataKey={typeof chartData[0]?.x === 'number' ? 'xNum' : 'index'} 
                      name={selectedXCol} 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      label={{ value: selectedXCol, position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748B' }}
                    />
                    <YAxis 
                      dataKey="y" 
                      name={selectedYCol} 
                      stroke="#94a3b8" 
                      fontSize={11} 
                      label={{ value: selectedYCol, angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748B' }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }} 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Scatter name={`${selectedXCol} vs ${selectedYCol}`} data={chartData} fill="#10B981" />
                  </ScatterChart>
                ) : vizType === 'bar' ? (
                  <BarChart data={chartData.slice(0, 15)} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="x" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Bar dataKey="y" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="x" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', color: '#fff', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Line type="monotone" dataKey="y" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            <ReasoningPanel
              title="Visual Grammar Reasoning"
              rationale={`Viewing ${selectedXCol} against ${selectedYCol} using a ${vizType} plot. Scatter plots are preferred when both axes are continuous ratio variables because they retain individual bivariate variance rather than binning data into arbitrary intervals.`}
              compact
            />
          </div>
        )}
      </div>
    </div>
  );
};
