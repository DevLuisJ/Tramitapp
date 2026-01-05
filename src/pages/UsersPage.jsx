import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';
import { supabase } from '../services/supabase';

const ROLES = {
    ADMIN: 'Administrador',
    VENDEDOR: 'Vendedor',
    TRAMITADOR: 'Tramitador'
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            // Map profile fields to UI expected fields if needed
            const mappedUsers = data.map(p => ({
                id: p.id,
                name: p.full_name || 'Sin Nombre',
                email: p.email,
                role: p.role
            }));
            setUsers(mappedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter users based on search
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestión de Usuarios</h1>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={18} />
                    Nuevo Usuario
                </button>
            </div>

            {/* Search Bar */}
            <div className="card glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Buscar por nombre o correo..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Usuario</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Rol</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Estado</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: 'var(--text-secondary)', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: 'var(--bg-secondary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--text-muted)'
                                        }}>
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-lg)',
                                        fontSize: '0.8rem',
                                        background: user.role === 'ADMIN' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                        color: user.role === 'ADMIN' ? 'var(--primary)' : 'var(--success)',
                                        fontWeight: '600'
                                    }}>
                                        {ROLES[user.role]}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>● Activo</span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleEdit(user)}
                                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '0.5rem' }}
                                        title="Editar"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredUsers.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No se encontraron usuarios
                    </div>
                )}
            </div>

            {/* Modal would go here - simplified for this step */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 100,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card glass-panel" style={{ width: '100%', maxWidth: '500px' }}>
                        <h2>{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
                            Funcionalidad de formulario detallado pendiente de implementación completa en el siguiente paso.
                        </p>
                        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
