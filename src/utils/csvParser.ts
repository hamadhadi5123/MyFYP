import { Dataset, DatasetColumn } from '../types';

/**
 * Parses raw CSV string respecting quoted fields, escaped quotes, and different newline conventions.
 */
export function parseCSV(rawText: string, datasetName = 'Uploaded Dataset'): Dataset {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error('The provided CSV file is empty.');
  }

  // Parse rows with quote-aware state machine
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    const nextChar = rawText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++; // skip \n
        }
        currentRow.push(currentField.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(c => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  // Push final field/row if any
  if (currentField.length > 0 || inQuotes) {
    currentRow.push(currentField.trim());
  }
  if (currentRow.length > 0 && currentRow.some(c => c.length > 0)) {
    rows.push(currentRow);
  }

  if (rows.length < 2) {
    throw new Error('CSV must contain at least a header row and one data row.');
  }

  const rawHeaders = rows[0].map((h, idx) => h.trim() || `Column_${idx + 1}`);
  // Deduplicate headers if needed
  const headerCounts: Record<string, number> = {};
  const headers = rawHeaders.map(h => {
    headerCounts[h] = (headerCounts[h] || 0) + 1;
    return headerCounts[h] > 1 ? `${h}_${headerCounts[h]}` : h;
  });

  const dataRows = rows.slice(1);
  const rowObjects: Record<string, any>[] = [];

  for (const row of dataRows) {
    const obj: Record<string, any> = {};
    for (let colIdx = 0; colIdx < headers.length; colIdx++) {
      const val = row[colIdx] !== undefined ? row[colIdx].trim() : '';
      obj[headers[colIdx]] = val;
    }
    rowObjects.push(obj);
  }

  // Calculate duplicate rows
  const seenRowStrings = new Set<string>();
  let duplicateRowCount = 0;
  for (const obj of rowObjects) {
    const serialized = JSON.stringify(obj);
    if (seenRowStrings.has(serialized)) {
      duplicateRowCount++;
    } else {
      seenRowStrings.add(serialized);
    }
  }

  // Analyze columns
  let totalMissing = 0;
  const columns: DatasetColumn[] = headers.map(header => {
    let missingCount = 0;
    const values: any[] = [];

    for (const row of rowObjects) {
      const v = row[header];
      if (v === '' || v === null || v === undefined || v === 'NA' || v === 'NaN' || v === 'null') {
        missingCount++;
        row[header] = null; // Normalize missing to null
      } else {
        values.push(v);
      }
    }
    totalMissing += missingCount;

    // Detect type
    const nonMissingValues = values.filter(v => v !== null);
    const numericValues: number[] = [];
    let isBoolean = true;

    for (const v of nonMissingValues) {
      const str = String(v).toLowerCase();
      if (str !== 'true' && str !== 'false' && str !== '0' && str !== '1' && str !== 'yes' && str !== 'no') {
        isBoolean = false;
      }
      const num = Number(v);
      if (!isNaN(num) && v !== '') {
        numericValues.push(num);
      }
    }

    const isNumeric = nonMissingValues.length > 0 && numericValues.length === nonMissingValues.length;

    let colType: 'numeric' | 'categorical' | 'boolean' | 'date' = 'categorical';
    if (isBoolean && nonMissingValues.length > 0) {
      colType = 'boolean';
    } else if (isNumeric) {
      colType = 'numeric';
      // Convert row values to numbers
      for (const row of rowObjects) {
        if (row[header] !== null) {
          row[header] = Number(row[header]);
        }
      }
    }

    // Compute column stats
    const uniqueValues = new Set(nonMissingValues.map(String));
    let stats: DatasetColumn['stats'] = undefined;

    if (colType === 'numeric' && numericValues.length > 0) {
      numericValues.sort((a, b) => a - b);
      const min = numericValues[0];
      const max = numericValues[numericValues.length - 1];
      const sum = numericValues.reduce((acc, curr) => acc + curr, 0);
      const mean = Math.round((sum / numericValues.length) * 100) / 100;
      
      const mid = Math.floor(numericValues.length / 2);
      const median = numericValues.length % 2 !== 0
        ? numericValues[mid]
        : Math.round(((numericValues[mid - 1] + numericValues[mid]) / 2) * 100) / 100;

      const variance = numericValues.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / numericValues.length;
      const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;

      stats = { min, max, mean, median, stdDev };
    } else {
      // Categorical frequency
      const freq: Record<string, number> = {};
      for (const v of nonMissingValues) {
        const key = String(v);
        freq[key] = (freq[key] || 0) + 1;
      }
      const topValues = Object.entries(freq)
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      stats = { topValues };
    }

    return {
      name: header,
      type: colType,
      missingCount,
      uniqueCount: uniqueValues.size,
      stats,
    };
  });

  return {
    id: `ds-${Date.now()}`,
    name: datasetName,
    description: `Parsed ${dataRows.length} rows and ${headers.length} columns from ${datasetName}`,
    rowCount: dataRows.length,
    columnCount: headers.length,
    missingValueCount: totalMissing,
    duplicateRowCount,
    columns,
    rows: rowObjects,
    source: datasetName.includes('Sample') ? 'sample' : 'uploaded',
  };
}
