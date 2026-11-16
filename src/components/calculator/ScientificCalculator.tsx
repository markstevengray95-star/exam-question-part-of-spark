import React, { useState } from 'react';
import { Calculator as CalcIcon, X, RotateCcw, Delete } from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isRad, setIsRad] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  const handleNum = (num: string) => {
    setDisplay((prev) => (prev === '0' || prev === 'Error' ? num : prev + num));
  };

  const handleOp = (op: string) => {
    setExpression((prev) => (prev ? `${prev} ${display} ${op}` : `${display} ${op}`));
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleBackspace = () => {
    setDisplay((prev) => {
      if (prev.length <= 1 || prev === 'Error') return '0';
      return prev.slice(0, -1);
    });
  };

  const handleScientific = (fn: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      switch (fn) {
        case 'sin':
          res = Math.sin(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'cos':
          res = Math.cos(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'tan':
          res = Math.tan(isRad ? val : (val * Math.PI) / 180);
          break;
        case 'sqrt':
          res = Math.sqrt(val);
          break;
        case 'square':
          res = Math.pow(val, 2);
          break;
        case 'log':
          res = Math.log10(val);
          break;
        case 'ln':
          res = Math.log(val);
          break;
        case 'inv':
          res = 1 / val;
          break;
        case 'pi':
          setDisplay(String(Math.PI));
          return;
        case 'e':
          setDisplay(String(Math.E));
          return;
      }
      const rounded = Number(res.toFixed(8));
      setDisplay(String(rounded));
      setHistory((h) => [`${fn}(${val}) = ${rounded}`, ...h.slice(0, 4)]);
    } catch {
      setDisplay('Error');
    }
  };

  const handleEquals = () => {
    try {
      const full = `${expression} ${display}`
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Safely evaluate math expression
      // eslint-disable-next-line no-new-func
      const result = Function(`'use strict'; return (${full})`)();
      const rounded = Number(Number(result).toFixed(8));
      setHistory((h) => [`${full} = ${rounded}`, ...h.slice(0, 4)]);
      setDisplay(String(rounded));
      setExpression('');
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Open Scientific Calculator"
        className="fixed bottom-6 right-6 z-40 p-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 group"
      >
        <CalcIcon className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-semibold">
          Calculator
        </span>
      </button>

      {/* Calculator Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CalcIcon className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm">Scientific Calculator</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRad(!isRad)}
                className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700"
              >
                {isRad ? 'RAD' : 'DEG'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Display */}
          <div className="my-3 p-3 bg-slate-950 rounded-xl border border-slate-800 text-right">
            <div className="h-4 text-xs font-mono text-slate-400 truncate">{expression}</div>
            <div className="text-2xl font-mono font-bold text-white tracking-wider truncate">
              {display}
            </div>
          </div>

          {/* History Snippet */}
          {history.length > 0 && (
            <div className="mb-2 text-[10px] font-mono text-slate-500 truncate text-right">
              Last: {history[0]}
            </div>
          )}

          {/* Keypad Grid */}
          <div className="grid grid-cols-5 gap-1.5 text-xs font-semibold">
            {/* Row 1 */}
            <button onClick={() => handleScientific('sin')} className="btn-sci">sin</button>
            <button onClick={() => handleScientific('cos')} className="btn-sci">cos</button>
            <button onClick={() => handleScientific('tan')} className="btn-sci">tan</button>
            <button onClick={handleClear} className="btn-func text-amber-400"><RotateCcw className="w-3.5 h-3.5 mx-auto" /></button>
            <button onClick={handleBackspace} className="btn-func text-red-400"><Delete className="w-3.5 h-3.5 mx-auto" /></button>

            {/* Row 2 */}
            <button onClick={() => handleScientific('sqrt')} className="btn-sci">√</button>
            <button onClick={() => handleScientific('square')} className="btn-sci">x²</button>
            <button onClick={() => handleOp('^')} className="btn-sci">xʸ</button>
            <button onClick={() => handleScientific('log')} className="btn-sci">log</button>
            <button onClick={() => handleOp('÷')} className="btn-op">÷</button>

            {/* Row 3 */}
            <button onClick={() => handleScientific('ln')} className="btn-sci">ln</button>
            <button onClick={() => handleNum('7')} className="btn-num">7</button>
            <button onClick={() => handleNum('8')} className="btn-num">8</button>
            <button onClick={() => handleNum('9')} className="btn-num">9</button>
            <button onClick={() => handleOp('×')} className="btn-op">×</button>

            {/* Row 4 */}
            <button onClick={() => handleScientific('pi')} className="btn-sci">π</button>
            <button onClick={() => handleNum('4')} className="btn-num">4</button>
            <button onClick={() => handleNum('5')} className="btn-num">5</button>
            <button onClick={() => handleNum('6')} className="btn-num">6</button>
            <button onClick={() => handleOp('-')} className="btn-op">-</button>

            {/* Row 5 */}
            <button onClick={() => handleScientific('e')} className="btn-sci">e</button>
            <button onClick={() => handleNum('1')} className="btn-num">1</button>
            <button onClick={() => handleNum('2')} className="btn-num">2</button>
            <button onClick={() => handleNum('3')} className="btn-num">3</button>
            <button onClick={() => handleOp('+')} className="btn-op">+</button>

            {/* Row 6 */}
            <button onClick={() => handleScientific('inv')} className="btn-sci">1/x</button>
            <button onClick={() => handleNum('0')} className="btn-num col-span-2">0</button>
            <button onClick={() => handleNum('.')} className="btn-num">.</button>
            <button onClick={handleEquals} className="btn-eq bg-indigo-600 hover:bg-indigo-500 text-white font-bold">=</button>
          </div>
        </div>
      )}
    </>
  );
};
