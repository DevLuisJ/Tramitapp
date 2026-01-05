import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, FileText, AlertCircle, User, Car, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

const STATUS_CONFIG = {
    EN_PREPARACION: { label: 'En Preparación', color: 'var(--text-muted)', icon: <Clock size={20} /> },
    RADICADO: { label: 'Radicado', color: 'var(--primary)', icon: <FileText size={20} /> },
    APROBADO: { label: 'Aprobado', color: 'var(--success)', icon: <CheckCircle size={20} /> },
    RECHAZADO: { label: 'Rechazado', color: 'var(--danger)', icon: <AlertCircle size={20} /> }
};

const ProcedureDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { procedures, clients, vehicles } = useData();

    const procedure = procedures.find(p => p.id === id);

    if (!procedure) {
        return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Trámite no encontrado.</div>;
    }

    const client = clients.find(c => c.id === procedure.clientId);
    const vehicle = vehicles.find(v => v.id === procedure.vehicleId);

    const currentStatusConfig = STATUS_CONFIG[procedure.status] || STATUS_CONFIG.EN_PREPARACION;

    return (
        <div>
            <button
                onClick={() => navigate('/procedures')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem' }}
            >
                <ArrowLeft size={18} /> Volver a la bandeja
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ margin: 0 }}>Trámite #{id}</h1>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.4rem 1rem', borderRadius: '20px',
                            fontSize: '0.9rem', fontWeight: '600',
                            background: `rgba(0,0,0,0.2)`,
                            color: currentStatusConfig.color,
                            border: `1px solid ${currentStatusConfig.color}`
                        }}>
                            {currentStatusConfig.icon}
                            {currentStatusConfig.label}
                        </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Matrícula de Vehículo Nuevo • Particular</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Última actualización</p>
                    <p style={{ fontWeight: '600' }}>{procedure.lastUpdate}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Column: Info & Documents */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Card: Actors */}
                    <div className="card glass-panel">
                        <h3 style={{ marginBottom: '1rem' }}>Información General</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cliente</p>
                                    <p style={{ fontWeight: '600' }}>{client?.name}</p>
                                    <p style={{ fontSize: '0.85rem' }}>{client?.documentNumber}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Car size={20} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Vehículo</p>
                                    <p style={{ fontWeight: '600' }}>{vehicle?.brand} {vehicle?.line}</p>
                                    <p style={{ fontSize: '0.85rem' }}>VIN: {vehicle?.vin}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Timeline */}
                    <div className="card glass-panel">
                        <h3 style={{ marginBottom: '1.5rem' }}>Línea de Tiempo</h3>
                        <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                            <div style={{ position: 'absolute', top: '0', bottom: '0', left: '6px', width: '2px', background: 'var(--border)' }}></div>
                            {procedure.timeline && procedure.timeline.map((event, idx) => (
                                <div key={idx} style={{ position: 'relative', marginBottom: '2rem', paddingLeft: '2rem' }}>
                                    <div style={{
                                        position: 'absolute', left: '-4px', top: '0',
                                        width: '22px', height: '22px', borderRadius: '50%',
                                        background: 'var(--bg-card)', border: '2px solid var(--primary)',
                                        zIndex: 1
                                    }}></div>
                                    <div>
                                        <p style={{ fontWeight: '600', marginBottom: '0.2rem' }}>{STATUS_CONFIG[event.status]?.label || event.status}</p>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{event.note}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            {event.date} • por {event.user}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card glass-panel">
                        <h3 style={{ marginBottom: '1rem' }}>Estado Actual</h3>
                        <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                            {currentStatusConfig.icon}
                            <h2 style={{ marginTop: '0.5rem', color: currentStatusConfig.color }}>{currentStatusConfig.label}</h2>
                        </div>
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }}>Actualizar Estado</button>
                            <button className="btn" style={{ width: '100%', border: '1px solid var(--border)' }}>Ver Documentos</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProcedureDetailsPage;
