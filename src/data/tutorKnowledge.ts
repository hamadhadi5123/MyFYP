import { Dataset } from '../types';

export interface TutorResponse {
  content: string;
  suggestedFollowUps: string[];
  reasoningSnippet?: string;
}

export function generateTutorResponse(prompt: string, currentDataset?: Dataset | null): TutorResponse {
  const query = prompt.toLowerCase().trim();
  const dsName = currentDataset?.name || 'the current dataset';
  const rowCount = currentDataset?.rowCount || 0;
  const colCount = currentDataset?.columnCount || 0;
  const missingCount = currentDataset?.missingValueCount || 0;
  const duplicateCount = currentDataset?.duplicateRowCount || 0;
  const colNames = currentDataset?.columns.map(c => c.name).join(', ') || 'N/A';
  const numericCols = currentDataset?.columns.filter(c => c.type === 'numeric').map(c => c.name) || [];
  const categoricalCols = currentDataset?.columns.filter(c => c.type === 'categorical').map(c => c.name) || [];

  // 1. Explain dataset
  if (query.includes('explain') && (query.includes('dataset') || query.includes('data') || query.includes('summary'))) {
    if (!currentDataset) {
      return {
        content: `I don't see an active dataset loaded yet. Please head to the **Dataset Workspace** to upload a CSV file or load one of our built-in benchmarks (such as *Student Performance*, *Sales*, or *Weather*). Once loaded, I'll break down its structure, data types, and potential analytical paths!`,
        suggestedFollowUps: [
          'Load Student Performance sample',
          'How should I handle missing values?',
          'Which chart should I use?'
        ]
      };
    }

    return {
      content: `### Dataset Overview: **${dsName}**

- **Dimensions:** **${rowCount}** records across **${colCount}** attributes.
- **Attributes:** \`${colNames}\`
- **Data Quality:** Found **${missingCount}** missing values and **${duplicateCount}** duplicate records.
- **Data Types:** ${numericCols.length} numerical columns (\`${numericCols.slice(0, 4).join(', ')}\`) and ${categoricalCols.length} categorical columns (\`${categoricalCols.slice(0, 3).join(', ')}\`).

**Pedagogical Guidance:**
Before diving into complex machine learning or regression, ask yourself:
1. Are there missing values that could distort the distribution? (We found ${missingCount}).
2. Do duplicate rows represent real repeated events or data logging errors?
3. Which feature serves as your intended outcome variable?`,
      suggestedFollowUps: [
        'How should I handle missing values in this dataset?',
        'Which chart should I use for these variables?',
        'Why should I check for duplicate rows?'
      ],
      reasoningSnippet: `Tutor checked actual dataset metadata (${rowCount} rows, ${missingCount} missing cells). In capability-preserving mode, the co-pilot prompts the learner to define their target hypothesis rather than hallucinating conclusions.`
    };
  }

  // 2. Handle missing values
  if (query.includes('missing') || query.includes('imput') || query.includes('null') || query.includes('na')) {
    return {
      content: `### Handling Missing Values: A Capability-Preserving Guide

In **${dsName}**, we detected **${missingCount} missing values**.

Instead of automatically filling them, here is the decision framework every data analyst must master:

1. **Diagnose the Mechanism:**
   - **MCAR (Completely at Random):** Missingness is unrelated to any variable (e.g., random sensor drop).
   - **MAR (At Random):** Missingness depends on observed variables (e.g., younger students forgetting to report).
   - **MNAR (Not at Random):** Missingness depends on the value itself (e.g., students who failed hid their score).

2. **Choose Your Imputation Strategy:**
   - **Mean Imputation:** Quick, but highly sensitive to outliers.
   - **Median Imputation (Recommended for skewed features):** Preserves the center without being dragged by extreme tails.
   - **Deletion (Listwise/Pairwise):** Safe only if sample size is large and missingness is strictly MCAR (<5%).

3. **Auditing Tip:** Always create a shadow indicator column (e.g. \`was_imputed = 1\`) so downstream models can account for uncertainty!`,
      suggestedFollowUps: [
        'What is the difference between Mean and Median imputation?',
        'Show me this in the Learning Studio with Autonomy Dial',
        'Which chart should I use to inspect outliers?'
      ],
      reasoningSnippet: `Guidance emphasizes diagnosing the missingness mechanism (MCAR vs MNAR) before blind imputation, preventing standard error deflation.`
    };
  }

  // 3. Chart selection
  if (query.includes('chart') || query.includes('plot') || query.includes('visualiz')) {
    return {
      content: `### Selecting the Right Visualization

Visual encoding is not about decoration—it is about matching geometric primitives to variable scales of measurement:

| Objective | Data Types | Recommended Chart | Why? |
| :--- | :--- | :--- | :--- |
| **Bivariate Relationship** | Numeric vs Numeric | **Scatter Plot** | Preserves continuous variance and shows non-linear clusters |
| **Categorical Comparison** | Categorical vs Numeric | **Bar Chart** | Discrete baseline with clear height comparisons |
| **Univariate Distribution** | Single Numeric | **Histogram / Boxplot** | Reveals skewness, bimodality, and extreme outliers |
| **Temporal Trend** | Date/Time vs Numeric | **Line Chart** | Preserves chronological continuity |

In **${dsName}**, you can explore pairs like **\`${numericCols[0] || 'study_hours'}\`** vs **\`${numericCols[1] || 'final_exam_score'}\`** right in the **Dataset Workspace Visualizations Tab**!`,
      suggestedFollowUps: [
        'What does correlation mean in a scatter plot?',
        'Why not use a pie chart?',
        'Explain this analysis step by step.'
      ],
      reasoningSnippet: `Chart recommendations map explicitly to Stevens' scales of measurement (nominal, ordinal, interval, ratio).`
    };
  }

  // 4. Correlation vs Causation
  if (query.includes('correlation') || query.includes('caus') || query.includes('relationship') || query.includes('pearson')) {
    return {
      content: `### Understanding Correlation vs. Causal Mechanism

**Pearson Correlation ($r$)** measures the strength and direction of a **linear association** between two continuous variables on a scale from $-1.0$ to $+1.0$:

- **$r > +0.7$:** Strong positive linear co-occurrence.
- **$r \\approx 0$:** No linear association (though strong non-linear relationships can still exist!).
- **$r < -0.7$:** Strong negative linear co-occurrence.

⚠️ **The Golden Axiom:** *Correlation does not imply causation.*
Even if variable $X$ correlates with variable $Y$ at $r = 0.95$, there are 3 alternative explanations:
1. **$Y$ causes $X$** (Reverse causality)
2. **Confounder $Z$ causes both $X$ and $Y$** (The common-cause backdoor)
3. **Pure spurious coincidence** (Spurious correlation)

Check out our **Causal Mentor Engine** in the sidebar to interactively map confounders with Directed Acyclic Graphs (DAGs)!`,
      suggestedFollowUps: [
        'Open Causal Mentor Engine',
        'How do I test if a relationship is confounded?',
        "What is Pearl's do-calculus?"
      ],
      reasoningSnippet: `Reinforces causal hygiene and points the learner to the Causal Mentor engine for structural DAG exploration.`
    };
  }

  // 5. Duplicate rows
  if (query.includes('duplicate') || query.includes('dedup')) {
    return {
      content: `### Why You Must Inspect Duplicate Records

In **${dsName}**, there are **${duplicateCount} duplicate row(s)** detected.

Duplicate records can introduce severe analytical distortions:
1. **False Sample Size ($N$):** Artificially doubles degrees of freedom, creating artificially low p-values.
2. **Data Leakage in Machine Learning:** If identical rows land in both the training set and test set, your test evaluation is contaminated.
3. **Distorted Aggregations:** Sums and counts will double-count revenue or incidents.

**Analytical Rule:** Always distinguish between *accidental duplicate submissions* (which must be removed) and *genuine identical transactions* (which require unique transaction IDs). You can preview and clean duplicate rows in the **Dataset Workspace Data Quality Tab**.`,
      suggestedFollowUps: [
        'How should I handle missing values?',
        'Explain my dataset.',
        'Show me in Dataset Workspace'
      ],
      reasoningSnippet: `Clarifies the statistical risks of pseudo-replication and data leakage in split evaluation.`
    };
  }

  // 6. Step by step analysis
  if (query.includes('step') || query.includes('workflow') || query.includes('guide')) {
    return {
      content: `### The 5-Phase Rigorous Data Analysis Workflow

1. **Ingest & Sanitize (Quality First):**
   - Check schema and types.
   - Inspect missingness and duplicate entries.
   - Resolve discrepancies before touching statistical models.

2. **Exploratory Data Analysis (EDA):**
   - Examine univariate distributions (mean, median, IQR, skew).
   - Generate bivariate scatter plots to detect non-linear patterns and outliers.

3. **Causal & Structural Formulation:**
   - Map your hypothesis into a DAG (Treatment $\\to$ Outcome, conditioning on Confounders).
   - Beware of conditioning on colliders or mediators.

4. **Statistical Modeling / Inference:**
   - Select models matching distributional assumptions (e.g. Robust regression for skewed targets).

5. **Self-Auditing & Fading:**
   - Validate findings against domain limitations and sample constraints.`,
      suggestedFollowUps: [
        'How do I adjust the Autonomy Dial for this workflow?',
        'Which chart should I use?',
        'Explain my dataset.'
      ],
      reasoningSnippet: `Structured pedagogical workflow aligned with university-level methodology.`
    };
  }

  // Generic fallback
  return {
    content: `I understand you're asking about **"${prompt}"**.

In DataMind's **Frontend Demo Mode**, I specialize in data-analysis methodology, data quality, exploratory visualization, and causal reasoning.

Here are topics we can explore together right now with **${dsName}**:
- **Dataset Assessment:** Ask *"Explain my dataset"* to inspect rows, columns, and quality flags.
- **Data Quality:** Ask *"How should I handle missing values?"* or *"Why should I check for duplicate rows?"*
- **Visual Exploration:** Ask *"Which chart should I use?"*
- **Causal Inference:** Ask *"What does correlation mean?"* or visit the **Causal Mentor Engine**.

What would you like to investigate?`,
    suggestedFollowUps: [
      'Explain my dataset.',
      'How should I handle missing values?',
      'Which chart should I use?',
      'What does correlation mean?'
    ],
    reasoningSnippet: `Demo responder grounded in educational scaffold prompts.`
  };
}
