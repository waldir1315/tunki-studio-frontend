import React, { useState } from 'react';
import s from './Personajes.module.css';

const PERSONAJES = [
  {
    id: 'luna', emoji: '🐱', nombre: 'Luna', especie: 'Gata',
    color: '#ff7eb3', colorBg: 'rgba(255,126,179,0.08)',
    rasgo: 'Empática', funcion: 'Valida emociones',
    voz: 'F3–F4 · Suave · 140 wpm máx',
    arquetipo: 'Figura de contención (Winnicott)',
    frase: '¿Cómo te sientes tú cuando eso pasa?',
    nunca: 'Dar soluciones directas · Juzgar emociones',
    siempre: 'Preguntar antes de responder · Validar antes de aconsejar',
    episodios: ['EP02', 'EP08'],
    dallePrompt: 'Luna cat character, soft pink color, flat design 2D illustration, big expressive empathetic eyes, gentle smile, pastel pink, clean lines, children animation style, age 3-7'
  },
  {
    id: 'dino', emoji: '🦖', nombre: 'Dino', especie: 'Dinosaurio',
    color: '#7edca0', colorBg: 'rgba(126,220,160,0.08)',
    rasgo: 'Perseverante', funcion: 'Modela resiliencia',
    voz: 'M3–M4 · Energético · 160 wpm',
    arquetipo: 'Modelo de resiliencia (Bandura)',
    frase: '¡Podemos intentarlo de otra forma!',
    nunca: 'Rendirse en pantalla · Minimizar dificultades',
    siempre: 'Mostrar esfuerzo sostenido · Celebrar el proceso, no el resultado',
    episodios: ['EP03', 'EP08'],
    dallePrompt: 'Dino dinosaur character, soft green color, flat design 2D illustration, big round eyes, determined friendly expression, pastel green, clean lines, children animation style, age 3-7'
  },
  {
    id: 'pipo', emoji: '🐥', nombre: 'Pipo', especie: 'Pollito',
    color: '#7eb8ff', colorBg: 'rgba(126,184,255,0.08)',
    rasgo: 'Curioso', funcion: 'Estimula la exploración',
    voz: 'Agudo natural · Inflexiones ascendentes · Variable',
    arquetipo: 'El explorador seguro (Ainsworth)',
    frase: '¿Y qué pasaría si...?',
    nunca: 'Dar respuestas definitivas · Cerrarse a ideas',
    siempre: 'Hacer preguntas genuinas · Explorar antes de concluir',
    episodios: ['EP01', 'EP09'],
    dallePrompt: 'Pipo chick character, soft blue color, flat design 2D illustration, wide curious eyes, raised eyebrow, pastel blue feathers, clean lines, children animation style, age 3-7'
  },
  {
    id: 'nubi', emoji: '🐶', nombre: 'Nubi', especie: 'Perro',
    color: '#7edfdf', colorBg: 'rgba(126,223,223,0.08)',
    rasgo: 'Leal', funcion: 'Base segura del grupo',
    voz: 'Barítono cálido · Muy lento · Estable',
    arquetipo: 'Base segura (Bowlby)',
    frase: 'Aquí estoy, no estás solo/a.',
    nunca: 'Abandonar al grupo · Actuar por interés propio',
    siempre: 'Estar presente sin invadir · Acompañar sin resolver',
    episodios: ['EP04', 'EP09'],
    dallePrompt: 'Nubi dog character, soft turquoise color, flat design 2D illustration, warm loyal eyes, gentle calm expression, pastel teal, clean lines, children animation style, age 3-7'
  },
  {
    id: 'miel', emoji: '🐝', nombre: 'Miel', especie: 'Abeja',
    color: '#ffe07e', colorBg: 'rgba(255,224,126,0.08)',
    rasgo: 'Creativa', funcion: 'Pensamiento divergente',
    voz: 'Medio-agudo · Ritmo irregular · "Ajá" frecuente',
    arquetipo: 'Pensador creativo (Torrance)',
    frase: '¡Mira esto desde otro ángulo!',
    nunca: 'Descartar ideas sin explorar · Seguir solo el camino obvio',
    siempre: 'Conectar ideas inesperadas · Usar lentes para ver mejor',
    episodios: ['EP05'],
    dallePrompt: 'Miel bee character, golden yellow color, round glasses, flat design 2D illustration, excited bright eyes, small wings, pastel yellow, clean lines, children animation style, age 3-7'
  },
];

