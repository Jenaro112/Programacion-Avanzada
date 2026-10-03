import { useState, useEffect } from 'react';
import TareaForm from './components/TareaForm';
import ListadoTareas from './components/ListadoTareas';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/tareas';

// Icono simple para el logo
const LogoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
    <path d="M7 7h.01"></path>
  </svg>
);

function App() {
  const [tareas, setTareas] = useState([]);
  const [tareaEditar, setTareaEditar] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchTareas();
  }, []);

  const fetchTareas = async () => {
    try {
      setCargando(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al cargar las tareas');
      const result = await res.json();
      setTareas(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarTarea = async (tareaData) => {
    try {
      const url = tareaEditar ? `${API_URL}/${tareaEditar.id}` : API_URL;
      const method = tareaEditar ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tareaData)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Error al guardar la tarea');
      }

      await fetchTareas();
      handleCerrarPanel(); // Cierra el panel y limpia la tarea en edición al guardar
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      
      if (tareaEditar && tareaEditar.id === id) {
        handleCerrarPanel();
      }
      await fetchTareas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFinalizar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/finalizar`, { method: 'PATCH' });
      if (!res.ok) throw new Error('Error al finalizar la tarea');
      await fetchTareas();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAbrirNuevo = () => {
    setTareaEditar(null);
    setIsFormOpen(true);
  };

  const handleAbrirEditar = (tarea) => {
    setTareaEditar(tarea);
    setIsFormOpen(true);
  };

  const handleCerrarPanel = () => {
    setTareaEditar(null);
    setIsFormOpen(false);
  };

  // * Métricas para el header
  const total = tareas.length;
  const pendientes = tareas.filter(t => t.estado === 'Pendiente').length;
  const enCurso = tareas.filter(t => t.estado === 'En Progreso').length;
  const completadas = tareas.filter(t => t.estado === 'Finalizada').length;

  return (
    <div className="app-container">
      {/* Header Compacto */}
      <header className="topbar">
        <div className="topbar-brand">
          <LogoIcon />
          <span>Manejador de Tareas</span>
        </div>

        <div className="topbar-stats">
          <div className="stat-item">TOTAL <strong>{total}</strong></div>
          <div className="stat-item">PENDIENTES <strong>{pendientes}</strong></div>
          <div className="stat-item">EN CURSO <strong>{enCurso}</strong></div>
          <div className="stat-item">COMPLETADAS <strong>{completadas}</strong></div>
        </div>
      </header>

      <div className="main-wrapper">
        {/* Contenido Principal */}
        <main className="content-area">
          <div className="content-header">
            <h1>Tareas</h1>
            <button className="btn btn-primary" onClick={handleAbrirNuevo}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nueva Tarea
            </button>
          </div>

          {error && (
            <div className="global-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <ListadoTareas 
            tareas={tareas} 
            cargando={cargando}
            onEditar={handleAbrirEditar} 
            onEliminar={handleEliminar}
            onFinalizar={handleFinalizar}
          />
        </main>

        {/* Overlay y Panel Lateral (Slide-over) para el Formulario */}
        <div className={`panel-overlay ${isFormOpen ? 'open' : ''}`} onClick={handleCerrarPanel}></div>
        <aside className={`side-panel ${isFormOpen ? 'open' : ''}`}>
          <TareaForm 
            onSubmit={handleGuardarTarea} 
            tareaEditar={tareaEditar} 
            onCancelar={handleCerrarPanel} 
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
