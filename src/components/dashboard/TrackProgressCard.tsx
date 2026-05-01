import React from 'react';
import Link from 'next/link';

interface TrackProgressCardProps {
  trackId: string;
  title: string;
  progress: number; // 0-100
  masteryScore: number;
  category: string;
  nextModule: string;
}

export default function TrackProgressCard({
  trackId,
  title,
  progress,
  masteryScore,
  category,
  nextModule
}: TrackProgressCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {category}
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem' }}>{title}</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-dark)' }}>{masteryScore}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Mastery Score</span>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Fortschritt</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-neutral-100)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              backgroundColor: 'var(--color-primary-dark)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '16px', borderTop: '1px solid var(--color-neutral-100)' }}>
        <div>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Nächstes Modul</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-dark)' }}>{nextModule}</span>
        </div>
        <Link href={`/learning-hub/${trackId}`} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Weiterlernen
        </Link>
      </div>
    </div>
  );
}
