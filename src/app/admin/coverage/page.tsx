import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function CoveragePage() {
  const totalQuestions = await prisma.question.count();
  const validatedQuestions = await prisma.question.count({
    where: { validation_status: 'VALIDATED' }
  });
  
  // Example MVP Targets
  const targets = [
    { name: 'Recht', target: 200, current: 0 },
    { name: 'Versicherungswirtschaft', target: 250, current: 0 },
    { name: 'Sachversicherung', target: 300, current: 0 },
    { name: 'Vorsorge', target: 250, current: 0 },
    { name: 'Beratung', target: 150, current: 0 },
    { name: 'Compliance', target: 100, current: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Coverage & Analytics</h2>
          <p className="text-slate-500 mt-1">Überwachen Sie die Modulabdeckung und die MVP-Ziele des Master Question Corpus V2.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Fragen Gesamt</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalQuestions}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Validierte Fragen</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{validatedQuestions}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Review Backlog</h3>
          <p className="mt-2 text-3xl font-bold text-amber-600">{totalQuestions - validatedQuestions}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-medium text-slate-800">MVP Coverage Heatmap</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {targets.map((t, idx) => {
              const percentage = t.target > 0 ? Math.min(100, Math.round((t.current / t.target) * 100)) : 0;
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{t.name}</span>
                    <span className="text-slate-500">{t.current} / {t.target} Fragen ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${percentage >= 100 ? 'bg-green-500' : percentage > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
