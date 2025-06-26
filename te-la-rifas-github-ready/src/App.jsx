import React, { useState, useEffect } from 'react';
import preguntas from './data/preguntas.json';

const temas = [...new Set(preguntas.map(p => p.tema))];

function seleccionarPreguntas(modo, tema) {
  const seleccion = preguntas.filter(p => modo === 'tema' ? p.tema === tema : true);
  const faciles = seleccion.filter(p => p.dificultad === 'fácil').slice(0, 15);
  const intermedias = seleccion.filter(p => p.dificultad === 'intermedia').slice(0, 15);
  const dificiles = seleccion.filter(p => p.dificultad === 'difícil').slice(0, 20);
  return [...faciles, ...intermedias, ...dificiles];
}

export default function App() {
  const [modo, setModo] = useState(null);
  const [tema, setTema] = useState('');
  const [inicio, setInicio] = useState(false);
  const [tiempo, setTiempo] = useState(20);
  const [idx, setIdx] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [vidas, setVidas] = useState(5);
  const [cura, setCura] = useState(false);
  const [pregs, setPregs] = useState([]);

  const iniciar = () => {
    const lis = seleccionarPreguntas(modo, tema);
    if (lis.length < 10) return alert('No hay suficientes preguntas');
    setPregs(lis);
    setInicio(true);
    setIdx(0); setTiempo(20); setPuntaje(0); setVidas(5);
  };

  const resp = (op) => {
    const corr = op === pregs[idx].respuesta;
    setCura(corr);
    if (corr) setPuntaje(p => p + (idx < 15 ? 10 : idx < 30 ? 20 : 30));
    else setVidas(v => v - 1);
    setTimeout(() => {
      if (idx + 1 >= pregs.length || vidas - (corr ? 0 : 1) <= 0) setInicio(false);
      else setIdx(idx + 1);
      setCura(false); setTiempo(20);
    }, 1000);
  };

  useEffect(() => {
    if (inicio && tiempo > 0) {
      const t = setTimeout(() => setTiempo(t => t - 1), 1000);
      return () => clearTimeout(t);
    } else if (inicio && tiempo === 0) resp(null);
  }, [tiempo, inicio]);

  if (!modo)
    return (
      <div style={{padding:20}}>
        <h1>¿Te La Rifas?</h1>
        <button onClick={() => setModo('clasico')}>Clásico</button>
        <button onClick={() => setModo('tema')}>Por tema</button>
      </div>
    );

  if (modo === 'tema' && !inicio)
    return (
      <div style={{padding:20}}>
        <h2>Selecciona tema</h2>
        <select onChange={e => setTema(e.target.value)}>
          <option value=''>--</option>
          {temas.map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={iniciar} disabled={!tema}>Iniciar</button>
      </div>
    );

  if (!inicio)
    return (
      <div style={{padding:20}}>
        <h2>Juego terminado</h2>
        <p>Puntaje: {puntaje}</p>
        <button onClick={() => setModo(null)}>Inicio</button>
      </div>
    );

  return (
    <div style={{padding:20}}>
      <h3>Pregunta {idx + 1} de {pregs.length}</h3>
      <p>{pregs[idx].pregunta}</p>
      {pregs[idx].opciones.map((o, i) => (
        <button key={i} onClick={() => resp(o)} style={{margin:5}}>{o}</button>
      ))}
      <p>Tiempo: {tiempo}s Vidas: {vidas} Puntaje: {puntaje}</p>
      {cura !== false && <p>{cura ? '¡Correcto!' : 'Incorrecto'}</p>}
    </div>
  );
}
