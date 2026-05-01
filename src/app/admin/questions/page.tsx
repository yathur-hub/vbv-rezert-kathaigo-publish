export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Prüfungsdatenbank</h2>
          <p className="text-slate-500 mt-1">Verwalten Sie strukturierte Prüfungsfragen, Taxonomien und validierte Antwortoptionen.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
          Frage erfassen
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-wrap gap-4">
        <select className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white">
          <option>Alle Jahre</option>
          <option>2025</option>
          <option>2024</option>
        </select>
        <select className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white">
          <option>Alle Themen</option>
          <option>Recht</option>
          <option>Sachversicherung</option>
          <option>Personenversicherung</option>
        </select>
        <select className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white">
          <option>Alle Fragetypen</option>
          <option>Einfachauswahl</option>
          <option>Mehrfachauswahl</option>
          <option>Fallanalyse</option>
        </select>
        <select className="px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white">
          <option>Status Filter</option>
          <option>RAW_IMPORTED</option>
          <option>NEEDS_REVIEW</option>
          <option>VALIDATED</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-medium text-slate-800">Fragenkatalog</h3>
          <input 
            type="text" 
            placeholder="Suchen..." 
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-3 font-medium">ID / Frage</th>
                <th className="px-6 py-3 font-medium">Fragetyp</th>
                <th className="px-6 py-3 font-medium">Thema</th>
                <th className="px-6 py-3 font-medium">Qualität</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200 text-sm">
              <tr>
                <td className="px-6 py-4" colSpan={6}>
                  <div className="text-center py-8 text-slate-500">
                    Noch keine Fragen in der Datenbank vorhanden.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
