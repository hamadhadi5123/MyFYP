import { StyleOption, TopicExplanation } from '../types';

export const EXPLANATION_STYLES: StyleOption[] = [
  {
    id: 'procedural',
    name: 'Procedural',
    iconName: 'ListOrdered',
    shortDescription: 'Step-by-step sequential actions and algorithmic flow',
    cognitiveTarget: 'Action-oriented execution and exact implementation sequence'
  },
  {
    id: 'formula',
    name: 'Formula-Based',
    iconName: 'Sigma',
    shortDescription: 'Mathematical formulation, equations, and exact derivations',
    cognitiveTarget: 'Quantitative rigor, algebraic intuition, and formal definitions'
  },
  {
    id: 'analogical',
    name: 'Analogical',
    iconName: 'Sparkles',
    shortDescription: 'Real-world metaphors and tangible conceptual analogies',
    cognitiveTarget: 'Intuitive mental models, conceptual anchors, and rapid recall'
  },
  {
    id: 'visual',
    name: 'Visual & Diagram',
    iconName: 'LayoutGrid',
    shortDescription: 'Geometric representation, spatial layouts, and visual flowcharts',
    cognitiveTarget: 'Spatial reasoning, distribution geometry, and visual patterns'
  },
  {
    id: 'causal',
    name: 'Causal & Reasoning',
    iconName: 'Network',
    shortDescription: 'Mechanism-level rationale, underlying assumptions, and trade-offs',
    cognitiveTarget: 'Critical evaluation, decision rationale, and falsifiability'
  }
];

