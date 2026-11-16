import React, { useMemo } from 'react';
import { renderLatex } from '../../utils/formatUtils';

interface LatexRendererProps {
  content: string;
  className?: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ content, className = '' }) => {
  const html = useMemo(() => renderLatex(content), [content]);

  return (
    <span
      className={`latex-content leading-relaxed inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
