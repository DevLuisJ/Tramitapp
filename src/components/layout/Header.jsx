import React from 'react';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    return (
        <header className="header glass-panel" style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            borderRadius: '0 0 var(--radius-md) var(--radius-md)'
        }}>
            <div className="search-bar" style={{
                position: 'relative',
                width: '300px'
            }}>
                <Search size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                }} />
                <input
                    type="text"
                    placeholder="Buscar trámite, cliente, placa..."
                    className="input-field"
                    style={{ paddingLeft: '2.5rem' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    position: 'relative'
                }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        background: 'var(--danger)',
                        borderRadius: '50%'
                    }}></span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Admin User</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrador</p>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        color: 'white'
                    }}>
                        AU
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
