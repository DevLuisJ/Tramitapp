import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Car, Truck } from 'lucide-react';
import { useData } from '../context/DataContext';

const VehiclesPage = () => {
    const { vehicles, addVehicle, updateVehicle, deleteVehicle, clients } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);

    const [formData, setFormData] = useState({
        condition: 'NUEVO', // NUEVO | USADO
        service: 'PARTICULAR', // PARTICULAR | PUBLICO
        plate: '',
        brand: '',
        line: '',
        model: '',
        vin: '',
        ownerId: ''
    });

    // Derived state for display
    const filteredVehicles = vehicles.filter(v =>
        v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.vin.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getOwnerName = (id) => {
        const client = clients.find(c => c.id === id);
        return client ? client.name : 'Sin Asignar';
    };

    const resetForm = () => {
        setFormData({
            condition: 'NUEVO',
            service: 'PARTICULAR',
            plate: '',
            brand: '',
            line: '',
            model: '',
            vin: '',
            ownerId: ''
        });
        setEditingVehicle(null);
    };

    const handleAddNew = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData(vehicle);
        setShowModal(true);
    };

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            if (editingVehicle) {
                await updateVehicle({ ...formData, id: editingVehicle.id });
                setSuccess('Vehículo actualizado correctamente');
            } else {
                await addVehicle(formData);
                setSuccess('Vehículo creado correctamente');
            }
            setTimeout(() => {
                setShowModal(false);
                setSuccess('');
            }, 1000);
        } catch (err) {
            console.error(err);
            setError('Error al guardar vehículo: ' + (err.message || 'Verifique los datos'));
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Gestión de Vehículos</h1>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={18} />
                    Nuevo Vehículo
                </button>
            </div>

            <div className="card glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Buscar por placa, VIN o marca..."
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
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Vehículo</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Identificación</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Servicio</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Propietario</th>
                            <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.map(vehicle => (
                            <tr key={vehicle.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                                            {vehicle.service === 'PARTICULAR' ? <Car size={20} /> : <Truck size={20} />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{vehicle.brand} {vehicle.line}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mod {vehicle.model} • {vehicle.condition}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                                    <div style={{ fontWeight: '500' }}>{vehicle.plate || 'SIN MATRÍCULA'}</div>
                                    <div style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>VIN: {vehicle.vin}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border)',
                                        background: vehicle.service === 'PARTICULAR' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                        color: vehicle.service === 'PARTICULAR' ? 'var(--primary)' : 'var(--warning)'
                                    }}>
                                        {vehicle.service}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {getOwnerName(vehicle.ownerId)}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(vehicle)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginRight: '0.5rem' }}>
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => deleteVehicle(vehicle.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card glass-panel" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}</h2>

                        {error && (
                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)', color: '#10b981', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>

                                {/* Condition & Service */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Condición</label>
                                    <select
                                        className="input-field"
                                        value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    >
                                        <option value="NUEVO">Nuevo</option>
                                        <option value="USADO">Usado</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Servicio</label>
                                    <select
                                        className="input-field"
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    >
                                        <option value="PARTICULAR">Particular</option>
                                        <option value="PUBLICO">Público</option>
                                    </select>
                                </div>

                                {/* Identifiers */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Placa</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        placeholder={formData.condition === 'NUEVO' ? 'Opcional si es nuevo' : 'AAA-123'}
                                        value={formData.plate}
                                        onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>VIN / Chasis</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.vin}
                                        onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                                    />
                                </div>

                                {/* Details */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Marca</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Línea</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        required
                                        value={formData.line}
                                        onChange={(e) => setFormData({ ...formData, line: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Modelo (Año)</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        required
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    />
                                </div>

                                {/* Owner Link */}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Propietario</label>
                                    <select
                                        className="input-field"
                                        value={formData.ownerId}
                                        onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                                    >
                                        <option value="">-- Seleccionar --</option>
                                        {clients.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.documentNumber})</option>
                                        ))}
                                    </select>
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

export default VehiclesPage;