export default function Personajes() {
  const [seleccionado, setSeleccionado] = useState('luna');
  const [copiado, setCopiado] = useState(false);

  const p = PERSONAJES.find(p => p.id === seleccionado);

  const copiarPrompt = () => {
    navigator.clipboard.writeText(p.dallePrompt);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className={s.personajes}>
      <div className={s.header}>
        <h1 className={s.title}>Personajes</h1>
        <p className={s.subtitle}>Biblia de referencia · Tunki Tunes T1</p>
      </div>

      <div className={s.layout}>
        {/* Selector lateral */}
        <div className={s.selector}>
          {PERSONAJES.map(p => (
            <button
              key={p.id}
              className={`${s.pBtn} ${seleccionado === p.id ? s.pBtnActive : ''}`}
              style={{ '--p-color': p.color, '--p-bg': p.colorBg }}
              onClick={() => setSeleccionado(p.id)}
            >
              <span className={s.pEmoji}>{p.emoji}</span>
              <div className={s.pBtnInfo}>
                <span className={s.pBtnNombre}>{p.nombre}</span>
                <span className={s.pBtnEspecie}>{p.especie}</span>
              </div>
            </button>
          ))}

          {/* Estrellita */}
          <div className={s.estrellita}>
            <span>⭐</span>
            <div>
              <div className={s.pBtnNombre}>Estrellita</div>
              <div className={s.pBtnEspecie}>Personaje secundario</div>
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div className={s.detalle} key={p.id} style={{ '--p-color': p.color, '--p-bg': p.colorBg }}>
          <div className={s.detalleHeader}>
            <span className={s.detalleEmoji}>{p.emoji}</span>
            <div>
              <h2 className={s.detalleNombre}>{p.nombre}</h2>
              <p className={s.detalleEspecie}>{p.especie} · {p.rasgo}</p>
            </div>
            <div className={s.detalleBadge}>{p.funcion}</div>
          </div>

          <div className={s.cards}>
            <div className={s.card}>
              <div className={s.cardTitle}>🎤 Voz</div>
              <p className={s.cardContent}>{p.voz}</p>
            </div>
            <div className={s.card}>
              <div className={s.cardTitle}>🧠 Arquetipo</div>
              <p className={s.cardContent}>{p.arquetipo}</p>
            </div>
            <div className={s.card}>
              <div className={s.cardTitle}>📺 Episodios líder</div>
              <p className={s.cardContent}>{p.episodios.join(' · ')}</p>
            </div>
          </div>

          <div className={s.frase}>
            <div className={s.fraseLabel}>Frase característica</div>
            <blockquote className={s.fraseTexto}>"{p.frase}"</blockquote>
          </div>

          <div className={s.reglas}>
            <div className={s.regla}>
              <div className={s.reglaTitle}>✅ Siempre</div>
              <p className={s.reglaContent}>{p.siempre}</p>
            </div>
            <div className={s.regla}>
              <div className={s.reglaTitleNunca}>❌ Nunca</div>
              <p className={s.reglaContent}>{p.nunca}</p>
            </div>
          </div>

          <div className={s.promptBox}>
            <div className={s.promptHeader}>
              <span className={s.promptTitle}>🎨 Prompt base DALL-E 3</span>
              <button className={s.copyPromptBtn} onClick={copiarPrompt}>
                {copiado ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
            <code className={s.promptText}>{p.dallePrompt}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
