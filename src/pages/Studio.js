import React, { useState, useRef, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const QUICK_PROMPTS = {
  escritura: ['Dame el libreto completo de este episodio','Escribe la sinopsis del episodio','Dame los diálogos del momento emocional clave','Escribe el cierre reflexivo con Estrellita'],
  psicologia: ['Valida psicológicamente el episodio','¿Qué marco teórico aplica a este episodio?','Checklist de validación psicológica completo','¿El contenido respeta el principio central?'],
  arte: ['Dame los prompts de imagen para este episodio','Prompt de imagen para la escena emocional clave','Describe la paleta de colores del episodio','Dame el prompt base para el personaje líder'],
  storyboard: ['Dame el storyboard completo del episodio','Describe la escena de apertura (gancho)','Storyboard del momento de la canción','Describe el cierre visual del episodio'],
  musica: ['Dame el prompt Suno para la canción de apertura','Genera la letra de la canción principal','Prompt Suno para la canción de cierre','Dame la estructura musical completa del episodio'],
  voces: ['Guía de dirección vocal para este episodio','Script de grabación del personaje líder','Indicaciones de actuación por personaje','Perfil vocal detallado del personaje líder'],
  produccion: ['¿Qué falta para completar este episodio?','Dame el checklist de entrega completo','Lista todos los assets que necesito generar','Resumen del estado de la temporada'],
};
const DEFAULT_PROMPTS = ['Dame el pipeline completo de este episodio','¿En qué estado está la producción de la temporada?','Empieza por el principio: sinopsis y libreto'];

function formatMessage(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <div key={i} style={{fontSize:16,fontWeight:900,margin:'12px 0 6px',color:'var(--accent)'}}>{line.slice(2)}</div>;
    if (line.startsWith('## ')) return <div key={i} style={{fontSize:14,fontWeight:800,margin:'10px 0 4px',color:'var(--accent)'}}>{line.slice(3)}</div>;
    if (line.startsWith('### ')) return <div key={i} style={{fontSize:13,fontWeight:800,margin:'8px 0 4px',color:'var(--text2)'}}>{line.slice(4)}</div>;
    if (line.startsWith('- ') || line.startsWith('* ')) return <div key={i} style={{paddingLeft:16,marginBottom:3}}>• {line.slice(2)}</div>;
    if (line === '---') return <hr key={i} style={{border:'none',borderTop:'1px solid var(--border)',margin:'10px 0'}} />;
    if (line === '') return <div key={i} style={{height:6}} />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return <div key={i} style={{marginBottom:2}}>{parts.map((p,j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p)}</div>;
  });
}

