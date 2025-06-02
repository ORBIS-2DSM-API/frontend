import { BookOpen } from 'lucide-react';

export default function FloatingManualButton() {
  return (
    <div className="group relative">
      <a
        href="/images/Manual_Usuario_Helpnei_Dashboard.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-14 sm:bottom-6 right-6 bg-blue-950 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-900 transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Manual do Usuário"
      >
        <BookOpen className="w-5 h-5" />
      </a>
      <span className="fixed bottom-[6.5rem] sm:bottom-[5.5rem] right-[1.12rem] scale-0 rounded bg-blue-900 px-2 py-1.5 text-xs text-white group-hover:scale-100 transition-all duration-200 whitespace-nowrap">
        Manual do Usuário
      </span>
    </div>
  );
}