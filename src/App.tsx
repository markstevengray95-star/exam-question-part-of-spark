import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import HomePage from './pages/HomePage';
import QuizSetupPage from './pages/QuizSetupPage';
import QuizPlayPage from './pages/QuizPlayPage';
import QuizResultsPage from './pages/QuizResultsPage';
import QuestionBankPage from './pages/QuestionBankPage';

export const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/setup" element={<QuizSetupPage />} />
          <Route path="/quiz/play" element={<QuizPlayPage />} />
          <Route path="/quiz/results" element={<QuizResultsPage />} />
          <Route path="/questions" element={<QuestionBankPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DndProvider>
  );
};

export default App;
