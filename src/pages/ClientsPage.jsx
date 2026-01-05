import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, User, Building } from 'lucide-react';
import { useData } from '../context/DataContext';

const ClientsPage = () => {
    const { clients, addClient, updateClient, deleteClient } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        type: 'NATURAL',
        documentNumber: '',
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.documentNumber.includes(searchTerm)
    );

    const resetForm = () => {
        setFormData({
            type: 'NATURAL',
            documentNumber: '',
            name: '',
            email: '',
            phone: '',
            address: ''
        });
        setEditingClient(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData(client);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar cliente?')) {
            deleteClient(id);
        }
    };

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (editingClient) {
                await updateClient({ ...formData, id: editingClient.id });
            } else {
                await addClient(formData);
            }
            setShowModal(false);
        } catch (err) {
            console.error(err);
            setError('Error al guardar el cliente: ' + (err.message || 'Verifique los datos'));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestión de Clientes</h1>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={18} />
                    Nuevo Cliente
                </button>
            </div>

            <div className="card glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Buscar por nombre o cédula/NIT..."
                        style={{ paddingLeft: '2.5rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Tipo</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Identificación</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Nombre / Razón Social</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Contacto</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map(client => (
                            <tr key={client.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    {client.type === 'NATURAL' ?
                                        <span title="Persona Natural" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><User size={16} /> Nat</span> :
                                        <span title="Persona Jurídica" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><Building size={16} /> Jur</span>
                                    }
                                </td>
                                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{client.documentNumber}</td>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{client.name}</td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    <div>{client.email}</div>
                                    <div>{client.phone}</div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(client)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '0.5rem' }}>
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(client.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredClients.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No se encontraron clientes</div>}
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card glass-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>

                        {error && (
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: 'var(--radius-sm)',
                                color: '#ef4444',
                                marginBottom: '1rem',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tipo de Persona</label>
                                    <select
                                        className="input-field"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="NATURAL">Persona Natural</option>
                                        <option value="JURIDICA">Persona Jurídica</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Documento / NIT</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.documentNumber}
                                        onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Teléfono</label>
                                    <input
                                        type="tel"
                                        className="input-field"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nombre Completo / Razón Social</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Dirección</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                <button type="button" className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsPage;
