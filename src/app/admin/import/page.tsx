'use client';

import { useState } from 'react';

export default function ImportPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);

  const handleGithubSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const response = await fetch('/api/github/sync', {
        method: 'POST',
      });
      const data = await response.json();
      setSyncResult(data);
    } catch (error) {
      console.error('Failed to sync:', error);
      setSyncResult({ error: 'Sync request failed.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Prüfungsimport & Synchronisation</h2>
          <p className="text-slate-500 mt-1">Laden Sie PDF-Prüfungsdokumente hoch oder synchronisieren Sie direkt aus dem Master-Repository.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGithubSync}
            disabled={isSyncing}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {isSyncing ? 'Synchronisiere...' : 'Aus GitHub synchronisieren'}
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm">
            Manueller Upload
          </button>
        </div>
      </div>

      {syncResult && (
        <div className={`p-4 rounded-md border ${syncResult.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <h4 className="font-semibold">{syncResult.success ? 'Synchronisation erfolgreich' : 'Fehler bei der Synchronisation'}</h4>
          <p className="text-sm mt-1">{syncResult.message || syncResult.error}</p>
          {syncResult.stats && (
            <p className="text-xs mt-2 text-slate-600">
              Neue/Aktualisierte Dateien: {syncResult.stats.new} | Unveränderte Dateien: {syncResult.stats.existing}
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h3 className="font-medium text-slate-800">Aktuelle Importvorgänge</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider text-left">
              <tr>
                <th className="px-6 py-3 font-medium">Dokument / Repository</th>
                <th className="px-6 py-3 font-medium">Quelle</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200 text-sm">
              <tr>
                <td className="px-6 py-4" colSpan={4}>
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">Keine Dokumente vorhanden</h3>
                    <p className="mt-1 text-sm text-slate-500">Laden Sie Dokumente hoch oder synchronisieren Sie aus dem Repository.</p>
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
