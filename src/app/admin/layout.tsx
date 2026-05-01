import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-2">
          <img 
            src="https://raw.githubusercontent.com/yathur-hub/kathiago.ch-assets/main/Kathiago%20Logo%20Transparent.png" 
            alt="Kathiago Logo" 
            className="max-w-[75px] w-full h-auto"
          />
          <p className="text-sm text-slate-400">Prüfungsdatenbank</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/import" className="block px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300 hover:text-white">
            Prüfungsimport
          </Link>
          <Link href="/admin/questions" className="block px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300 hover:text-white">
            Fragen & Taxonomie
          </Link>
          <Link href="/admin/validation" className="block px-4 py-2 rounded-md hover:bg-slate-800 transition-colors text-sm font-medium text-slate-300 hover:text-white">
            Freigabeprozess
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-800">Administrationsportal</h1>
          <div className="flex items-center space-x-4 text-sm text-slate-500 font-medium">
            <span>Systemadministrator</span>
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600">A</div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