export default function Studio({ episodes, departments, selectedEpisode, selectedDept, setSelectedEpisode, setSelectedDept, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const chatRef = useRef(null);

  const currentEp = selectedEpisode || episodes[0];
  const currentDept = departments.find(d => d.id === selectedDept);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');
    const ctx = currentEp ? `[Episodio: ${currentEp.id} — "${currentEp.title}" | Emoción: ${currentEp.emotion} | Líder: ${currentEp.lead}]\n\n` : '';
    const newMessages = [...messages, { role: 'user', content: ctx + userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, department: selectedDept || null }),
      });
      if (!res.ok) throw new Error('Error del servidor');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try { const data = JSON.parse(line.slice(6)); if (data.text) { assistantText += data.text; setMessages(prev => { const u = [...prev]; u[u.length-1] = { role:'assistant', content: assistantText }; return u; }); } } catch {}
          }
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${err.message}` }]);
    } finally { setLoading(false); }
  };

  const copyLast = () => {
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    if (last) { navigator.clipboard.writeText(last.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const quickPromptsForDept = selectedDept ? QUICK_PROMPTS[selectedDept] : DEFAULT_PROMPTS;

  return (
    <div style={{ display: 'flex', flex: 1, height: 'calc(100vh - 72px)', overflow: 'hidden' }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 280, flexShrink: 0, background: 'var(--surface)', borderRight: '2px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Episodio activo con avatar real */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Episodio activo</div>
          
          {/* Avatar + info del episodio */}
          {currentEp && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, padding: '10px 12px', background: 'var(--bg)', borderRadius: 14, border: '2px solid var(--border)' }}>
              {currentEp.avatar ? (
                <img src={currentEp.avatar} alt={currentEp.lead} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              ) : null}
              <div style={{ fontSize: 28, display: currentEp.avatar ? 'none' : 'flex', width: 48, height: 48, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{currentEp.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--accent)', letterSpacing: 1 }}>{currentEp.id}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentEp.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 600, marginTop: 2 }}>{currentEp.emotion}</div>
              </div>
            </div>
          )}

          <select
            className="sidebar-ep-select"
            value={currentEp?.id || ''}
            onChange={e => setSelectedEpisode(episodes.find(ep => ep.id === e.target.value))}
          >
            {episodes.map(ep => <option key={ep.id} value={ep.id}>{ep.emoji} {ep.id} — {ep.title}</option>)}
          </select>
        </div>

        {/* Departamentos */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Departamento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button className={`dept-btn ${!selectedDept ? 'active' : ''}`} onClick={() => setSelectedDept(null)}><span className="dept-icon">🎬</span> Modo libre</button>
            {departments.map(dept => (
              <button key={dept.id} className={`dept-btn ${selectedDept === dept.id ? 'active' : ''}`} onClick={() => setSelectedDept(dept.id)}>
                <span className="dept-icon">{dept.icon}</span> {dept.label}
              </button>
            ))}
          </div>
        </div>

        {/* Acciones rápidas — scrolleable */}
        <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: 'var(--text2)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10 }}>Acciones rápidas</div>
          {quickPromptsForDept.map((p, i) => <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(p)}>{p}</button>)}
        </div>

        {/* Botones inferiores fijos */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
          <button onClick={onBack} style={{ padding: '8px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text2)', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>← Volver al Pipeline</button>
          {messages.length > 0 && <button onClick={() => setMessages([])} style={{ padding: '8px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'transparent', color: 'var(--text2)', fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>🗑️ Nueva sesión</button>}
        </div>
      </div>

      {/* MAIN CHAT — layout fijo con input siempre abajo */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Mensajes — scrolleable */}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text2)', gap: 12, minHeight: '60vh' }}>
              {currentEp?.avatar ? (
                <img src={currentEp.avatar} alt="" style={{ width: 80, height: 80, objectFit: 'contain', opacity: 0.7 }} />
              ) : (
                <div style={{ fontSize: 64 }}>{currentDept ? currentDept.icon : '🎬'}</div>
              )}
              <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: 'var(--text)' }}>
                {currentDept ? `Departamento de ${currentDept.label}` : 'TUNKI STUDIO'}
              </div>
              <div style={{ fontSize: 14, maxWidth: 400, lineHeight: 1.6 }}>
                {currentEp ? `Trabajando en ${currentEp.id}: "${currentEp.title}". Dime qué necesitas o usa las acciones rápidas.` : 'Selecciona un episodio y dime qué necesitas producir.'}
              </div>
            </div>
          ) : messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="msg-avatar">
                {msg.role === 'user' ? '👤' : (currentEp?.avatar ? <img src={currentEp.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'contain'}} /> : '🎬')}
              </div>
              <div>
                {msg.role === 'assistant' && currentDept && <div className="dept-badge">{currentDept.icon} {currentDept.label}</div>}
                <div className="msg-bubble">
                  {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content.replace(/^\[Episodio:.*?\]\n\n/, '')}
                </div>
                {msg.role === 'assistant' && i === messages.length - 1 && !loading && (
                  <button className="copy-btn" onClick={copyLast}>{copied ? '✓ Copiado' : '📋 Copiar'}</button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="msg-avatar">🎬</div>
              <div className="msg-bubble"><div className="typing-indicator"><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div></div>
            </div>
          )}
        </div>

        {/* INPUT FIJO ABAJO — siempre visible */}
        <div style={{ padding: '16px 24px', borderTop: '2px solid var(--border)', background: 'var(--surface)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <textarea
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage();}}}
              placeholder={currentDept ? `Dile algo al departamento de ${currentDept.label}...` : 'Dile al estudio lo que necesitas producir...'}
              rows={2}
            />
            <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              {loading ? '⏳' : '↑'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
