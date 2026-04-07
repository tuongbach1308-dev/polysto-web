'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface Props {
  items: AccordionItem[];
}

export default function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="bg-white rounded-xl border border-border divide-y divide-border overflow-hidden">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-bg-gray/50 transition-colors"
          >
            <span className="text-sm font-medium text-text-dark">{item.question}</span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 ${
                openIndex === i ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`grid transition-all duration-200 ${
              openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <p className="px-5 pb-4 text-sm text-text-muted leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
