import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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

export default function Pipeline({ episodes, departments, onOpenStudio }) {
  const [episodeStates, setEpisodeStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  // Cargar estado desde Supabase
  useEffect(() => {
    fetch(`${API_URL}/api/pipeline`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const states = {};
          data.forEach(ep => {
            states[ep.episode_id] = {
              sinopsis: ep.sinopsis,
              libreto: ep.libreto,
              psicologia: ep.psicologia,
              storyboard: ep.storyboard,
              imagen: ep.imagen,
              suno: ep.suno,
              voces: ep.voces,
              entregado: ep.entregado,
            };
          });
          setEpisodeStates(states);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback a localStorage si Supabase no responde
        try {
          const saved = localStorage.getItem('tunki-pipeline');
          if (saved) setEpisodeStates(JSON.parse(saved));
        } catch {}
        setLoading(false);
      });
  }, []);

  const updatePhase = async (epId, phase, value) => {
    // Actualizar UI inmediatamente
    const updated = { ...episodeStates, [epId]: { ...episodeStates[epId], [phase]: value } };
    setEpisodeStates(updated);
    setSaving(epId);

    // Guardar en Supabase
    try {
      await fetch(`${API_URL}/api/pipeline/${epId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [phase]: value }),
      });
    } catch {
      // Fallback a localStorage
      try { localStorage.setItem('tunki-pipeline', JSON.stringify(updated)); } catch {}
    } finally {
      setSaving(null);
    }
  };

  const totalPhases = episodes.length * PHASES.length;
  const completedPhases = episodes.reduce((acc, ep) => acc + PHASES.filter(p => (episodeStates[ep.id] || {})[p.id]).length, 0);
  const percent = Math.round((completedPhases / totalPhases) * 100);
  const completedEps = episodes.filter(ep => PHASES.every(p => (episodeStates[ep.id] || {})[p.id])).length;
  const inProgressEps = episodes.filter(ep => { const done = PHASES.filter(p => (episodeStates[ep.id] || {})[p.id]).length; return done > 0 && done < PHASES.length; }).length;

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>🎬</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, color: 'var(--text2)' }}>Cargando pipeline...</div>
    </div>
  );

  return (
    <div className="pipeline">
      <div className="pipeline-header">
        <div className="pipeline-title">📊 Pipeline de Producción</div>
        <div className="pipeline-subtitle">
          Temporada 1 "Crecemos Juntos" · 10 episodios
          {saving && <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>💾 Guardando...</span>}
        </div>
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
                  <button key={phase.id} className={`phase-chip ${state[phase.id] ? 'done' : 'pending'}`} onClick={() => updatePhase(ep.id, phase.id, !state[phase.id])}>
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
