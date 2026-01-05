import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const STATUS_CONFIG = {
    EN_PREPARACION: { label: 'En Preparación', color: 'var(--text-muted)', icon: <Clock size={16} /> },
    RADICADO: { label: 'Radicado', color: 'var(--primary)', icon: <FileText size={16} /> },
    APROBADO: { label: 'Aprobado', color: 'var(--success)', icon: <CheckCircle size={16} /> },
    RECHAZADO: { label: 'Rechazado', color: 'var(--danger)', icon: <AlertCircle size={16} /> }
};

const PROCEDURE_TYPES = {
    MATRICULA_PARTICULAR: 'Matrícula Particular',
    MATRICULA_PUBLICO: 'Matrícula Público',
    TRASPASO: 'Traspaso de Propiedad',
    LEVANTAMIENTO_PRENDA: 'Levantamiento de Prenda'
};

const ProceduresPage = () => {
    const navigate = useNavigate();
    const { procedures, clients, vehicles } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredProcedures = procedures.filter(p => {
        const matchesSearch = p.id.includes(searchTerm);
        const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getClientName = (id) => clients.find(c => c.id === id)?.name || 'Desconocido';
    const getVehicleInfo = (id) => {
        const v = vehicles.find(v => v.id === id);
        return v ? `${v.brand} ${v.line} (${v.plate || 'Sin Placa'})` : 'Desconocido';
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Bandeja de Trámites</h1>
                <button className="btn btn-primary" onClick={() => navigate('/procedures/new')}>
                    <Plus size={18} />
                    Nuevo Trámite
                </button>
            </div>

            {/* Filters */}
            <div className="card glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Buscar por ID de trámite..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="input-field"
                    style={{ width: '200px' }}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Todos los Estados</option>
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                    ))}
                </select>
            </div>

            {/* Kanban/List View */}
            <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ID / Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Trámite</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Cliente / Vehículo</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Estado</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProcedures.map(proc => (
                            <tr key={proc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>#{proc.id}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{proc.date}</div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>
                                    {PROCEDURE_TYPES[proc.type] || proc.type}
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                    <div style={{ fontWeight: '600' }}>{getClientName(proc.clientId)}</div>
                                    <div style={{ color: 'var(--text-muted)' }}>{getVehicleInfo(proc.vehicleId)}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        background: `rgba(0,0,0,0.2)`,
                                        color: STATUS_CONFIG[proc.status]?.color || 'white',
                                        border: `1px solid ${STATUS_CONFIG[proc.status]?.color || 'white'}`
                                    }}>
                                        {STATUS_CONFIG[proc.status]?.icon}
                                        {STATUS_CONFIG[proc.status]?.label}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        className="btn"
                                        style={{ padding: '0.5rem', color: 'var(--primary)', background: 'rgba(59, 130, 246, 0.1)' }}
                                        onClick={() => navigate(`/procedures/${proc.id}`)}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProcedures.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay trámites que coincidan</div>}
            </div>
        </div>
    );
};

export default ProceduresPage;
