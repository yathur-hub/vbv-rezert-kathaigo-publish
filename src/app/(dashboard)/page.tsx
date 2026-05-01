import React from 'react';
import KPIWidget from '@/components/dashboard/KPIWidget';
import TrackProgressCard from '@/components/dashboard/TrackProgressCard';
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tracksWithProgress = await db.learningTrack.findMany({
    where: {
      user_progress: {
        some: { user_id: 'mock-user-1', completion_status: 'IN_PROGRESS' }
      }
    },
    include: {
      modules: {
        orderBy: { module_order: 'asc' }
      },
      user_progress: {
        where: { user_id: 'mock-user-1' }
      }
    }
  });

  const activeTracks = tracksWithProgress.map(track => {
    const totalModules = track.modules.length;
    const startedModules = track.user_progress.filter(p => p.completion_status !== 'NOT_STARTED').length;
    const progressPercent = totalModules > 0 ? Math.round((startedModules / totalModules) * 100) : 0;
    
    // Find next module: first one IN_PROGRESS, or just fallback
    const inProgress = track.user_progress.find(p => p.completion_status === 'IN_PROGRESS');
    const nextModuleObj = inProgress 
      ? track.modules.find(m => m.module_id === inProgress.module_id)
      : track.modules[0];
    
    const totalMastery = track.user_progress.reduce((sum, p) => sum + p.mastery_score, 0);
    const avgMastery = startedModules > 0 ? Math.round(totalMastery / startedModules) : 0;

    return {
      trackId: track.track_id,
      title: track.title,
      category: track.category,
      progress: progressPercent,
      masteryScore: avgMastery,
      nextModule: nextModuleObj?.title || 'Weiterlernen'
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Nutzer Cockpit</h1>
        <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>Ihre Zertifizierungsübersicht und aktueller Lernfortschritt.</p>
      </header>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        <KPIWidget 
          title="Zertifizierungsreife" 
          value="82%" 
          subtitle="Prüfungsbereit" 
          trend={{ value: "+5%", isPositive: true }} 
        />
        <KPIWidget 
          title="Gesamt XP" 
          value="4'250" 
          subtitle="Top 15% im Team" 
        />
        <KPIWidget 
          title="Lernserie" 
          value="12 Tage" 
          subtitle="Tagesziel: 10 XP" 
          trend={{ value: "Aktiv", isPositive: true }} 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        
        {/* Left Column: Active Tracks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Aktive Kompetenzpfade</h2>
            <Link href="/learning-hub" style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem', fontWeight: 500 }}>
              Alle ansehen →
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {activeTracks.length > 0 ? (
              activeTracks.map(track => (
                <TrackProgressCard 
                  key={track.trackId}
                  trackId={track.trackId}
                  title={track.title}
                  category={track.category}
                  progress={track.progress}
                  masteryScore={track.masteryScore}
                  nextModule={track.nextModule}
                />
              ))
            ) : (
              <div style={{ padding: '32px', backgroundColor: 'var(--color-neutral-50)', borderRadius: '8px', color: 'var(--color-text-light)', gridColumn: '1 / -1', textAlign: 'center' }}>
                <p style={{ marginBottom: '16px' }}>Sie haben noch keine Module gestartet.</p>
                <Link href="/learning-hub" className="btn btn-primary">
                  Jetzt Lernpfad auswählen
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Alerts & Mock Exam */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Action Card */}
          <div className="card" style={{ backgroundColor: 'var(--color-primary-dark)', color: 'white', border: 'none' }}>
            <h3 style={{ color: 'white', marginBottom: '8px' }}>Mock Exam Simulation</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '16px' }}>
              Ihre Zertifizierungsreife ist hoch genug für eine Prüfungssimulation.
            </p>
            <button className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary-dark)', width: '100%' }}>
              Simulation starten
            </button>
          </div>

          {/* Weaknesses */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Fokusbereich</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '12px' }}>
              Basierend auf Ihren letzten Übungen sollten Sie folgende Themen wiederholen:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ fontSize: '0.9rem', padding: '8px', backgroundColor: 'var(--color-neutral-50)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Rechtsschutz</span>
                <span style={{ color: 'var(--color-error)', fontWeight: 500 }}>38 Mastery</span>
              </li>
              <li style={{ fontSize: '0.9rem', padding: '8px', backgroundColor: 'var(--color-neutral-50)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Compliance</span>
                <span style={{ color: 'var(--color-warning)', fontWeight: 500 }}>55 Mastery</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
