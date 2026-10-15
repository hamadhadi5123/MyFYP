import { CausalScenario } from '../types';

export const CAUSAL_SCENARIOS: CausalScenario[] = [
  {
    id: 'study-attendance-exam',
    title: 'Study Hours, Tutoring, and Exam Scores',
    domain: 'Educational Data Science',
    hypothesis: 'Increasing weekly study hours directly causes higher final exam performance, but tutoring serves as an active mediator while intrinsic motivation acts as an unobserved confounder.',
    observedPattern: 'Students who study >15 hours/week average 92.4% on final exams, compared to 58.2% for those studying <8 hours/week (Pearson r = +0.89, p < 0.001).',
    plausibleInterpretation: 'Deliberate study time strengthens conceptual consolidation and problem-solving automaticity, leading directly to higher exam scores.',
    nodes: [
      { id: 'motivation', label: 'Intrinsic Motivation', category: 'confounder', description: 'Unobserved psychological drive that increases both study endurance and exam focus.', x: 250, y: 40 },
      { id: 'study_hours', label: 'Study Hours (X)', category: 'treatment', description: 'Weekly self-directed study hours (Observable predictor).', x: 100, y: 180 },
      { id: 'tutoring', label: 'Tutoring Attendance', category: 'mediator', description: 'Active structured coaching that clarifies misconceptions during study sessions.', x: 250, y: 180 },
      { id: 'exam_score', label: 'Exam Score (Y)', category: 'outcome', description: 'Final standardized exam outcome (Target variable).', x: 400, y: 180 },
      { id: 'decision_impute', label: 'Analysis Decision: Stratified Regression', category: 'decision', description: 'Control for tutoring attendance and prior score to isolate direct marginal return of study time.', x: 250, y: 280 }
    ],
    edges: [
      { from: 'motivation', to: 'study_hours', label: 'drives', strength: 'strong', isConfounding: true },
      { from: 'motivation', to: 'exam_score', label: 'enhances', strength: 'strong', isConfounding: true },
      { from: 'study_hours', to: 'tutoring', label: 'triggers', strength: 'moderate' },
      { from: 'tutoring', to: 'exam_score', label: 'improves', strength: 'strong' },
      { from: 'study_hours', to: 'exam_score', label: 'direct effect', strength: 'strong' },
      { from: 'decision_impute', to: 'exam_score', label: 'adjusts for bias', strength: 'moderate' }
    ],
    assumptions: [
      'Study hours recorded via weekly logs are truthful and reflect focused active learning rather than passive sitting.',
      'Tutoring attendance is voluntary; students attending tutoring did so out of need or parental initiative.',
      'The standardized exam measures actual mastery rather than test-taking tricks or memorization shortcuts.'
    ],
    alternativeExplanations: [
      'Reverse Causality / Early Feedback: Students who score well early in the semester are encouraged and voluntarily study more hours (positive feedback loop).',
      'Socioeconomic Confounding: Higher-income families provide quiet home study environments, private tutors, and better nutrition, simultaneously raising hours and scores.',
      'Measurement Skew: Lower-performing students may under-report study time out of embarrassment, exaggerating the gap.'
    ],
    evidenceNeeded: [
      'Pre-test baseline score (to measure within-subject improvement delta rather than raw final score).',
      'Randomized assignment of 3 additional study hours per week across a matched cohort.',
      'Detailed log of study methods (active recall vs passive reading) to separate volume from technique.'
    ],
    limitations: [
      'Observational student data cannot completely rule out unmeasured personality factors like grit or cognitive speed.',
      'Small sample size in pilot batches (N = 24) widens 95% confidence intervals around effect sizes.',
      'External validity: Findings from Riphah International University undergraduate CS students may not generalize to high-school cohorts.'
    ],
    deepReasoningLevels: [
      {
        level: 1,
        title: 'Level 1: The Observational Association',
        explanation: 'At the surface level, every additional hour of weekly study is associated with a 2.4 point gain in final exam scores ($R^2 = 0.79$). A naive co-pilot would simply recommend: "Tell all students to study 20 hours to get an A."'
      },
      {
        level: 2,
        title: 'Level 2: The Confounding Backdoor',
        explanation: 'Looking deeper, student motivation is a common parent causing both study duration and retention. If we ignore motivation, the estimated coefficient $\\beta_1$ absorbs both the genuine causal return of study and the latent effect of motivation (Omitted Variable Bias).'
      },
      {
        level: 3,
        title: 'Level 3: The Mediation Mechanism',
        explanation: 'Tutoring attendance mediates ~32% of the total effect. Motivated students who study long hours also seek tutoring when stuck, turning study friction into breakthroughs. Without tutoring, study hours exhibit diminishing marginal returns.'
      },
      {
        level: 4,
        title: 'Level 4: The Counterfactual Recommendation',
        explanation: 'The rigorous co-pilot recommendation: Do not mandate rigid hours. Instead, scaffold active problem-solving intervals paired with immediate tutor feedback. This intervenes on the mechanism rather than the passive proxy metric.'
      }
    ]
  },
  {
    id: 'missing-values-imputation',
    title: 'Missing Data Imputation & Downstream Variance',
    domain: 'Data Preprocessing & Quality',
    hypothesis: 'Imputing missing previous_score with mean vs median fundamentally alters regression slope and standard errors.',
    observedPattern: 'Two students have missing previous_score. Mean is 72.8, while Median is 76.0 due to two severe negative outliers (40 and 42).',
    plausibleInterpretation: 'Median imputation avoids pulling downstream predictions toward extreme low performers.',
    nodes: [
      { id: 'missingness', label: 'Missing Data Mechanism', category: 'confounder', description: 'Whether scores are missing at random (MAR) or due to severe failure (MNAR).', x: 250, y: 40 },
      { id: 'imputation_choice', label: 'Imputation Strategy (X)', category: 'treatment', description: 'Choosing Mean vs Median vs MICE.', x: 100, y: 180 },
      { id: 'dataset_variance', label: 'Sample Variance & Leverage', category: 'mediator', description: 'Spread of the predictor column and leverage points.', x: 250, y: 180 },
      { id: 'model_estimate', label: 'Downstream Slope β (Y)', category: 'outcome', description: 'Estimated linear regression slope and confidence bounds.', x: 400, y: 180 },
      { id: 'audit_decision', label: 'Decision: Imputation Indicator Flag', category: 'decision', description: 'Add binary indicator column so model knows which records were synthetic.', x: 250, y: 280 }
    ],
    edges: [
      { from: 'missingness', to: 'imputation_choice', label: 'informs', strength: 'strong', isConfounding: true },
      { from: 'missingness', to: 'model_estimate', label: 'induces bias', strength: 'strong', isConfounding: true },
      { from: 'imputation_choice', to: 'dataset_variance', label: 'directly alters', strength: 'strong' },
      { from: 'dataset_variance', to: 'model_estimate', label: 'shifts slope', strength: 'strong' },
      { from: 'audit_decision', to: 'model_estimate', label: 'preserves degrees of freedom', strength: 'moderate' }
    ],
    assumptions: [
      'The missing scores were caused by administrative reporting lag, not students dropping out due to failing.',
      'Variance reduction of 1-2% from 2 imputed values will not severely distort model F-statistic.'
    ],
    alternativeExplanations: [
      'Missing Not at Random (MNAR): Students who skipped the preliminary test did so specifically because they expected a failing grade (<30). In this case, imputing 76.0 creates massive upward bias.'
    ],
    evidenceNeeded: [
      'Interviews with registrar or course instructor to confirm why the two records were missing.',
      'Sensitivity analysis comparing model predictions under extreme worst-case (score 30) vs best-case (score 90) imputation.'
    ],
    limitations: [
      'Single imputation underestimates parameter variance compared to Multiple Imputation by Chained Equations (MICE).',
      'Cannot recover true unobserved information without domain ground truth.'
    ],
    deepReasoningLevels: [
      {
        level: 1,
        title: 'Level 1: The Missing Cells',
        explanation: 'Rows 5 and 21 are missing previous_score. A naive script simply calls df.fillna(df.mean()).'
      },
      {
        level: 2,
        title: 'Level 2: The Outlier Pull',
        explanation: 'Because rows 9 and 19 scored 40 and 42, the mean is dragged down to 72.8, whereas the true typical student scored 76.0.'
      },
      {
        level: 3,
        title: 'Level 3: The Standard Error Illusion',
        explanation: 'Imputing a fixed constant gives your model artificial confidence—it pretends it has 24 real measurements, making p-values artificially narrow.'
      },
      {
        level: 4,
        title: 'Level 4: Best-Practice Synthesis',
        explanation: 'Apply median imputation (76.0) combined with an indicator column is_imputed_previous_score = 1. This alerts downstream algorithms to synthetic inputs.'
      }
    ]
  }
];
