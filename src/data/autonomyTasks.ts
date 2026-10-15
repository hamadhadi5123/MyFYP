import { PracticeTask, AutonomyLevelInfo } from '../types';

export const AUTONOMY_LEVELS: AutonomyLevelInfo[] = [
  {
    level: 0,
    name: 'Do It For Me',
    tagline: 'Full AI Execution',
    description: 'The co-pilot executes the entire analytical step and shows the final result and summary.',
    assistanceRatio: 100,
    color: '#64748B', // slate
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300',
  },
  {
    level: 1,
    name: 'Do It and Explain',
    tagline: 'Guided Walkthrough',
    description: 'The co-pilot performs the operation while providing detailed step-by-step reasoning for each decision.',
    assistanceRatio: 75,
    color: '#0284C7', // sky
    badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300',
  },
  {
    level: 2,
    name: 'Give Me Hints',
    tagline: 'Socratic Prompting',
    description: 'The co-pilot poses targeted guiding questions and conceptual hints before revealing any action steps.',
    assistanceRatio: 50,
    color: '#D97706', // amber
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
  },
  {
    level: 3,
    name: 'Check My Work',
    tagline: 'Evaluative Feedback',
    description: 'You formulate and execute your analysis choice first. The co-pilot validates your rationale and catches flaws.',
    assistanceRatio: 25,
    color: '#10B981', // emerald
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
  },
  {
    level: 4,
    name: 'Independent Work',
    tagline: 'Autonomous Mastery',
    description: 'Hands-off mode. You perform analysis independently. Support is completely faded unless explicitly summoned.',
    assistanceRatio: 0,
    color: '#059669', // deep emerald
    badgeClass: 'bg-emerald-600 text-white border-emerald-700',
  },
];

export const PRACTICE_TASKS: PracticeTask[] = [
  {
    id: 'task-outliers',
    title: 'Handling Skewness in Missing Numerical Values',
    category: 'cleaning',
    difficulty: 'Intermediate',
    context: 'In the Student Performance dataset, previous_score has 2 missing values. The distribution shows a slight left skew with extreme low outliers (e.g., student score 40).',
    question: 'Which imputation technique is most scientifically sound for previous_score before running linear regression, and why?',
    options: [
      'Fill with Mean (72.8): Because mean minimizes total squared errors unconditionally.',
      'Fill with Median (76.0): Because median is robust to extreme outliers and does not distort skewed distributions.',
      'Drop all rows containing missing values immediately without checking sample size.',
      'Fill with Zero (0.0): To penalize missing values.'
    ],
    correctOptionIndex: 1,
    explanation: 'Median imputation is robust against the influence of extreme outlier values (such as 40 or 42) that drag down the mean. Imputing with the median preserves the central tendency without inflating leverage in subsequent regression models.',
    hints: [
      'Look at the distribution of scores: are there extreme values on the lower end?',
      'Recall how the arithmetic mean responds to extreme minimum values compared to the median.',
      'Consider the impact of artificial zero-imputation on regression coefficients.'
    ],
    stepByStepSolution: [
      'Step 1: Check skewness and presence of outliers using a box plot or sorted distribution.',
      'Step 2: Notice that while mean is 72.8, the median is 76.0 due to a few very low scores (40, 42).',
      'Step 3: Select Median Imputation so that non-random missingness does not distort the estimated baseline.',
      'Step 4: Impute the 2 missing cells with 76.0 and verify standard error changes.'
    ],
    directSolution: 'Selected Strategy: Median Imputation (76.0). Imputed 2 missing records in previous_score. Verified variance reduced by only 1.2% while preserving median rank.'
  },
  {
    id: 'task-visualization',
    title: 'Visualizing Bivariate Relationships with Potential Confounders',
    category: 'visualization',
    difficulty: 'Beginner',
    context: 'You want to investigate if weekly study hours relate to final exam scores, while checking if tutoring attendance acts as a moderating factor.',
    question: 'What is the most effective chart configuration to explore this relationship without losing individual observation variance?',
    options: [
      'A Pie Chart showing proportions of tutoring attendance.',
      'A Scatter Plot with study_hours on X, final_exam_score on Y, and color-coded by tutoring_attended.',
      'A single Bar Chart of average exam score grouped only by gender.',
      'A 3D Surface Mesh plot.'
    ],
    correctOptionIndex: 1,
    explanation: 'A Scatter Plot preserves the continuous variance of both study hours and final exam scores. Coloring data points by tutoring attendance immediately surfaces interaction effects (e.g. slopes differing between tutored vs non-tutored students) without aggregating away individual data points.',
    hints: [
      'Both study_hours and final_exam_score are continuous ratio variables.',
      'How can a third categorical attribute (tutoring_attended) be represented on a 2D plane?',
      'Aggregating into bar charts loses information about variance and outliers.'
    ],
    stepByStepSolution: [
      'Step 1: Identify variable scales: study_hours (continuous numeric), final_exam_score (continuous numeric), tutoring_attended (binary categorical).',
      'Step 2: Map the two continuous variables to orthogonal Cartesian axes (X = study_hours, Y = final_exam_score).',
      'Step 3: Map the binary category to color hue (Emerald = Yes, Slate = No).',
      'Step 4: Inspect the bivariate distribution for linearity, homoscedasticity, and clustering.'
    ],
    directSolution: 'Generated Scatter Plot: X=study_hours_weekly, Y=final_exam_score, Color=tutoring_attended. Strong positive linear association observed (r ≈ 0.89).'
  },
  {
    id: 'task-correlation',
    title: 'Interpreting Correlation vs Causal Mechanism',
    category: 'reasoning',
    difficulty: 'Advanced',
    context: 'The data shows a high positive correlation (r = 0.94) between attendance rate and final exam score. A junior analyst concludes: "Enforcing 100% compulsory attendance will guarantee everyone scores above 90%."',
    question: 'What is the fundamental analytical flaw in this conclusion?',
    options: [
      'The sample size of 24 is too small to calculate correlation.',
      'The conclusion mistakes observational correlation for an invariant causal policy effect, ignoring unobserved confounders like student motivation and prior aptitude.',
      'Attendance cannot be measured in percentages.',
      'Correlation coefficients greater than 0.9 are always calculation errors.'
    ],
    correctOptionIndex: 1,
    explanation: 'Correlation merely quantifies co-occurrence. Confounding variables—such as intrinsic student motivation, conscientiousness, and prior foundational knowledge—drive both high attendance and high exam scores. Forcing physical attendance without altering motivation will not causally replicate the observed exam scores.',
    hints: [
      'Remember the foundational axiom: correlation describes co-occurrence, not the mechanism of intervention.',
      'What unobserved psychological or socioeconomic variables could cause both attendance AND exam success?',
      'If you intervene on attendance by locking students in a classroom, does their intrinsic learning ability automatically rise?'
    ],
    stepByStepSolution: [
      'Step 1: Separate the statistical fact (r = 0.94) from the causal claim (intervention will produce outcome).',
      'Step 2: Construct the Directed Acyclic Graph (DAG): Confounder (Student Motivation) -> Attendance AND Confounder (Student Motivation) -> Exam Score.',
      'Step 3: Recognize that the observed path Attendance <-> Exam Score is confounded by backdoor paths.',
      'Step 4: Formulate the conditional recommendation: Attendance is a strong diagnostic indicator, but intervention requires addressing engagement and instructional quality.'
    ],
    directSolution: 'Causal Review: Flaw identified. The correlation is confounded by Student Motivation and Prior Foundation. Policy intervention cannot assume invariant transfer without experimental or instrumental variable verification.'
  }
];
