# DataMind: A Capability-Preserving Co-Pilot for Data Analysis

> **Final Year Project (FYP 2023–2027)**  
> **Institution:** Riphah International University  
> **Team:** Muhammad Aftab Asghar, Muhammad Hamad Asghar  
> **Thesis:** *"Current AI data-analysis tools optimize for task completion, causing deskilling. DataMind is a capability-preserving co-pilot that performs data analysis with the user while treating human skill growth as a first-class metric — so the human ends needing it less, not more."*  
> **Core Metric:** **SUCCESS = The user becomes more capable and needs less assistance over time.**

---

## 🌟 The Three Conceptual Engines

### 1. Engine A: The Autonomy Dial (The Skeleton & Priority 1)
Based on the foundational scaffolding framework of **Wood, Bruner & Ross (1976)**:
- **Level 0 — Do It For Me:** Full automation; co-pilot executes action and presents result + rationale.
- **Level 1 — Do It and Explain:** Co-pilot walks through the analytical operation step-by-step.
- **Level 2 — Give Me Hints:** Socratic prompts and guiding questions precede the solution.
- **Level 3 — Check My Work:** User formulates the decision first; co-pilot validates reasoning and flags flaws.
- **Level 4 — Independent Work:** Hands-off mastery; assistance is completely faded unless emergency help is explicitly requested.

### 2. Engine B: Explanation Variety Engine (Cognitive Diversity)
Instead of forcing a single explanation format, DataMind repurposes multi-agent representations into **5 parallel mental models**:
1. **Procedural:** Step-by-step sequential algorithmic actions.
2. **Formula-Based:** Exact mathematical formulations, L1/L2 loss norms, and formal definitions.
3. **Analogical:** Intuitive real-world metaphors (e.g., "The Bill Gates at the Local Bar" for mean vs. median).
4. **Visual & Diagram:** Spatial geometry, distribution tails, and flowcharts.
5. **Causal & Reasoning:** Mechanism-level trade-offs, MCAR/MAR assumptions, and downstream model bias.

Includes a live **Learner Cognitive Scoreboard ("Pheromone Trail")** tracking which representations click for each student.

### 3. Engine C: The Causal Mentor Engine (Mechanisms & DAGs)
Teaches students that **correlation does not prove causation**:
- Interactive **Directed Acyclic Graph (DAG)** with treatments, outcomes, mediators, confounders, and analytical decisions.
- Highlights unmeasured backdoor paths (e.g. Student Motivation confounding Study Hours and Exam Scores).
- Structured reasoning breakdown: Observed Pattern $\to$ Interpretation $\to$ Assumptions $\to$ Confounders $\to$ Evidence Needed $\to$ Limitations.
- **Progressive Why-Reasoning:** Demonstrates fading support by revealing deeper mechanism layers.

---

## 🚀 Getting Started (Windows)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher

### Installation & Run

1. Open PowerShell or Command Prompt in the project directory:
   ```powershell
   cd e:\Projects\DataMind
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Launch the local development server:
   ```powershell
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

5. To run a production build:
   ```powershell
   npm run build
   npm run preview
   ```

---

## 🗺️ Presentation Journey for FYP Examiners

Follow this 10-step sequence during your demonstration or defense viva:

1. **Overview Dashboard:** Explain the core problem of AI deskilling and present the decreasing-dependence curve.
2. **Dataset Workspace:**
   - Switch between sample datasets: *Student Performance*, *Retail Sales*, and *Weather Grid*.
   - Drag & drop a custom `.csv` file to demonstrate client-side parsing.
   - Inspect **Statistics** and notice mean/median skewness flags.
   - Visit **Data Quality** to preview and apply median imputation and remove duplicate rows.
   - Switch to **Visualizations** and explore dynamic bivariate scatter plots.
   - Click **Export CSV** to trigger an actual browser download.
3. **AI Data Tutor:** Ask suggested questions like *"How should I handle missing values?"* or *"Explain my dataset"* to observe dataset-grounded pedagogical guidance.
4. **Learning Studio:**
   - Cycle through Autonomy Dial levels **0 through 4**.
   - Notice how the practice interface transforms from automatic execution down to independent challenge mode.
   - Solve Task 1 (Median Imputation) or Task 3 (Causal Correlation) and view instant validation.
5. **Explanation Lab:** Select a topic (e.g. *Mean vs Median*) and toggle between **Procedural**, **Formula**, **Analogical**, **Visual**, and **Causal**. Toggle **Side-by-Side Comparison** to inspect all 5 models at once. Click *"This Clicked!"* to update the cognitive scoreboard.
6. **Causal Mentor:** Inspect the interactive DAG graph. Click on nodes to isolate backdoor confounding paths. Click **Reveal More Reasoning** to unlock deeper structural layers.
7. **My Progress:** View real-time session logs, earned pedagogical milestones, and competency matrix scores.
8. **Evaluation & Benchmarks:** Click **Execute Live Verification** to run the 6 in-browser test assertions live. Review the proposed 6-week pre/post longitudinal study protocol for NU Lahore.
9. **Settings & Help:** Toggle **Light / Dark Mode**, inspect the student team profile, and review the pedagogical thesis FAQ.

---

## 🔬 Research & Academic Integrity Notice

- **Frontend Demo Mode:** This application runs entirely in the browser without requiring a live LLM API key, local Ollama/Llama installation, or backend server.
- **Executed vs. Planned:** The 6 software unit/integration tests on the Evaluation page run **live in-browser**. The longitudinal pre/post study (N=40 cohort) and DS-1000 benchmark scores are clearly categorized as **Planned Research Protocol**.
