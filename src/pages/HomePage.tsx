import { Link } from 'react-router-dom';
import {
  Zap,
  BookOpen,
  Timer,
  Target,
  Brain,
  FlaskConical,
  Atom,
  Microscope,
  Dna,
  Beaker,
  ArrowRight,
  BarChart3,
  Trophy,
  Sparkles,
} from 'lucide-react';
import Layout from '../components/layout/Layout';

const subjectCards = [
  {
    id: 'gcse-combined-science',
    name: 'GCSE Combined Science',
    icon: FlaskConical,
    colour: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    questions: 45,
    qualification: 'GCSE',
  },
  {
    id: 'gcse-physics',
    name: 'GCSE Physics',
    icon: Atom,
    colour: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    questions: 15,
    qualification: 'GCSE',
  },
  {
    id: 'a-level-physics',
    name: 'A-Level Physics',
    icon: Atom,
    colour: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    questions: 12,
    qualification: 'A-Level',
  },
  {
    id: 'a-level-chemistry',
    name: 'A-Level Chemistry',
    icon: Beaker,
    colour: 'from-orange-500 to-red-600',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    questions: 10,
    qualification: 'A-Level',
  },
  {
    id: 'a-level-biology',
    name: 'A-Level Biology',
    icon: Dna,
    colour: 'from-green-500 to-lime-600',
    bg: 'bg-green-50 dark:bg-green-950/30',
    questions: 10,
    qualification: 'A-Level',
  },
];

const quickActions = [
  {
    label: 'Quick Fire Quiz',
    description: '10 random questions, no time limit',
    icon: Zap,
    colour: 'from-amber-500 to-orange-500',
    to: '/quiz/setup?mode=quick-fire',
  },
  {
    label: 'Topic Test',
    description: 'Focus on a specific topic',
    icon: Target,
    colour: 'from-blue-500 to-cyan-500',
    to: '/quiz/setup?mode=topic-test',
  },
  {
    label: 'Exam Challenge',
    description: 'Timed exam-style conditions',
    icon: Timer,
    colour: 'from-purple-500 to-pink-500',
    to: '/quiz/setup?mode=timed-exam',
  },
  {
    label: 'Browse Questions',
    description: 'Explore the full question bank',
    icon: BookOpen,
    colour: 'from-emerald-500 to-teal-500',
    to: '/questions',
  },
];

const stats = [
  { label: 'Questions', value: '90+', icon: Brain },
  { label: 'Subjects', value: '5', icon: Microscope },
  { label: 'Question Types', value: '18', icon: BarChart3 },
  { label: 'Achievements', value: '∞', icon: Trophy },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 px-6 py-16 text-white sm:px-12 sm:py-20 mb-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-300" />
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-200">
              Science &amp; Maths Revision
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Master your exams with{' '}
            <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
              SPARK
            </span>
          </h1>
          <p className="mb-8 text-lg text-purple-100 sm:text-xl">
            Interactive questions, instant feedback, and smart revision tools
            designed for GCSE and A-Level students.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/quiz/setup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-purple-700 shadow-lg shadow-purple-900/20 transition hover:bg-purple-50 hover:shadow-xl"
            >
              Start a Quiz <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/questions"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Browse Questions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Quick Start
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:-translate-y-0.5 dark:bg-gray-800 dark:ring-gray-700"
            >
              <div
                className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${action.colour} p-3 text-white shadow-lg`}
              >
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
                {action.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
              <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-purple-500 dark:text-gray-600" />
            </Link>
          ))}
        </div>
      </section>

      {/* Subject Cards */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Subjects
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjectCards.map((subject) => (
            <Link
              key={subject.id}
              to={`/quiz/setup?subject=${subject.id}`}
              className={`group relative overflow-hidden rounded-2xl ${subject.bg} p-6 ring-1 ring-gray-100 transition hover:shadow-md hover:-translate-y-0.5 dark:ring-gray-700`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`inline-flex rounded-xl bg-gradient-to-br ${subject.colour} p-3 text-white shadow-lg`}
                >
                  <subject.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800/80 dark:text-gray-300">
                  {subject.qualification}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {subject.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {subject.questions} questions available
              </p>
              <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-purple-500 dark:text-gray-600" />
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
