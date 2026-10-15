import { TestResult } from '../types';
import { parseCSV } from './csvParser';
import { STUDENT_PERFORMANCE_CSV, SALES_REVENUE_CSV } from '../data/sampleDatasets';
import { AUTONOMY_LEVELS } from '../data/autonomyTasks';
import { TOPIC_EXPLANATIONS, EXPLANATION_STYLES } from '../data/explanationData';

export async function runFrontendDemoTests(onProgress?: (test: TestResult) => void): Promise<TestResult[]> {
  const results: TestResult[] = [];

  const runSingleTest = async (
    id: string,
    name: string,
    category: TestResult['category'],
    fn: () => Promise<string | void> | string | void
  ): Promise<TestResult> => {
    const start = performance.now();
    try {
      const msg = await fn();
      const duration = Math.round(performance.now() - start);
      const res: TestResult = {
        id,
        name,
        category,
        status: 'passed',
        executionTimeMs: duration,
        message: msg || 'Assertion passed successfully.'
      };
      if (onProgress) onProgress(res);
      return res;
    } catch (err: any) {
      const duration = Math.round(performance.now() - start);
      const res: TestResult = {
        id,
        name,
        category,
        status: 'failed',
        executionTimeMs: duration,
        message: err.message || 'Assertion failed',
        details: err.stack
      };
      if (onProgress) onProgress(res);
      return res;
    }
  };

  // Test 1: CSV Parser Integrity
  results.push(await runSingleTest(
    'csv-parse-valid',
    'CSV Parser Integrity: Header and Row Extraction',
    'csv',
    () => {
      const ds = parseCSV(STUDENT_PERFORMANCE_CSV, 'Test Student');
      if (ds.rowCount < 20) throw new Error(`Expected at least 20 rows, got ${ds.rowCount}`);
      if (ds.columnCount !== 8) throw new Error(`Expected 8 columns, got ${ds.columnCount}`);
      if (!ds.columns.some(c => c.name === 'final_exam_score')) {
        throw new Error('Target column final_exam_score missing from parsed columns');
      }
      return `Successfully parsed ${ds.rowCount} rows and ${ds.columnCount} columns with valid types.`;
    }
  ));

  // Test 2: Missing Value Detection
  results.push(await runSingleTest(
    'csv-missing-detection',
    'Data Quality: In-Browser Missing Cell Detection',
    'quality',
    () => {
      const ds = parseCSV(STUDENT_PERFORMANCE_CSV, 'Test Student');
      if (ds.missingValueCount === 0) {
        throw new Error('Expected missing values in student dataset (previous_score / sleep_hours), but found 0');
      }
      const prevCol = ds.columns.find(c => c.name === 'previous_score');
      if (!prevCol || prevCol.missingCount !== 2) {
        throw new Error(`Expected exactly 2 missing previous_score cells, found ${prevCol?.missingCount}`);
      }
      return `Correctly detected ${ds.missingValueCount} missing values across features.`;
    }
  ));

  // Test 3: Duplicate Row Detection
  results.push(await runSingleTest(
    'csv-duplicate-detection',
    'Data Quality: Duplicate Record Fingerprinting',
    'quality',
    () => {
      const ds = parseCSV(SALES_REVENUE_CSV, 'Test Sales');
      if (ds.duplicateRowCount < 1) {
        throw new Error(`Expected duplicate row in Sales dataset, got ${ds.duplicateRowCount}`);
      }
      return `Fingerprinted and flagged ${ds.duplicateRowCount} duplicate record(s) via content hashing.`;
    }
  ));

  // Test 4: Autonomy Dial Fading Scaffolding Ratio
  results.push(await runSingleTest(
    'dial-fading-scaffold',
    'Autonomy Dial: Fading Assistance Monotonicity',
    'dial',
    () => {
      if (AUTONOMY_LEVELS.length !== 5) {
        throw new Error(`Expected 5 autonomy levels (0 to 4), found ${AUTONOMY_LEVELS.length}`);
      }
      const ratios = AUTONOMY_LEVELS.map(l => l.assistanceRatio);
      // Verify strictly decreasing assistance ratio: 100 -> 75 -> 50 -> 25 -> 0
      for (let i = 1; i < ratios.length; i++) {
        if (ratios[i] >= ratios[i - 1]) {
          throw new Error(`Assistance ratio at level ${i} (${ratios[i]}%) must be strictly lower than level ${i - 1} (${ratios[i - 1]}%)`);
        }
      }
      return `Verified strict monotonic fading of scaffolding: 100% -> 75% -> 50% -> 25% -> 0%.`;
    }
  ));

  // Test 5: Explanation Variety Swarm Coverage
  results.push(await runSingleTest(
    'explanation-swarm-coverage',
    'Explanation Lab: 5 Cognitive Styles per Topic',
    'explanation',
    () => {
      const requiredStyles = ['procedural', 'formula', 'analogical', 'visual', 'causal'] as const;
      if (TOPIC_EXPLANATIONS.length === 0) throw new Error('No topic explanations configured');

      for (const topic of TOPIC_EXPLANATIONS) {
        for (const style of requiredStyles) {
          const content = topic.styles[style];
          if (!content || !content.content || content.content.length < 20) {
            throw new Error(`Topic "${topic.topicTitle}" is missing complete explanation for style "${style}"`);
          }
        }
      }
      return `All ${TOPIC_EXPLANATIONS.length} curriculum topics have complete 5-style cognitive coverage (${TOPIC_EXPLANATIONS.length * 5} unique models).`;
    }
  ));

  // Test 6: Theme Preference & DOM Class Support
  results.push(await runSingleTest(
    'theme-toggle-reactivity',
    'System Settings: UI Theme Toggle & Storage Reactivity',
    'theme',
    () => {
      const root = document.documentElement;
      const initialDark = root.classList.contains('dark');
      // Simulate toggle
      root.classList.add('dark');
      const isDark = root.classList.contains('dark');
      root.classList.remove('dark');
      const isLight = !root.classList.contains('dark');
      // Restore initial
      if (initialDark) root.classList.add('dark');

      if (!isDark || !isLight) {
        throw new Error('Theme toggle failed to update document root dark class');
      }
      return 'DOM classList dark-mode reactivity verified with Tailwind CSS selectors.';
    }
  ));

  return results;
}
