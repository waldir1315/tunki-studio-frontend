import React from 'react';

const PHASES = [
  { id: 'sinopsis', label: 'Sinopsis', icon: '📋' },
  { id: 'libreto', label: 'Libreto', icon: '📝' },
  { id: 'psicologia', label: 'Psicología', icon: '🧠' },
  { id: 'storyboard', label: 'Storyboard', icon: '🎬' },
  { id: 'imagen', label: 'Prompts Img', icon: '🎨' },
  { id: 'suno', label: 'Prompts Suno', icon: '🎵' },
  { id: 'voces', label: 'Voces', icon: '🎤' },
  { id: 'entregado', label: 'Entregado', icon: '✅' },
];

function CharacterAvatar({ ep }) {
  if (ep.avatar) {
    return <img src={ep.avatar} alt={ep.lead} className="ep-avatar" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />;
  }
  return <div className="ep-avatar-emoji">{ep.emoji}</div>;
}

export default function Pipeline({ episodes, departments, episodeStates, updateEpisodeState, onOpenStudio }) {
  const totalPhases = episodes.length * PHASES.length;
  const completedPhases = episodes.reduce((acc, ep) => acc + PHASES.filter(p => (episodeStates[ep.id] || {})[p.id]).length, 0);
  const percent = Math.round((completedPhases / totalPhases) * 100);
  const completedEps = episodes.filter(ep => PHASES.every(p => (episodeStates[ep.id] || {})[p.id])).length;
  const inProgressEps = episodes.filter(ep => { const done = PHASES.filter(p => (episodeStates[ep.id] || {})[p.id]).length; return done > 0 && done < PHASES.length; }).length;

  return (
    <div className="pipeline">
      <div className="pipeline-header">
        <div className="pipeline-title">📊 Pipeline de Producción</div>
        <div className="pipeline-subtitle">Temporada 1 "Crecemos Juntos" · 10 episodios</div>
      </div>
      <div className="pipeline-stats">
        <div className="stat-card"><div className="stat-number">{percent}%</div><div className="stat-label">Completado</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:'#7BC67E'}}>{completedEps}</div><div className="stat-label">Entregados</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:'#FFB347'}}>{inProgressEps}</div><div className="stat-label">En Proceso</div></div>
        <div className="stat-card"><div className="stat-number" style={{color:'#FF8FA3'}}>{episodes.length - completedEps - inProgressEps}</div><div className="stat-label">Sin Iniciar</div></div>
      </div>
      <div className="episodes-grid">
        {episodes.map(ep => {
          const state = episodeStates[ep.id] || {};
          const doneCount = PHASES.filter(p => state[p.id]).length;
          const progressPct = Math.round((doneCount / PHASES.length) * 100);
          return (
            <div key={ep.id} className="episode-card">
              <div className="ep-header">
                <div style={{position:'relative', flexShrink:0}}>
                  {ep.avatar ? (
                    <>
                      <img src={ep.avatar} alt={ep.lead} className="ep-avatar" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      <div className="ep-avatar-emoji" style={{display:'none'}}>{ep.emoji}</div>
                    </>
                  ) : (
                    <div className="ep-avatar-emoji">{ep.emoji}</div>
                  )}
                </div>
                <div className="ep-info">
                  <div className="ep-id">{ep.id}</div>
                  <div className="ep-title">{ep.title}</div>
                  <div className="ep-emotion">{ep.emotion}</div>
                  <div className="ep-lead">Personaje líder: {ep.lead}</div>
                </div>
              </div>
              <div className="ep-progress">
                <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${progressPct}%`}} /></div>
                <div className="progress-text">{doneCount}/{PHASES.length} fases · {progressPct}%</div>
              </div>
              <div className="ep-phases">
                {PHASES.map(phase => (
                  <button key={phase.id} className={`phase-chip ${state[phase.id] ? 'done' : 'pending'}`} onClick={() => updateEpisodeState(ep.id, phase.id, !state[phase.id])}>
                    {state[phase.id] ? '✓' : phase.icon} {phase.label}
                  </button>
                ))}
              </div>
              <div className="ep-actions">
                <button className="btn-studio" onClick={() => onOpenStudio(ep, null)}>🎙️ Abrir en Estudio</button>
                <button className="btn-quick" onClick={() => onOpenStudio(ep, 'escritura')} title="Escritura">📝</button>
                <button className="btn-quick" onClick={() => onOpenStudio(ep, 'musica')} title="Música">🎵</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
