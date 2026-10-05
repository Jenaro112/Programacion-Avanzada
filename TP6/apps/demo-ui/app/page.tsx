'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { io, Socket } from 'socket.io-client';

gsap.registerPlugin(useGSAP, TextPlugin, ScrollTrigger);

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

interface KafkaEvent {
  eventId: string;
  eventType: string;
  occurredAt: string;
  correlationId: string;
  customerId: string;
  source: string;
  payload?: any;
}

interface ScenarioSpec {
  id: number;
  title: string;
  simulateFailure: 'none' | 'billing' | 'provisioning';
  description: string;
  techContext: string;
}

const SCENARIOS: ScenarioSpec[] = [
  {
    id: 1,
    title: 'Activación Estándar',
    simulateFailure: 'none',
    description: 'Proceso fluido y sin interrupciones. Los módulos financieros y de aprovisionamiento se sincronizan en perfecta armonía.',
    techContext: 'Fan-out en Kafka. Un solo evento dispara N consumidores concurrentes.',
  },
  {
    id: 2,
    title: 'Reversión Automática',
    simulateFailure: 'provisioning',
    description: 'Simula un obstáculo en el sistema. Nuestra arquitectura lo detecta al instante y aplica una reversión financiera segura.',
    techContext: 'Patrón Saga: Transacción compensatoria por fallo en aprovisionamiento.',
  },
  {
    id: 3,
    title: 'Resiliencia ante Caídas',
    simulateFailure: 'none',
    description: 'Un microservicio se desconecta de manera inesperada. El flujo espera pacientemente y retoma su curso sin perder peticiones.',
    techContext: 'Acumulación de lag. Retención inmutable y recuperación de offsets.',
  },
  {
    id: 4,
    title: 'Escalabilidad Fluida',
    simulateFailure: 'none',
    description: 'La carga de trabajo se distribuye de manera orgánica entre múltiples instancias para mantener siempre el más alto rendimiento.',
    techContext: 'Rebalanceo de grupo de consumidores. Claves de partición (keys).',
  },
  {
    id: 5,
    title: 'Memoria Histórica',
    simulateFailure: 'none',
    description: 'Un nuevo componente se une al ecosistema y reconstruye todo el contexto pasado de manera silenciosa e inmediata.',
    techContext: 'Event Sourcing. auto.offset.reset = earliest.',
  },
];

