import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const CHARACTERS = [
  { id: 'luna', name: 'Luna', emoji: '🐱', color: '#FF9EC4', avatar: '/Personajes/Luna.PNG' },
  { id: 'dino', name: 'Dino', emoji: '🦖', color: '#7BC67E', avatar: '/Personajes/Dino.PNG' },
  { id: 'pipo', name: 'Pipo', emoji: '🐥', color: '#FFD93D', avatar: '/Personajes/Pipo.PNG' },
  { id: 'nubi', name: 'Nubi', emoji: '🐶', color: '#9B7FD4', avatar: '/Personajes/Nubi.PNG' },
  { id: 'miel', name: 'Miel', emoji: '🐝', color: '#FFD700', avatar: '/Personajes/Miel.PNG' },
  { id: 'estrellita', name: 'Estrellita', emoji: '⭐', color: '#FFF176', avatar: null },
];

const SCENARIOS = [
  { id: '', label: 'Sin escenario (fondo blanco)' },
  { id: 'bosque_tunki', label: '🌳 Bosque Tunki' },
  { id: 'casa_club', label: '🏠 Casa Club' },
  { id: 'pradera_musical', label: '🎵 Pradera Musical' },
  { id: 'cueva_suenos', label: '🌙 Cueva de los Sueños' },
  { id: 'rio_brillante', label: '💧 Río Brillante' },
];

const EMOTIONS = [
  'happy and smiling', 'sad and thoughtful', 'curious and excited',
  'surprised', 'proud and confident', 'scared but brave',
  'laughing', 'thinking', 'running and playing', 'sitting and relaxed',
];

export default function ImageGen() {
  const [character, setCharacter] = useState('luna');
  const [scenario, setScenario] = useState('');
  const [emotion, setEmotion] = useState('happy and smiling');
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const selectedChar = CHARACTERS.find(c => c.id === character);

  const generateImage = async () => {
    setLoading(true); setError(null); setResult(null);
    const prompt = `${emotion}${customPrompt ? ', ' + customPrompt : ''}`;
    try {
      const res = await fetch(`${API_URL}/api/generate-image`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character, scenario, prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setHistory(prev => [{ character, url: data.url }, ...prev.slice(0, 7)]);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 26, color: 'var(--text)', marginBottom: 4 }}>🎨 Generador de Imágenes</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>Identidad visual oficial · Flat design · Sin degradados</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Selector de personaje con ilustraciones reales */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>Personaje</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {CHARACTERS.map(char => (
                <button key={char.id} onClick={() => setCharacter(char.id)} style={{
                  padding: '12px 8px', borderRadius: 16,
                  border: `3px solid ${character === char.id ? char.color : 'var(--border)'}`,
                  background: character === char.id ? char.color + '22' : 'var(--bg)',
                  cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  boxShadow: character === char.id ? `0 4px 12px ${char.color}44` : 'none',
                }}>
                  {char.avatar ? (
                    <img src={char.avatar} alt={char.name} style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8 }} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  ) : null}
                  <span style={{ fontSize: char.avatar ? 0 : 32, display: char.avatar ? 'none' : 'block' }}>{char.emoji}</span>
                  <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: 12, color: character === char.id ? 'var(--text)' : 'var(--text2)' }}>{char.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Escenario */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Escenario</div>
            <select value={scenario} onChange={e => setScenario(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '2px solid var(--border)', background: 'var(--bg)', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
              {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          {/* Emoción */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Emoción / Pose</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {EMOTIONS.map(em => (
                <button key={em} onClick={() => setEmotion(em)} style={{
                  padding: '5px 10px', borderRadius: 50,
                  border: `1.5px solid ${emotion === em ? 'var(--accent)' : 'var(--border)'}`,
                  background: emotion === em ? '#FFF0E8' : 'transparent',
                  color: emotion === em ? 'var(--accent)' : 'var(--text2)',
                  fontFamily: 'Nunito', fontWeight: 700, fontSize: 11, cursor: 'pointer', transition: 'all 0.15s',
                }}>{em}</button>
              ))}
            </div>
          </div>

          {/* Detalle adicional */}
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Detalle adicional (opcional)</div>
            <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Ej: holding a flower, looking at the sky..." rows={2} style={{ width: '100%', padding: '10px 12px', borderRadius: 12, border: '2px solid var(--border)', background: 'var(--bg)', fontFamily: 'Nunito', fontWeight: 600, fontSize: 13, color: 'var(--text)', resize: 'none' }} />
          </div>

          {/* Botón */}
          <button onClick={generateImage} disabled={loading} style={{
            padding: 16, borderRadius: 'var(--radius)', border: 'none',
            background: loading ? 'var(--border)' : `linear-gradient(135deg, ${selectedChar?.color || 'var(--accent)'}, var(--accent))`,
            color: 'white', fontFamily: 'Nunito', fontWeight: 900, fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(255,107,53,0.3)',
          }}>
            {loading ? '⏳ Generando...' : `🎨 Generar ${selectedChar?.name}`}
          </button>
        </div>

        {/* Panel resultado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {loading && (
              <div style={{ textAlign: 'center', color: 'var(--text2)' }}>
                {selectedChar?.avatar && <img src={selectedChar.avatar} alt="" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 16, opacity: 0.5, animation: 'pulse 1.5s infinite' }} />}
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, marginBottom: 8 }}>Generando imagen...</div>
                <div style={{ fontSize: 13 }}>DALL-E está creando a {selectedChar?.name}</div>
              </div>
            )}
            {!loading && !result && !error && (
              <div style={{ textAlign: 'center', color: 'var(--text2)' }}>
                {selectedChar?.avatar ? <img src={selectedChar.avatar} alt="" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: 16, opacity: 0.6 }} /> : <div style={{ fontSize: 64, marginBottom: 12 }}>{selectedChar?.emoji}</div>}
                <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 20, marginBottom: 8 }}>Listo para generar</div>
                <div style={{ fontSize: 13 }}>Configura y haz clic en Generar</div>
              </div>
            )}
            {error && <div style={{ textAlign: 'center', color: '#e55a25' }}><div style={{ fontSize: 32, marginBottom: 8 }}>❌</div><div style={{ fontWeight: 700 }}>{error}</div></div>}
            {result && (
              <div style={{ width: '100%' }}>
                <img src={result.url} alt="Generado" style={{ width: '100%', borderRadius: 16, display: 'block' }} />
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <a href={result.url} target="_blank" rel="noreferrer" style={{ flex: 1, padding: 10, borderRadius: 12, border: '2px solid var(--border)', color: 'var(--text2)', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, textAlign: 'center', textDecoration: 'none' }}>🔗 Abrir original</a>
                  <button onClick={generateImage} style={{ flex: 1, padding: 10, borderRadius: 12, border: 'none', background: 'var(--accent)', color: 'white', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🔄 Regenerar</button>
                </div>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '2px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Generaciones recientes</div>
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
                {history.map((item, i) => {
                  const ch = CHARACTERS.find(c => c.id === item.character);
                  return (
                    <div key={i} style={{ flexShrink: 0, cursor: 'pointer' }} onClick={() => setResult({ url: item.url })}>
                      <img src={item.url} alt="" style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', border: '2px solid var(--border)' }} />
                      <div style={{ fontSize: 10, textAlign: 'center', color: 'var(--text2)', marginTop: 4, fontWeight: 700 }}>{ch?.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
