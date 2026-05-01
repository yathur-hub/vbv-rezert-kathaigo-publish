export default function ValidationPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Freigabeprozess</h2>
          <p className="text-slate-500 mt-1">Überprüfen und validieren Sie Fragen auf fachliche und regulatorische Richtigkeit.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800">Pendente Freigaben</h3>
          <p className="text-3xl font-bold text-amber-500 mt-2">0</p>
          <p className="text-sm text-slate-500 mt-1">Prüfungsfragen zur fachlichen Prüfung ausstehend</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800">Korrektur erforderlich</h3>
          <p className="text-3xl font-bold text-red-500 mt-2">0</p>
          <p className="text-sm text-slate-500 mt-1">Prüfungsfragen mit Überarbeitungsbedarf</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800">Validiert</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">0</p>
          <p className="text-sm text-slate-500 mt-1">Vollständig validierte Prüfungsfragen</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-medium text-slate-800">Zuweisungen</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">Keine Pendenzen</h3>
            <p className="mt-1 text-sm text-slate-500">Aktuell liegen keine Prüfungsfragen zur Validierung vor.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
