import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function SeriesPage() {
  const seriesList = await prisma.examSeries.findMany({
    orderBy: { year: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Prüfungsserien</h2>
          <p className="text-slate-500 mt-1">Verwalten Sie Prüfungsserien und ordnen Sie importierte Fragen zu.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
          Neue Serie erstellen
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Jahr</th>
                <th className="px-6 py-3 font-medium">Session</th>
                <th className="px-6 py-3 font-medium">Prüfungstyp</th>
                <th className="px-6 py-3 font-medium">Fragen gesamt</th>
                <th className="px-6 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200 text-sm">
              {seriesList.length === 0 ? (
                <tr>
                  <td className="px-6 py-4" colSpan={5}>
                    <div className="text-center py-8">
                      <p className="text-slate-500">Keine Prüfungsserien gefunden.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                seriesList.map((series) => (
                  <tr key={series.series_id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{series.year}</td>
                    <td className="px-6 py-4 text-slate-500">{series.session}</td>
                    <td className="px-6 py-4 text-slate-500">{series.exam_type}</td>
                    <td className="px-6 py-4 text-slate-500">{series.total_questions}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Bearbeiten</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
