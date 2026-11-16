# SPARK Exam Questions & Quiz Revision Engine

A standalone, fully functional **Exam Questions and Quiz Revision application** for GCSE and A-level students, designed for modular integration into the main **SPARK** educational revision platform.

🔗 **GitHub Repository Link:** [markstevengray95-star/exam-question-part-of-spark](https://github.com/markstevengray95-star/exam-question-part-of-spark)

---

## 🚀 Features & Architecture

### 1. Centralised Marking Engine (Deterministic, No AI Required)
- **Automatic marking without AI** for all compatible question types.
- **Partial credit support** for multi-step calculations where intermediate steps and error carried forward are assessed.
- **Tolerances and Significant Figures** precision verification.
- **Keyword matching & level descriptors** for definitions, short and extended response questions.
- **Automatic evaluation** for drag-and-drop, matching, sequencing, diagram labelling, and table data analysis.

### 2. Randomised Calculation Engine
- Dynamically generates variable values within defined physical limits.
- Evaluates the verified mathematical answer on the fly.
- Updates question stems, formulae, and step-by-step mark schemes automatically.

### 3. All 14+ Supported Question Types
1. **Multiple-choice and multiple-answer** (with immediate feedback and explanations)
2. **True or False** (interactive binary selection)
3. **Fill in the blanks** (inline inputs with multi-variant acceptable answers)
4. **Keyword and definition questions** (evaluates presence of required scientific terminology)
5. **Short and extended-response exam questions** (6-mark question format with quality of written communication descriptors)
6. **Single and multi-step calculations** (with on-screen working out area, formula display, and worked solutions)
7. **Equation rearrangement** (algebraic normalisation)
8. **Unit conversions** (interactive unit conversion steps)
9. **Drag-and-drop activities** (category sorting for mobile & desktop)
10. **Matching and sequencing** (chronological order step sorting)
11. **Interactive diagram labelling** (scientific SVG apparatus labelling)
12. **Graph plotting and interpretation** (interactive coordinate plotting and Recharts curve analysis)
13. **Data analysis and results tables** (experimental findings evaluation)
14. **AQA Required Practical questions** (apparatus, risk assessment, and analysis)

### 4. Visuals and Interface
- **On-screen Scientific Calculator** floating widget (trig, log, powers, roots, constants $\pi$, $e$).
- **LaTeX rendering** via KaTeX for all formulas, equations, and mathematical notations ($...$ and $$...$$).
- **Progressive hint system** (reveals hints one at a time).
- **Interactive charts** powered by Recharts (topic performance breakdowns, difficulty distributions).
- **Model answers, mark schemes, and common examiner misconceptions**.
- **Retry incorrect questions** or configure new custom tests.

---

## 📁 Project Structure

```
spark-exam-app/
├── src/
│   ├── components/
│   │   ├── calculator/          # Floating scientific calculator widget
│   │   ├── common/              # LatexRenderer, ProgressBar, Timer, Badge, Modal
│   │   ├── layout/              # Header, Layout, Navigation, GitHub link
│   │   ├── questions/           # Component renderers for all 14+ question types
│   │   └── quiz/                # QuizCard, ResultsChart, QuestionReview
│   ├── data/
│   │   ├── subjects.ts          # Complete AQA GCSE & A-Level Science specs
│   │   └── questions/           # Question bank by specification
│   │       ├── gcse-combined-science/  # Biology, Chemistry, Physics
│   │       ├── gcse-physics/           # Mechanics & separate science
│   │       ├── a-level-physics/        # Particles & radiation
│   │       ├── a-level-chemistry/      # Organic chemistry & mechanisms
│   │       └── a-level-biology/        # Biological molecules & enzymes
│   ├── engine/
│   │   ├── markingEngine.ts     # Deterministic marking engine (817+ lines)
│   │   ├── randomiser.ts        # Randomised calculation engine
│   │   └── __tests__/           # Full Vitest automated test suite (18 tests passing)
│   ├── store/
│   │   ├── quizStore.ts         # Zustand state management for active quizzes
│   │   └── questionBankStore.ts # Filtering, searching, and topic selection
│   ├── types/
│   │   └── index.ts             # TypeScript definitions for questions & exams
│   ├── utils/
│   │   ├── mathUtils.ts         # Sig figs, scientific notation parsing, rounding
│   │   └── formatUtils.ts       # KaTeX rendering, timing, grade boundaries
│   ├── pages/
│   │   ├── HomePage.tsx         # Modern landing page & quick actions
│   │   ├── QuizSetupPage.tsx    # Custom quiz builder & filter controls
│   │   ├── QuizPlayPage.tsx     # Active exam session & live question renderer
│   │   ├── QuizResultsPage.tsx  # Breakdown analytics & model answer review
│   │   └── QuestionBankPage.tsx # Specification browser & interactive try mode
│   ├── App.tsx                  # React Router setup & HTML5 Drag-and-Drop
│   └── main.tsx
├── package.json
└── vite.config.ts
```

---

## 🛠️ Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Run the automated test suite:**
   ```bash
   npx vitest run
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔗 Integration into SPARK

The app is built with complete separation of concerns:
- `src/engine/markingEngine.ts` and `src/engine/randomiser.ts` are pure TypeScript functions with zero UI dependencies, allowing them to be imported directly into the SPARK backend or frontend.
- `src/types/index.ts` provides the unified schema for all questions.
- `src/components/questions/QuestionRenderer.tsx` can be embedded into any SPARK page or modal.
