import React from 'react';

// ==========================================================================
// ICONOS SVG INLINE (Estilo Lucide, limpios y consistentes)
// ==========================================================================
const StatusIcon = ({ estado }) => {
  if (estado === 'Finalizada') {
    return (
      <svg className="status-icon finalizada" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    );
  }
  if (estado === 'En Progreso') {
    return (
      <svg className="status-icon en_progreso" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    );
  }
  if (estado === 'Cancelada') {
    return (
      <svg className="status-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    );
  }
  // Pendiente u otros
  return (
    <svg className="status-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  );
};

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const TagIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// ==========================================================================
// COMPONENTE PRINCIPAL
// ==========================================================================
const ListadoTareas = ({ tareas, cargando, onEditar, onEliminar, onFinalizar }) => {
  // Helper para clases CSS sin tildes/espacios
  const getBadgeClass = (prefijo, valor) => {
    if (!valor) return '';
    const normalizado = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '_');
    return `badge-${prefijo}-${normalizado}`;
  };

  if (cargando) {
    return (
      <div className="loading-spinner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-pulse"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line></svg>
        Cargando tareas...
      </div>
    );
  }

  if (tareas.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        <p>No hay tareas registradas.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tareas.map((tarea) => {
        const isFinalizadaOCancelada = tarea.estado === 'Finalizada' || tarea.estado === 'Cancelada';
        const isFinalizada = tarea.estado === 'Finalizada';

        return (
          <div key={tarea.id} className="task-row">
            
            {/* Información Principal */}
            <div className="task-primary">
              <div className="task-title-group">
                <StatusIcon estado={tarea.estado} />
                <span className={`task-title ${isFinalizada ? 'completed' : ''}`}>
                  {tarea.resumen}
                </span>
              </div>
              <div className="task-meta">
                <span>{tarea.nombre_proyecto}</span>
                {tarea.sprint && (
                  <span>
                    <TagIcon /> {tarea.sprint}
                  </span>
                )}
                <span>
                  <CalendarIcon /> {tarea.fecha_creacion ? tarea.fecha_creacion.split('T')[0] : '-'}
                </span>
              </div>
            </div>

            {/* Clasificación y Badges */}
            <div className="task-secondary">
              <span className="badge">{tarea.tipo_actividad}</span>
              <span className={`badge ${getBadgeClass('prioridad', tarea.prioridad)}`}>
                {tarea.prioridad}
              </span>
              
              {tarea.persona_asignada && (
                <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none' }}>
                  <UserIcon /> {tarea.persona_asignada}
                </span>
              )}
            </div>

            {/* Acciones Integradas */}
            <div className="task-actions">
              <button 
                className="btn btn-ghost"
                onClick={() => onEditar(tarea)}
                disabled={isFinalizada}
                title="Editar tarea"
              >
                <EditIcon />
              </button>
              
              <button 
                className="btn btn-ghost success"
                onClick={() => onFinalizar(tarea.id)}
                disabled={isFinalizadaOCancelada}
                title="Marcar como finalizada"
              >
                <CheckIcon />
              </button>

              <button 
                className="btn btn-ghost danger"
                onClick={() => onEliminar(tarea.id)}
                title="Eliminar tarea"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListadoTareas;
