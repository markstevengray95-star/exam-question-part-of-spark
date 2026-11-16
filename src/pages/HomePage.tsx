import { Link } from 'react-router-dom';
import { Zap, BookOpen, Timer, Target, ArrowRight, Atom, FlaskConical, Dna, Beaker, BarChart3, Play } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { subjects } from '../data/subjects';
import { allQuestions } from '../data/questions';
import { useQuizStore } from '../store/quizStore';

const actions = [
  { title: 'Quick fire', description: '10 questions for quick retrieval practice.', icon: Zap, to: '/quiz/setup?mode=quick-fire' },
  { title: 'Topic practice', description: 'Choose the topics you want to improve.', icon: Target, to: '/quiz/setup?mode=topic-test' },
  { title: 'Timed exam', description: 'Practise under timed exam conditions.', icon: Timer, to: '/quiz/setup?mode=timed-exam' },
  { title: 'Question bank', description: 'Search, filter and try individual questions.', icon: BookOpen, to: '/questions' },
];

export default function HomePage() {
  const [active, complete, answered, total] = [
    useQuizStore(s => !!s.id && s.questions.length > 0),
    useQuizStore(s => s.isComplete),
    useQuizStore(s => Object.keys(s.answers).length),
    useQuizStore(s => s.questions.length),
  ];
  const courses = subjects.map(s => ({ ...s, count: allQuestions.filter(q => q.subjectId === s.id).length })).filter(s => s.count > 0);
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-300 mb-3">SPARK / Exam practice</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">Build confidence.<br/>One question at a time.</h1>
            <p className="text-slate-300 mt-4 leading-relaxed">Practise GCSE and A-level science with interactive questions, calculations, feedback and worked solutions.</p>
            <Link to="/quiz/setup" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 px-5 py-3 font-semibold text-white">Build a quiz <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid gap-3 w-full md:w-56 shrink-0">
            {[{value: allQuestions.length, label:'Questions available'}, {value:courses.length,label:'Courses'}, {value:new Set(allQuestions.map(q=>q.type)).size,label:'Question formats'}].map(s => <div key={s.label} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 flex justify-between items-center gap-3"><span className="text-xs text-slate-300">{s.label}</span><strong className="text-xl tabular-nums">{s.value}</strong></div>)}
          </div>
        </section>
        {active && <section className="rounded-2xl border border-indigo-200 bg-white dark:bg-slate-900 dark:border-indigo-800 p-5 flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{complete ? 'Last session' : 'Continue learning'}</p><h2 className="text-lg font-bold mt-1">{complete ? 'Review your latest results' : 'Resume your quiz'}</h2><p className="text-sm text-slate-500">{answered} of {total} questions answered · saved on this device</p><div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div className="h-full bg-indigo-500" style={{width: (100 * answered / Math.max(total, 1)) + '%'}}/></div></div>
          <Link to={complete ? '/quiz/results' : '/quiz/play'} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white font-semibold px-4 py-3"><Play className="w-4 h-4"/>{complete ? 'View results' : 'Resume quiz'}</Link>
        </section>}
        <section>
          <h2 className="text-xl font-bold mb-1">Choose how to practise</h2>
          <p className="text-sm text-slate-500 mb-4">Pick a mode and tailor it to your revision.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">{actions.map(a => <Link key={a.title} to={a.to} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-indigo-400 hover:shadow-sm transition"><a.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-3"/><div className="flex items-center justify-between gap-2 font-semibold">{a.title}<ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500"/></div><p className="text-sm text-slate-500 mt-2 leading-snug">{a.description}</p></Link>)}</div>
        </section>
        {(['gcse','a-level'] as const).map(level => <section key={level}><h2 className="text-xl font-bold mb-4">{level==='gcse' ? 'GCSE science' : 'A-level science'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{courses.filter(s=>s.qualification===level).map(s=>{
            const Icon = s.id.includes('combined') ? FlaskConical : s.id.includes('physics') ? Atom : s.id.includes('chemistry') ? Beaker : Dna;
            return <Link key={s.id} to={'/quiz/setup?subject='+s.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 hover:border-indigo-400 transition"><div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-3 text-indigo-600 dark:text-indigo-300"><Icon className="w-6 h-6"/></div><div className="flex-1 min-w-0"><h3 className="font-semibold">{s.name}</h3><p className="text-xs text-slate-500 mt-1">{s.count} questions</p></div><ArrowRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-indigo-500"/></Link>;
          })}</div>
        </section>)}
        <div className="flex items-start gap-3 text-sm text-slate-500 p-4 rounded-xl border border-slate-200 dark:border-slate-800"><BarChart3 className="w-5 h-5 shrink-0 text-indigo-500"/><p>Review your marks and topic performance after each quiz. Practice scores are revision indicators, not official exam grades.</p></div>
      </div>
    </Layout>
  );
}
