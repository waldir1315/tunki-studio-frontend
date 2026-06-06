import React from 'react';
import s from './Sidebar.module.css';

const NAV = [
  { id: 'studio', icon: '🎬', label: 'Studio' },
  { id: 'pipeline', icon: '📊', label: 'Pipeline' },
  { id: 'personajes', icon: '🐱', label: 'Personajes' },
];

export default function Sidebar({ view, onNav }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.logo}>
        <span className={s.logoIcon}>🎬</span>
        <div className={s.logoText}>
          <span className={s.logoTitle}>TUNKI</span>
          <span className={s.logoSub}>STUDIO</span>
        </div>
      </div>

      <nav className={s.nav}>
        {NAV.map(item => (
          <button
            key={item.id}
            className={`${s.navItem} ${view === item.id ? s.active : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className={s.navIcon}>{item.icon}</span>
            <span className={s.navLabel}>{item.label}</span>
            {view === item.id && <span className={s.navIndicator} />}
          </button>
        ))}
      </nav>

      <div className={s.footer}>
        <div className={s.footerBadge}>
          <span className={s.footerDot} />
          <span>T1 · 10 eps</span>
        </div>
        <span className={s.footerSub}>Crecemos Juntos</span>
      </div>
    </aside>
  );
}
