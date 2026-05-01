import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function LearningHub() {
  let tracks: any[] = [];
  
  try {
    tracks = await db.learningTrack.findMany({
      include: {
        modules: true
      },
      orderBy: {
        title: 'asc'
      }
    });
  } catch (error) {
    console.warn("DB Connection failed, using mock data for learning hub", error);
    tracks = [
      {
        track_id: 'mock-track-1',
        title: 'Personenversicherungen Grundlagen',
        category: 'Sachversicherung',
        estimated_duration: 120,
        xp_reward: 500,
        modules: [{}, {}, {}] // 3 mock modules
      },
      {
        track_id: 'mock-track-2',
        title: 'Vermögensversicherung',
        category: 'Sachversicherung',
        estimated_duration: 90,
        xp_reward: 350,
        modules: [{}, {}] // 2 mock modules
      }
    ];
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <header>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 600 }}>Learning Hub</h1>
        <p style={{ color: 'var(--color-text-light)', marginTop: '8px' }}>
          Entdecken Sie Kompetenzpfade und bereiten Sie sich gezielt auf Ihre VBV-Zertifizierung vor.
        </p>
      </header>

      {tracks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Keine Pfade verfügbar</h3>
          <p style={{ color: 'var(--color-text-light)' }}>Es wurden noch keine Kompetenzpfade angelegt.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {tracks.map(track => (
            <div key={track.track_id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {track.category}
                </span>
                <h3 style={{ margin: '4px 0 8px 0', fontSize: '1.2rem' }}>{track.title}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {track.estimated_duration} Min.
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                    {track.xp_reward} XP
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                    {track.modules.length} Module
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-neutral-100)' }}>
                <Link href={`/learning-hub/${track.track_id}`} className="btn btn-primary" style={{ width: '100%' }}>
                  Pfad ansehen
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
