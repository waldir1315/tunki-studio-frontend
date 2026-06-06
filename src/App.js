import React, { useState } from 'react';
import Pipeline from './pages/Pipeline';
import Studio from './pages/Studio';
import ImageGen from './pages/ImageGen';
import './styles/globals.css';

export const EPISODES = [
  { id: 'EP01', title: 'El Día que Pipo no Quería Preguntar', emotion: 'Vergüenza / Curiosidad', lead: 'Pipo', emoji: '🐥', avatar: '/Personajes/Pipo.PNG' },
  { id: 'EP02', title: 'Luna y el Nudo en la Panza', emotion: 'Ansiedad anticipatoria', lead: 'Luna', emoji: '🐱', avatar: '/Personajes/Luna.PNG' },
  { id: 'EP03', title: 'Dino no Puede', emotion: 'Frustración / Autoeficacia', lead: 'Dino', emoji: '🦖', avatar: '/Personajes/Dino.PNG' },
  { id: 'EP04', title: 'El Secreto de Nubi', emotion: 'Soledad / Pertenencia', lead: 'Nubi', emoji: '🐶', avatar: '/Personajes/Nubi.PNG' },
  { id: 'EP05', title: 'Miel y las Mil Ideas', emotion: 'Abrumamiento / Enfoque', lead: 'Miel', emoji: '🐝', avatar: '/Personajes/Miel.PNG' },
  { id: 'EP06', title: 'Cuando Todo Sale Mal', emotion: 'Decepción / Resiliencia', lead: 'Todos', emoji: '🌈', avatar: null },
  { id: 'EP07', title: '¿Quién Soy Yo?', emotion: 'Identidad / Autoestima', lead: 'Estrellita', emoji: '⭐', avatar: null },
  { id: 'EP08', title: 'La Pelea', emotion: 'Conflicto / Reparación', lead: 'Luna + Dino', emoji: '💛', avatar: '/Personajes/Luna.PNG' },
  { id: 'EP09', title: 'Miedo a la Oscuridad', emotion: 'Miedo / Valentía', lead: 'Pipo + Nubi', emoji: '🌙', avatar: '/Personajes/Pipo.PNG' },
  { id: 'EP10', title: 'Festival Tunki', emotion: 'Celebración / Integración', lead: 'Todos', emoji: '🎉', avatar: null },
];

export const DEPARTMENTS = [
  { id: 'escritura', label: 'Escritura', icon: '📝', color: '#7EC8E3' },
  { id: 'psicologia', label: 'Psicología', icon: '🧠', color: '#B5A9FF' },
  { id: 'arte', label: 'Dir. de Arte', icon: '🎨', color: '#FFB347' },
  { id: 'storyboard', label: 'Storyboard', icon: '🎬', color: '#98D982' },
  { id: 'musica', label: 'Música', icon: '🎵', color: '#FF8FA3' },
  { id: 'voces', label: 'Voces', icon: '🎤', color: '#FFD700' },
  { id: 'produccion', label: 'Producción', icon: '📊', color: '#87CEEB' },
];

export default function App() {
  const [view, setView] = useState('pipeline');
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedDept, setSelectedDept] = useState(null);
  const [episodeStates, setEpisodeStates] = useState(() => {
    try { const s = localStorage.getItem('tunki-pipeline'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });

  const updateEpisodeState = (epId, phase, value) => {
    const updated = { ...episodeStates, [epId]: { ...episodeStates[epId], [phase]: value } };
    setEpisodeStates(updated);
    try { localStorage.setItem('tunki-pipeline', JSON.stringify(updated)); } catch {}
  };

  const openStudio = (episode, department) => {
    setSelectedEpisode(episode);
    setSelectedDept(department);
    setView('studio');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <img src="/Personajes/Logo.PNG" alt="Tunki Tunes" className="header-logo" />
          <div className="header-sub">Estudio de Producción · T1 "Crecemos Juntos"</div>
        </div>
        <nav className="header-nav">
          <button className={`nav-btn ${view === 'pipeline' ? 'active' : ''}`} onClick={() => setView('pipeline')}>📊 Pipeline</button>
          <button className={`nav-btn ${view === 'studio' ? 'active' : ''}`} onClick={() => setView('studio')}>🎙️ Estudio</button>
          <button className={`nav-btn ${view === 'imagegen' ? 'active' : ''}`} onClick={() => setView('imagegen')}>🎨 Imágenes</button>
        </nav>
      </header>

      {view === 'pipeline' && <Pipeline episodes={EPISODES} departments={DEPARTMENTS} episodeStates={episodeStates} updateEpisodeState={updateEpisodeState} onOpenStudio={openStudio} />}
      {view === 'studio' && <Studio episodes={EPISODES} departments={DEPARTMENTS} selectedEpisode={selectedEpisode} selectedDept={selectedDept} setSelectedEpisode={setSelectedEpisode} setSelectedDept={setSelectedDept} onBack={() => setView('pipeline')} />}
      {view === 'imagegen' && <ImageGen />}
    </div>
  );
}
