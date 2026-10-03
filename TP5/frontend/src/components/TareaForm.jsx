import React, { useState, useEffect } from 'react';

// ==========================================================================
// ICONOS SVG INLINE
// ==========================================================================
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// ==========================================================================
// COMPONENTE FORMULARIO
// ==========================================================================
const TareaForm = ({ onSubmit, tareaEditar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre_proyecto: '',
    tipo_actividad: 'Feature',
    estado: 'Pendiente',
    resumen: '',
    descripcion: '',
    prioridad: 'Media',
    informador: '',
    persona_asignada: '',
    precondicion: '',
    fecha_creacion: new Date().toISOString().split('T')[0],
    fecha_cierre: '',
    sprint: ''
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (tareaEditar) {
      setFormData({
        ...tareaEditar,
        fecha_creacion: tareaEditar.fecha_creacion ? tareaEditar.fecha_creacion.split('T')[0] : '',
        fecha_cierre: tareaEditar.fecha_cierre ? tareaEditar.fecha_cierre.split('T')[0] : '',
      });
      setErrores({});
    } else {
      setFormData({
        nombre_proyecto: '',
        tipo_actividad: 'Feature',
        estado: 'Pendiente',
        resumen: '',
        descripcion: '',
        prioridad: 'Media',
        informador: '',
        persona_asignada: '',
        precondicion: '',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_cierre: '',
        sprint: ''
      });
      setErrores({});
    }
  }, [tareaEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre_proyecto.trim()) newErrors.nombre_proyecto = 'El proyecto es requerido';
    if (!formData.resumen.trim()) newErrors.resumen = 'El resumen es requerido';
    if (!formData.tipo_actividad) newErrors.tipo_actividad = 'Seleccione una actividad';
    if (!formData.estado) newErrors.estado = 'Seleccione un estado';
    if (!formData.prioridad) newErrors.prioridad = 'Seleccione una prioridad';

    setErrores(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.fecha_cierre) dataToSubmit.fecha_cierre = null;
      onSubmit(dataToSubmit);
    }
  };

  const esEdicion = !!tareaEditar;

  return (
    <>
      <div className="panel-header">
        <h2>{esEdicion ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        <button type="button" className="btn btn-ghost" onClick={onCancelar} title="Cerrar panel">
          <CloseIcon />
        </button>
      </div>

      <div className="panel-content">
        <form id="tarea-form" onSubmit={handleSubmit}>
          
          <div className="form-section">
            <h3>Información General</h3>
            <div className="form-group">
              <label htmlFor="nombre_proyecto">Proyecto *</label>
              <input
                type="text"
                id="nombre_proyecto"
                name="nombre_proyecto"
                value={formData.nombre_proyecto}
                onChange={handleChange}
                placeholder="Ej: Sistema de Gestión"
              />
              {errores.nombre_proyecto && <span className="error-text">{errores.nombre_proyecto}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="resumen">Resumen *</label>
              <input
                type="text"
                id="resumen"
                name="resumen"
                value={formData.resumen}
                onChange={handleChange}
                placeholder="Breve descripción del problema o mejora"
              />
              {errores.resumen && <span className="error-text">{errores.resumen}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion || ''}
                onChange={handleChange}
                rows="3"
                placeholder="Detalles adicionales..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Clasificación</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo_actividad">Actividad *</label>
                <select id="tipo_actividad" name="tipo_actividad" value={formData.tipo_actividad} onChange={handleChange}>
                  <option value="Bug">Bug</option>
                  <option value="Feature">Feature</option>
                  <option value="Mejora">Mejora</option>
                  <option value="Investigación">Investigación</option>
                  <option value="Documentación">Documentación</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado *</label>
                <select id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Finalizada">Finalizada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="prioridad">Prioridad *</label>
                <select id="prioridad" name="prioridad" value={formData.prioridad} onChange={handleChange}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="sprint">Sprint</label>
                <input
                  type="text"
                  id="sprint"
                  name="sprint"
                  value={formData.sprint || ''}
                  onChange={handleChange}
                  placeholder="Ej: Sprint 5"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Responsables</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="informador">Informador</label>
                <input
                  type="text"
                  id="informador"
                  name="informador"
                  value={formData.informador || ''}
                  onChange={handleChange}
                  placeholder="Quién reportó"
                />
              </div>
              <div className="form-group">
                <label htmlFor="persona_asignada">Asignado a</label>
                <input
                  type="text"
                  id="persona_asignada"
                  name="persona_asignada"
                  value={formData.persona_asignada || ''}
                  onChange={handleChange}
                  placeholder="Desarrollador"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Fechas & Dependencias</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha_creacion">Creación</label>
                <input
                  type="date"
                  id="fecha_creacion"
                  name="fecha_creacion"
                  value={formData.fecha_creacion || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fecha_cierre">Cierre</label>
                <input
                  type="date"
                  id="fecha_cierre"
                  name="fecha_cierre"
                  value={formData.fecha_cierre || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="precondicion">Precondición</label>
              <input
                type="text"
                id="precondicion"
                name="precondicion"
                value={formData.precondicion || ''}
                onChange={handleChange}
                placeholder="Depende de la tarea..."
              />
            </div>
          </div>

        </form>
      </div>

      <div className="panel-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" form="tarea-form" className="btn btn-primary">
          {esEdicion ? 'Guardar Cambios' : 'Crear Tarea'}
        </button>
      </div>
    </>
  );
};

export default TareaForm;
