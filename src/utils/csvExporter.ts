import { Dataset } from '../types';

/**
 * Converts dataset rows to CSV format and triggers browser download.
 */
export function exportDatasetToCSV(dataset: Dataset, filenameSuffix = '_cleaned'): boolean {
  try {
    if (!dataset || dataset.rows.length === 0) {
      throw new Error('Dataset is empty. Nothing to export.');
    }

    const headers = dataset.columns.map(c => c.name);
    
    const escapeField = (value: any): string => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = headers.map(escapeField).join(',');
    const rowLines = dataset.rows.map(row => 
      headers.map(h => escapeField(row[h])).join(',')
    );

    const csvContent = [headerLine, ...rowLines].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const cleanName = dataset.name.replace(/\.[^/.]+$/, '');
    link.href = URL.createObjectURL(blob);
    link.download = `${cleanName}${filenameSuffix}.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    return true;
  } catch (err) {
    console.error('CSV Export failed:', err);
    return false;
  }
}
