import React from 'react';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

const DashboardHome = () => {
    const stats = [
        { label: 'Trámites Activos', value: '12', icon: <FileText size={20} />, color: 'var(--primary)' },
        { label: 'Clientes Nuevos', value: '5', icon: <Users size={20} />, color: 'var(--accent)' },
        { label: 'Aprobados Hoy', value: '3', icon: <CheckCircle size={20} />, color: 'var(--success)' },
        { label: 'Pendientes', value: '8', icon: <Clock size={20} />, color: 'var(--warning)' },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>Panel Principal</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} className="card glass-panel" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            background: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            opacity: 0.9
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.label}</p>
                            <p style={{ fontSize: '1.8rem', fontWeight: '700' }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card glass-panel">
                <h3>Actividad Reciente</h3>
                <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No hay actividad reciente para mostrar.</p>
            </div>
        </div>
    );
};

export default DashboardHome;