// ============================================================================
// COMPONENTE: LIQUID MORPH BUTTON
// ============================================================================
function LiquidMorphButton({ 
  onClick, 
  isFiring,
  progress,
  onFinish,
  className 
}: { 
  onClick: () => void; 
  isFiring: boolean; 
  progress: number;
  onFinish: () => void;
  className?: string;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  
  const { contextSafe } = useGSAP({ scope: buttonRef });

  useGSAP(() => {
    if (!buttonRef.current) return;
    
    const tl = gsap.timeline();

    if (isFiring) {
      tl.to(buttonRef.current, { 
        width: 180, 
        height: 48, 
        duration: 0.7, 
        ease: 'expo.inOut' 
      }, 0);
      
      tl.to('.text-iniciar', { y: -30, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0);
      tl.fromTo('.text-procesar', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, 
        0.2
      );
    } else {
      tl.to(buttonRef.current, { 
        width: 96, 
        height: 96, 
        duration: 0.7, 
        ease: 'expo.inOut' 
      }, 0);
      
      tl.to('.text-procesar', { y: 30, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0);
      tl.fromTo('.text-iniciar', 
        { y: -30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }, 
        0.2
      );
      
      gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
    }
  }, [isFiring]);

  useGSAP(() => {
    if (!isFiring) {
       gsap.killTweensOf(liquidRef.current);
       gsap.set(liquidRef.current, { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0 });
       return;
    }

    const insetRight = 100 - progress;

    gsap.to(liquidRef.current, {
       clipPath: `inset(0% ${insetRight}% 0% 0%)`,
       opacity: 1, 
       duration: progress === 100 ? 0.6 : 0.8,
       ease: progress === 100 ? 'expo.out' : 'power2.out',
       overwrite: true, 
       onComplete: () => {
          if (progress === 100) {
             // Retardo visual de gracia. Ahora es totalmente seguro porque el progreso 
             // solo llega a 100 cuando el evento final REAL ya está en la memoria.
             setTimeout(onFinish, 800);
          }
       }
    });
  }, [progress, isFiring]);

  const handleMouseMove = contextSafe((e: React.MouseEvent) => {
    if (isFiring || !buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    const mappedX = gsap.utils.mapRange(-width/2, width/2, -15, 15, x);
    const mappedY = gsap.utils.mapRange(-height/2, height/2, -15, 15, y);
    
    gsap.to(buttonRef.current, { x: mappedX, y: mappedY, duration: 0.4, ease: "power3.out" });
    gsap.to('.text-iniciar', { x: mappedX * 0.3, y: mappedY * 0.3, duration: 0.4, ease: "power3.out" });
  });

  const handleMouseLeave = contextSafe((e: React.MouseEvent) => {
    if (isFiring || !buttonRef.current) return;
    gsap.to(buttonRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
    gsap.to('.text-iniciar', { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1.2, 0.4)" });
  });

  return (
    <button 
      ref={buttonRef} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave} 
      onClick={onClick} 
      disabled={isFiring} 
      className={`relative overflow-hidden cursor-pointer shadow-lg border-2 border-[#171717] rounded-full bg-transparent ${className}`}
      style={{ width: 96, height: 96 }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-[#171717] font-semibold text-[11px] tracking-[0.2em] uppercase pointer-events-none">
        <span className="text-iniciar absolute whitespace-nowrap">Iniciar</span>
        <span className="text-procesar absolute whitespace-nowrap opacity-0">Procesar</span>
      </div>

      <div 
        ref={liquidRef} 
        className="absolute inset-0 bg-[#171717] flex items-center justify-center text-white font-semibold text-[11px] tracking-[0.2em] uppercase pointer-events-none opacity-0" 
        style={{ clipPath: 'inset(0% 100% 0% 0%)' }}
      >
        <span className="text-iniciar absolute whitespace-nowrap">Iniciar</span>
        <span className="text-procesar absolute whitespace-nowrap opacity-0">Procesar</span>
      </div>
    </button>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function ActivationDashboard() {
  const [events, setEvents] = useState<KafkaEvent[]>([]);
  const [activeId, setActiveId] = useState<number>(1);
  const [wsConnected, setWsConnected] = useState<boolean>(false);
  
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const prevActiveId = useRef(activeId);
  const emptyTextRef = useRef<HTMLParagraphElement>(null);
  const firingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const socket: Socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => setWsConnected(true));
    socket.on('disconnect', () => setWsConnected(false));
    socket.on('activationEvent', (event: KafkaEvent) => {
      setEvents((prev) => [event, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    if (!isFiring || events.length === 0) return;
    
    // FIX CRUCIAL: Solo disparamos el 100% con los EVENTOS VERDADERAMENTE FINALES de la saga.
    // Ignoramos ActivationCompleted y ActivationFailed porque sabemos que tienen eventos secuenciales posteriores 
    // como despachar correos (NotificationSend) o reversiones de facturación (BillingAccountCancelled).
    const isDone = events.some(e => 
      e.eventType.includes('Notification') || 
      e.eventType.includes('Cancelled') || 
      e.eventType.includes('Refunded') ||
      e.eventType.includes('Email')
    );

    setProgress((prev) => {
      if (prev === 100) return 100;
      if (isDone) return 100;
      
      // La barra se queda pausada elegantemente al 85% esperando el evento de Notificación o Cancelación.
      return Math.min(prev + 25, 85);
    });
  }, [events, isFiring]);

  const handleFire = useCallback(async (scenario: ScenarioSpec) => {
    if (isFiring) return;
    
    setIsFiring(true);
    setProgress(0);
    setEvents([]); 

    if (firingTimeoutRef.current) clearTimeout(firingTimeoutRef.current);

    try {
      await fetch('http://localhost:3000/activations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'C-100',
          planId: 'FLOW-1000M',
          simulateFailure: scenario.simulateFailure,
          scenario: scenario.id,
        }),
      });
    } catch (err) {
      console.error('Error in POST /activations:', err);
      setIsFiring(false);
    } finally {
      firingTimeoutRef.current = setTimeout(() => {
        setProgress(100);
      }, 10000); 
    }
  }, [isFiring]);

  const handleProgressComplete = useCallback(() => {
    setIsFiring(false);
  }, []);

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getSafeId = (rawId: string) => rawId.replace(/[^a-zA-Z0-9]/g, '');

  // ==========================================================================
  // GSAP ANIMATIONS CORE
  // ==========================================================================

  useGSAP(() => {
    // Animación eliminada. Los escenarios se pintan directamente.
    
    if (events.length === 0 && emptyTextRef.current) {
      gsap.to(emptyTextRef.current, {
        text: "Escuchando flujo de Kafka...",
        duration: 2,
        ease: "none",
        delay: 0.5
      });
    }

    SCENARIOS.forEach(s => {
      if (s.id !== activeId) {
        gsap.set(`.scenario-detail-${s.id}`, { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, pointerEvents: 'none' });
      } else {
        gsap.set(`.scenario-detail-${s.id}`, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, pointerEvents: 'auto' });
      }
    });

  }, { scope: containerRef });

  useGSAP(() => {
    if (prevActiveId.current !== activeId) {
      const tl = gsap.timeline();
      const prevClass = `.scenario-detail-${prevActiveId.current}`;
      const nextClass = `.scenario-detail-${activeId}`;

      tl.to(prevClass, { 
        clipPath: 'inset(100% 0% 0% 0%)',
        y: -40,
        opacity: 0,
        duration: 0.7, 
        ease: 'expo.inOut',
        onComplete: () => gsap.set(prevClass, { pointerEvents: 'none' })
      }, 0);

      tl.fromTo(nextClass, 
        { clipPath: 'inset(0% 0% 100% 0%)', y: 40, opacity: 1 },
        { 
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 0.7, 
          ease: 'expo.inOut',
          onStart: () => gsap.set(nextClass, { pointerEvents: 'auto' })
        }, 
        0
      );
      
      prevActiveId.current = activeId;
    }
  }, [activeId]);

  useGSAP(() => {
    if (events.length > 0) {
      const newestId = getSafeId(events[0].eventId);
      const row = `.ledger-row-${newestId}`;
      const cols = `.ledger-col-${newestId}`;
      
      const tl = gsap.timeline();
      
      tl.fromTo(row,
        { height: 0, opacity: 0, borderBottomColor: 'rgba(235, 233, 228, 0)' },
        { height: 'auto', opacity: 1, borderBottomColor: 'rgba(235, 233, 228, 1)', duration: 0.5, ease: 'power3.inOut' }
      )
      .fromTo(cols,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.1)' },
        "-=0.2"
      );
    }
  }, [events]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background p-6 md:p-14 font-sans text-text-primary flex justify-center">
      <div className="w-full max-w-[1400px] flex flex-col gap-12">
        
        {/* HEADER */}
        <header className="header-title-container flex justify-between items-end pb-8 border-b border-border-subtle z-50">
          <div>
            <h1 className="text-4xl md:text-5xl tracking-tight font-medium text-text-primary">
              Orquestación
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              {wsConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-semantic-success opacity-40"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${wsConnected ? 'bg-semantic-success' : 'bg-semantic-error'}`}></span>
            </span>
            <span className="text-xs uppercase tracking-[0.2em] font-medium text-text-tertiary">
              {wsConnected ? 'En línea' : 'Desconectado'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-16 relative">
          
          {/* SIDEBAR */}
          <aside className="sidebar-container flex flex-col gap-1 w-[300px]">
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-text-tertiary mb-6 px-4">
              Vectores
            </h3>
            <nav className="flex flex-col gap-1">
              {SCENARIOS.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (activeId !== s.id) {
                        setActiveId(s.id);
                        setEvents([]); 
                      }
                    }}
                    className={`sidebar-item relative text-left px-4 py-3.5 rounded-xl transition-all duration-300 group flex items-center justify-between ${
                      isActive 
                        ? 'bg-surface shadow-[0_2px_15px_rgb(0,0,0,0.03)] text-text-primary' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover/30'
                    }`}
                  >
                    <span className="text-[15px] font-medium tracking-tight">
                      {s.title}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-[#171717] scale-100' : 'bg-transparent scale-0'}`} />
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* MAIN AREA */}
          <main className="ledger-container flex flex-col gap-16 min-w-0 pb-32">
            
            {/* TOP: Detalles del Escenario */}
            <div className="relative h-[180px] w-full overflow-hidden rounded-xl">
              {SCENARIOS.map((s) => (
                <div 
                  key={s.id} 
                  className={`scenario-detail-${s.id} absolute inset-0 flex flex-col justify-between pt-2 px-2`}
                >
                  <div className="max-w-2xl">
                    <h2 className="text-2xl font-medium tracking-tight text-text-primary mb-4">
                      {s.title}
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed mb-4">
                      {s.description}
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-subtle">
                      <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-text-tertiary">Mecánica</span>
                      <span className="text-xs text-text-secondary">{s.techContext}</span>
                    </div>
                  </div>

                  <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-2">
                    <LiquidMorphButton
                      onClick={() => handleFire(s)}
                      isFiring={isFiring}
                      progress={progress}
                      onFinish={handleProgressComplete}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* BOTTOM: Ledger Tabular Minimalista */}
            <div className="flex flex-col flex-1 mt-6">
              <div className="flex items-center justify-between border-b border-border-strong pb-4 mb-2">
                <h3 className="text-sm font-semibold tracking-wide text-text-primary">
                  Registro del Sistema
                </h3>
                {events.length > 0 && (
                  <button 
                    onClick={() => setEvents([])}
                    className="text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    Purgar bitácora
                  </button>
                )}
              </div>

              <div className="flex-1 relative">
                {events.length === 0 ? (
                  <div className="py-20 flex justify-center opacity-60">
                    <p ref={emptyTextRef} className="text-sm font-medium text-text-secondary tracking-wide">
                      _
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="grid grid-cols-[100px_140px_1fr_120px] gap-6 px-4 py-3 text-[10px] uppercase tracking-[0.15em] font-semibold text-text-tertiary mb-2">
                      <span>Marca</span>
                      <span>Nodo</span>
                      <span>Operación</span>
                      <span className="text-right">Sujeto</span>
                    </div>

                    {events.map((ev) => {
                      const isError = ev.eventType.includes('Failed') || ev.eventType.includes('Error');
                      const isRollback = ev.eventType.includes('Cancelled');
                      const isSuccess = ev.eventType.includes('Completed') || ev.eventType.includes('Created');
                      const safeId = getSafeId(ev.eventId);
                      const isExpanded = !!expandedPayloads[ev.eventId];

                      let statusBadge = 'bg-surface text-text-secondary';
                      let opColor = 'text-text-primary';
                      
                      if (isError) {
                        statusBadge = 'bg-semantic-error/10 text-semantic-error';
                        opColor = 'text-semantic-error';
                      } else if (isRollback) {
                        statusBadge = 'bg-semantic-warning/10 text-semantic-warning';
                        opColor = 'text-semantic-warning';
                      } else if (isSuccess) {
                        statusBadge = 'bg-semantic-success/10 text-semantic-success';
                      }

                      const timeObj = new Date(ev.occurredAt);
                      const timeStr = timeObj.toLocaleTimeString('es-AR', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      }) + '.' + String(timeObj.getMilliseconds()).padStart(3, '0');

                      return (
                        <div 
                          key={ev.eventId} 
                          className={`ledger-row-${safeId} flex flex-col border-b border-border-subtle overflow-hidden hover:bg-surface-hover/30 transition-colors`}
                        >
                          <div 
                            className="grid grid-cols-[100px_140px_1fr_120px] gap-6 px-4 py-5 items-center cursor-pointer group"
                            onClick={() => togglePayload(ev.eventId)}
                          >
                            <span className={`ledger-col-${safeId} text-[11px] text-text-tertiary tabular-nums tracking-wider`}>
                              {timeStr}
                            </span>
                            
                            <div className={`ledger-col-${safeId}`}>
                              <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] uppercase tracking-widest font-semibold ${statusBadge}`}>
                                {ev.source.replace('-service', '').replace('-api', '')}
                              </span>
                            </div>

                            <span className={`ledger-col-${safeId} text-[15px] font-medium tracking-tight ${opColor}`}>
                              {ev.eventType.replace(/([A-Z])/g, ' $1').trim()}
                            </span>

                            <div className={`ledger-col-${safeId} text-right flex items-center justify-end gap-3`}>
                              <span className="text-[13px] font-medium text-text-primary">{ev.customerId}</span>
                              <span className={`text-[10px] text-text-tertiary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                ▼
                              </span>
                            </div>
                          </div>

                          <div 
                            className="overflow-hidden"
                            style={{ 
                              height: isExpanded ? 'auto' : 0, 
                              opacity: isExpanded ? 1 : 0,
                              transition: 'all 0.4s cubic-bezier(0.65, 0, 0.35, 1)' 
                            }}
                          >
                            {ev.payload && (
                              <div className="px-4 pb-6 pt-2">
                                <div className="bg-surface rounded-xl p-6 border border-border-subtle shadow-sm flex flex-col gap-4">
                                  <h4 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-text-tertiary border-b border-border-subtle pb-2">
                                    Detalles Estructurales
                                  </h4>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {Object.entries(ev.payload).map(([key, value]) => (
                                      <div key={key} className="flex flex-col gap-1">
                                        <span className="text-[11px] text-text-tertiary capitalize">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="text-[14px] font-medium text-text-primary">
                                          {String(value)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
