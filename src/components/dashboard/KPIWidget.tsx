import React from 'react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export default function KPIWidget({ title, value, subtitle, trend, icon }: KPIWidgetProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', margin: 0, fontFamily: 'var(--font-body)' }}>{title}</h3>
        {icon && <div style={{ color: 'var(--color-primary-dark)', opacity: 0.8 }}>{icon}</div>}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--color-text-dark)' }}>{value}</span>
        {trend && (
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: 500,
            color: trend.isPositive ? 'var(--color-success)' : 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', margin: 0 }}>{subtitle}</p>
      )}
    </div>
  );
}