export const TOPIC_EXPLANATIONS: TopicExplanation[] = [
  {
    topicId: 'mean-vs-median',
    topicTitle: 'Mean vs Median Imputation for Missing Values',
    category: 'cleaning',
    summary: 'Choosing between arithmetic average and positional middle value when replacing missing records.',
    styles: {
      procedural: {
        title: 'Algorithmic Imputation Workflow',
        content: `1. Scan Column: Identify all null, empty string, or NaN cells in the target feature.
2. Check Distribution: Plot a histogram or calculate skewness metric. If absolute skewness > 1.0, flag as skewed.
3. Sort Non-Null Values: Arrange valid observations in ascending numerical order.
4. Calculate Median: If count N is odd, pick index (N+1)/2. If even, average values at N/2 and (N/2)+1.
5. Replace & Flag: Impute all missing cells with this computed median; generate an indicator column 'was_imputed' for auditability.`,
        keyTakeaway: 'Follow the algorithmic check: skew check -> sort -> rank midpoint -> impute.'
      },
      formula: {
        title: 'Mathematical Formulation & Influence Functions',
        content: `Arithmetic Mean:
$$\\bar{x} = \\frac{1}{N} \\sum_{i=1}^{N} x_i$$
Notice that any single extreme outlier $x_k \\to \\infty$ forces $\\bar{x} \\to \\infty$. Its breakdown point is $0\\%$.

Median:
$$M = x_{\\left(\\frac{N+1}{2}\\right)} \\text{ (odd } N\\text{)}$$
The median has a breakdown point of $50\\%$: up to half the sample values can be arbitrarily corrupted without causing the median to diverge to infinity.`,
        keyTakeaway: 'The median minimizes L1 norm (absolute errors), making it invariant to extreme tail extremes.'
      },
      analogical: {
        title: 'The Bill Gates at the Local Bar Metaphor',
        content: `Imagine ten regular people sitting at a neighborhood coffee shop, each earning \\$50,000 a year. 
The average (mean) income in the room is \\$50,000. The median income is \\$50,000.

Now Bill Gates walks in. 
The average income in the room instantly explodes to \\$100,000,000! If you fill a missing person's income with this new average, you'll record them as a multi-millionaire.
The median, however, only shifts from the 5th to the 6th person's salary—remaining around \\$50,000. 

Median imputation protects your dataset from the "Bill Gates effect."`,
        keyTakeaway: 'Mean gets hijacked by billionaires; median stays grounded with the regular crowd.'
      },
      visual: {
        title: 'Distribution Center of Gravity vs Midpoint',
        content: `Visual Representation of a Right-Skewed Feature:

   Frequency
      ▲
      │       ███
      │      █████
      │     ███████
      │    █████████
      │   ███████████
      │  █████████████  █     █                █ (Outlier)
      └───────────────────────────────────────────────► Value
                   ▲             ▲
                MEDIAN         MEAN
                (Peak)    (Dragged Right)`,
        diagramType: 'skew-distribution',
        keyTakeaway: 'Mean acts as the balance fulcrum and gets pulled toward outliers; median marks the true 50th percentile area split.'
      },
      causal: {
        title: 'Causal Assumptions & Downstream Model Bias',
        content: `Why does this choice matter causally?
1. Assumption of Missing Mechanism: Imputing unconditional mean or median assumes data is Missing Completely at Random (MCAR). If high-earners refused to disclose income (MNAR), median imputation still induces downward estimation bias.
2. Artificial Variance Reduction: Imputing any constant value artificially shrinks feature variance (Var = 0 for imputed items).
3. Confounder Distortion: If previous_score is imputed without conditioning on study_hours, you dilute the true bivariate covariance term $\\text{Cov}(X, Y)$ in downstream regression.`,
        keyTakeaway: 'No single number imputation restores true joint distributions; always state your MCAR assumptions.'
      }
    },
    assumptions: [
      'Missing values are Missing Completely at Random (MCAR) or Missing at Random (MAR).',
      'The sample size of non-missing values is sufficiently large to represent the target population distribution.',
      'The target feature is measured on an interval or ratio numerical scale.'
    ],
    limitations: [
      'Median imputation treats missingness as a point estimate, artificially attenuating standard errors.',
      'Does not preserve correlations between the imputed feature and other predictor features.',
      'Not suitable for high missingness rates (>30%), where multiple imputation (MICE) should be used.'
    ]
  },
  {
    topicId: 'p-values',
    topicTitle: 'P-Values and Statistical Significance',
    category: 'statistics',
    summary: 'Evaluating whether observed differences in data could easily occur by random sampling fluctuations.',
    styles: {
      procedural: {
        title: 'Step-by-Step Significance Testing',
        content: `1. Formulate Hypotheses: State $H_0$ (null: no effect/difference) and $H_1$ (alternative: real effect exists).
2. Set Significance Threshold: Pre-specify $\\alpha$ (typically $0.05$ or $0.01$) before seeing data.
3. Compute Test Statistic: Calculate t-statistic or z-score from sample mean and standard error.
4. Derive Probability: Look up the cumulative probability of observing a test statistic as extreme as yours under $H_0$.
5. Decision Rule: If $p \\le \\alpha$, reject $H_0$. If $p > \\alpha$, fail to reject $H_0$.`,
        keyTakeaway: 'Pre-register $\\alpha$, calculate distance from null in standard errors, and convert distance to cumulative probability.'
      },
      formula: {
        title: 'Formal Probability Definition',
        content: `Given a continuous test statistic $T$ with null distribution $f_0(t)$ and observed value $t_{obs}$:

$$p = P(T \\ge t_{obs} \\mid H_0) = \\int_{t_{obs}}^{\\infty} f_0(t) \\, dt \\text{ (one-tailed)}$$

For a standard two-tailed student's t-test:
$$t = \\frac{\\bar{x}_1 - \\bar{x}_2}{s_p \\sqrt{\\frac{1}{n_1} + \\frac{1}{n_2}}}$$
A small p-value means $t_{obs}$ lies deep in the tails of $f_0(t)$.`,
        keyTakeaway: 'The p-value is $P(\\text{Data} \\mid H_0)$, NOT $P(H_0 \\mid \\text{Data})$.'
      },
      analogical: {
        title: 'The Suspicious Coin Toss Analogy',
        content: `A stranger on the street hands you a coin and says it is completely fair (Null Hypothesis $H_0$).

He flips it:
- 1 Head: You shrug. Anyone can get heads ($p = 0.50$).
- 3 Heads in a row: Still totally normal ($p = 0.125$).
- 10 Heads in a row: ($p = 0.00098$, less than 1 in 1000).

At 10 heads, you say: "Either a freak 1-in-1,000 coincidence just happened, or this coin is weighted."
A p-value measures how surprised you should be if the coin really were fair.`,
        keyTakeaway: 'The p-value is a surprise-meter under the assumption that nothing special is happening.'
      },
      visual: {
        title: 'Null Distribution Tails & Rejection Region',
        content: `The Bell Curve under Null Hypothesis:

         Normal Null Distribution
                   │
                ┌──┴──┐
               ╱   │   ╲
             ╱     │     ╲
           ╱       │       ╲
      ────┴────────┼────────┴────► Test Statistic
       │           0           ▲
    α/2 (2.5%)              Observed Value (p = 0.02)
   [Rejection]             [Falls inside shaded rejection tail]`,
        diagramType: 'normal-tails',
        keyTakeaway: 'The p-value is the shaded tail area beyond your observed sample test statistic.'
      },
      causal: {
        title: 'Causal Reality vs Statistical Artefact',
        content: `Why do p-values fail to guarantee practical importance?
1. The Large N Trap: With $N = 1,000,000$, a completely meaningless difference of 0.001 points yields $p < 0.0001$. Statistical significance is not clinical or practical significance.
2. P-Hacking & Multiple Comparisons: Testing 20 random variables guarantees one false positive at $\\alpha = 0.05$ purely by random luck.
3. Publication Bias: Null results are buried, inflating apparent effect sizes across published literature.`,
        keyTakeaway: 'A tiny p-value only rejects the exact null; it never proves your favored causal theory.'
      }
    },
    assumptions: [
      'Observations are sampled independently and identically distributed (i.i.d.).',
      'The specified null distribution correctly models the random sampling process.',
      'The test was planned prior to data exploration (no post-hoc p-hacking).'
    ],
    limitations: [
      'Does not measure the magnitude or importance of the effect size.',
      'Does not provide the probability that the hypothesis is true.',
      'Vulnerable to false positives under uncorrected multiple hypothesis testing.'
    ]
  },
  {
    topicId: 'correlation-causation',
    topicTitle: 'Correlation vs Causation in Observational Data',
    category: 'reasoning',
    summary: 'Distinguishing between two variables that move together and one variable actually causing the other.',
    styles: {
      procedural: {
        title: 'Systematic Causal Diagnostic Checklist',
        content: `1. Verify Covariance: Confirm that variable X and variable Y statistically correlate ($r \\ne 0$).
2. Check Temporal Precedence: Ensure cause X strictly precedes effect Y in chronological time.
3. Identify Confounders: Brainstorm common causes Z that influence both X and Y simultaneously.
4. Block Backdoor Paths: Condition on, control for, or stratify by all known confounders Z.
5. Test Robustness: Run sensitivity analysis to see how strong an unobserved confounder must be to invalidate the effect.`,
        keyTakeaway: 'Correlation + Temporal Order + Elimination of Confounders = Plausible Causal Mechanism.'
      },
      formula: {
        title: "Pearl's Do-Calculus vs Conditional Probability",
        content: `Standard Observational Association:
$$P(Y = y \\mid X = x)$$
(Seeing X allows us to passively predict Y, subject to confounding).

Interventional Causal Effect:
$$P(Y = y \\mid \\text{do}(X = x)) = \\sum_{z} P(Y = y \\mid X = x, Z = z) P(Z = z)$$
Where $Z$ represents the adjustment set of confounders blocking all backdoor paths from $X$ to $Y$.

In general: $P(Y \\mid X) \\ne P(Y \\mid \\text{do}(X))$.`,
        keyTakeaway: 'Observing is passive conditioning; intervening (do-operator) severs incoming arrows to X.'
      },
      analogical: {
        title: 'The Ice Cream and Drowning Incidents Metaphor',
        content: `Every summer at the beach, ice cream sales increase dramatically.
Simultaneously, hospitalizations for drowning also increase dramatically.
The correlation is extraordinarily high: $r = 0.92$.

A naive bureaucrat proposes: "Ban ice cream trucks to save lives at the beach!"

The Hidden Common Cause:
Hot Summer Weather. Hot weather causes people to eat ice cream, AND hot weather causes millions of people to swim in the ocean.
Banning ice cream has zero effect on drowning because ice cream was never the engine driving the swimmer into the water.`,
        keyTakeaway: 'Never mistake a fellow passenger for the driver of the train.'
      },
      visual: {
        title: 'Directed Acyclic Graph (DAG) Representation',
        content: `Causal Graph Structure:

             [ Confounder: Summer Heat ]
                    ╱           ╲
                   ▼             ▼
       [ Ice Cream Sales ]     [ Drownings ]
               │                     ▲
               └─── (Spurious Path) ─┘

Notice there is NO direct arrow from Ice Cream Sales to Drownings!`,
        diagramType: 'dag-triangle',
        keyTakeaway: 'Backdoor paths through common parents create spurious correlations even when no causal arrow exists.'
      },
      causal: {
        title: 'The Fundamental Problem of Causal Inference',
        content: `We can never observe both potential outcomes for the exact same individual at the exact same moment:
- $Y_i(1)$: Outcome if student attends tutoring.
- $Y_i(0)$: Outcome if student does not attend tutoring.

The individual causal effect is $\\tau_i = Y_i(1) - Y_i(0)$, but one state is always counterfactual (unobservable).
Unless assignment is randomized, individuals who select into tutoring differ systematically in baseline motivation, creating selection bias.`,
        keyTakeaway: 'Randomized controlled trials (RCTs) balance confounders in expectation; observational models require explicit structural assumptions.'
      }
    },
    assumptions: [
      'No unmeasured confounding (Exchangeability / Ignorability).',
      'Positivity: Every sub-population has a non-zero probability of receiving treatment.',
      'SUTVA: No interference between units and no hidden variations of treatment.'
    ],
    limitations: [
      'Pure observational data cannot mathematically prove causality without structural assumptions.',
      'Controlling for colliders introduces M-bias and creates false correlations.',
      'Instrumental variables require strong exclusion restrictions that cannot be verified directly from data.'
    ]
  }
];
