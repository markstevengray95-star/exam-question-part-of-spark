import React, { useState } from 'react';
import type { DragDropQuestion as DDQType, UserAnswer, MarkResult } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: DDQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const DragDropQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const placements = (userAnswer?.placements as Record<string, string>) || {};
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handlePlace = (itemId: string, zoneId: string | null) => {
    if (isSubmitted) return;
    const next = { ...placements };
    if (zoneId) {
      next[itemId] = zoneId;
    } else {
      delete next[itemId];
    }

    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: next,
      placements: next,
    });
    setSelectedItemId(null);
  };

  // Items currently placed in each zone
  const getZoneItems = (zoneId: string) => {
    return question.items.filter((item) => placements[item.id] === zoneId);
  };

  // Unplaced items
  const unplacedItems = question.items.filter((item) => !placements[item.id]);

  return (
    <div className="space-y-6">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Click an item to select it, then click a target category box to place it:
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {question.dropZones.map((zone) => {
          const zoneItems = getZoneItems(zone.id);

          return (
            <div
              key={zone.id}
              onClick={() => {
                if (selectedItemId) {
                  handlePlace(selectedItemId, zone.id);
                }
              }}
              className={`p-4 rounded-xl border-2 min-h-[140px] flex flex-col justify-between transition-all cursor-pointer ${
                selectedItemId
                  ? 'border-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 hover:border-indigo-600'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              <div className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                {zone.label}
              </div>

              <div className="flex-1 space-y-2">
                {zoneItems.map((item) => {
                  const isCorrect = isSubmitted && question.correctPlacements[item.id] === zone.id;
                  const isWrong = isSubmitted && question.correctPlacements[item.id] !== zone.id;

                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSubmitted) handlePlace(item.id, null);
                      }}
                      className={`p-2.5 rounded-lg text-xs font-medium shadow-sm transition-all flex items-center justify-between ${
                        isSubmitted
                          ? isCorrect
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200'
                            : 'bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-200'
                          : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                      }`}
                    >
                      <span>{item.content}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isSubmitted && isWrong && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {zoneItems.length === 0 && (
                <div className="text-[11px] text-slate-400 text-center py-6 italic">
                  Drop items here
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Available Unplaced Items */}
      <div className="p-4 bg-slate-100/70 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
          Available Items:
        </div>
        <div className="flex flex-wrap gap-2">
          {unplacedItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedItemId(isSelected ? null : item.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border shadow-sm transition-all text-left ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                }`}
              >
                {item.content}
              </button>
            );
          })}
          {unplacedItems.length === 0 && (
            <span className="text-xs text-slate-400 italic">All items placed!</span>
          )}
        </div>
      </div>
    </div>
  );
};
