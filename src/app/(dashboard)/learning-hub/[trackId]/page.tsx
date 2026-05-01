import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TrackDetail({ params }: { params: Promise<{ trackId: string }> }) {
  const resolvedParams = await params;
  const trackId = resolvedParams.trackId;

  let track: any = null;
  
  try {
    track = await db.learningTrack.findUnique({
      where: { track_id: trackId },
      include: {
        modules: {
          orderBy: {
            module_order: 'asc'
          },
          include: {
            lessons: {
              orderBy: { sequence_order: 'asc' },
              take: 1
            }
          }
        }
      }
    });
  } catch (error) {
    console.warn("DB Connection failed, using mock data for track detail", error);
    track = {
      track_id: trackId,
      title: 'Personenversicherungen Grundlagen',
      category: 'Sachversicherung',
      estimated_duration: 120,
      xp_reward: 500,
      modules: [
        {
          module_id: 'mock-module-1',
          title: 'Unfallversicherung UVG',
          topic: 'Personenversicherung',
          xp_reward: 100,
          lessons: [{ lesson_id: 'mock-lesson-1' }]
        }
      ]
    };
  }

  if (!track) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/learning-hub" style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
          ← Zurück zur Übersicht
        </Link>
      </div>

      <header className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--color-primary-dark)', color: 'white', border: 'none' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-neutral-300)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {track.category}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0', color: 'white' }}>{track.title}</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            {track.estimated_duration} Minuten
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            {track.xp_reward} Gesamt XP
          </span>
        </div>
      </header>

      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Module in diesem Pfad</h2>
        
        {track.modules.length === 0 ? (
           <p style={{ color: 'var(--color-text-light)' }}>Keine Module für diesen Pfad gefunden.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {track.modules.map((module: any, index: number) => (
              <div key={module.module_id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0' }}>{module.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-light)' }}>
                      {module.topic} • {module.xp_reward} XP
                    </p>
                  </div>
                </div>
                
                {module.lessons.length > 0 ? (
                  <Link href={`/learning-hub/${trackId}/module/${module.module_id}/lesson/${module.lessons[0].lesson_id}`} className="btn btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
                    Starten
                  </Link>
                ) : (
                  <button className="btn btn-primary" style={{ padding: '8px 16px', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                    In Kürze
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
