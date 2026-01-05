import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, CheckCircle, FileText, Upload, Save, User, Car } from 'lucide-react';
import { useData } from '../context/DataContext';

const CreateProcedure = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { clients, vehicles, addProcedure } = useData();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: 'MATRICULA_PARTICULAR', // Default
        clientId: '',
        vehicleId: '',
        documents: {
            factura: null,
            soat: null,
            improntas: null,
            pagos: null,
            cartaAceptacion: null, // Public only
            contratoVinculacion: null // Public only
        },
        notes: ''
    });

    // Helper to find selected entities
    const selectedClient = clients.find(c => c.id === formData.clientId);
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

    const handleFileChange = (docName, file) => {
        setFormData(prev => ({
            ...prev,
            documents: { ...prev.documents, [docName]: file }
        }));
    };

    const getRequiredDocuments = () => {
        const common = ['Factura de Venta', 'SOAT Vigente', 'Improntas Motor/Chasis', 'Recibos de Pago Impuestos'];
        if (formData.type === 'MATRICULA_PUBLICO') {
            return [...common, 'Carta de Aceptación (Cupo)', 'Contrato de Vinculación'];
        }
        return common;
    };

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await addProcedure(formData);
            // No alert, just navigate. Or could show a success toast before navigating.
            alert(`Trámite ${formData.type === 'MATRICULA_PUBLICO' ? 'Público' : 'Particular'} creado exitosamente`);
            navigate('/procedures');
        } catch (err) {
            console.error(err);
            setError('Error al crear trámite: ' + (err.message || 'Verifique la información'));
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header ... */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/procedures')}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}
                >
                    <ArrowLeft size={18} /> Volver a la bandeja
                </button>
                <h1>Nuevo Trámite</h1>
            </div>

            {/* Stepper ... (Keep existing) */}

            <div className="card glass-panel">
                {step === 1 && (
                    <div className="step-content">
                        <h3 style={{ marginBottom: '1.5rem' }}>Datos del Trámite</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tipo de Trámite</label>
                            <select
                                className="input-field"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="MATRICULA_PARTICULAR">Matrícula Vehículo Particular</option>
                                <option value="MATRICULA_PUBLICO">Matrícula Vehículo Público</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Cliente (Propietario)</label>
                            {/* ... Keep Client Select ... */}
                            <select
                                className="input-field"
                                value={formData.clientId}
                                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            >
                                <option value="">-- Seleccionar --</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} - {c.documentNumber}</option>
                                ))}
                            </select>
                            {/* ... Keep Link ... */}
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                ¿No encuentras el cliente? <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/clients')}>Registrar nuevo</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Vehículo (Nueva Matrícula)</label>
                            <select
                                className="input-field"
                                value={formData.vehicleId}
                                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                            >
                                <option value="">-- Seleccionar --</option>
                                {vehicles.filter(v =>
                                    v.condition === 'NUEVO' &&
                                    (formData.type === 'MATRICULA_PUBLICO' ? v.service === 'PUBLICO' : v.service === 'PARTICULAR')
                                ).map(v => (
                                    <option key={v.id} value={v.id}>{v.brand} {v.line} - VIN: {v.vin}</option>
                                ))}
                            </select>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                {formData.type === 'MATRICULA_PUBLICO'
                                    ? 'Solo se muestran vehículos NUEVOS de servicio PÚBLICO.'
                                    : 'Solo se muestran vehículos NUEVOS de servicio PARTICULAR.'} <span style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/vehicles')}>Registrar vehículo</span>
                            </div>
                        </div>

                        {/* ... Keep Button ... */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                className="btn btn-primary"
                                disabled={!formData.clientId || !formData.vehicleId}
                                onClick={() => setStep(2)}
                            >
                                Siguiente Paso <ArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h3 style={{ marginBottom: '1.5rem' }}>Carga de Documentos</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {formData.type === 'MATRICULA_PUBLICO'
                                ? 'Para vehículos públicos se requieren documentos adicionales de operación.'
                                : 'Adjunta los soportes escaneados en formato PDF o Imagen.'}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {getRequiredDocuments().map((doc, idx) => (
                                <div key={idx} style={{
                                    border: '2px dashed var(--border)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center',
                                    background: 'rgba(0,0,0,0.1)'
                                }}>
                                    <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
                                    <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{doc}</p>
                                    <input type="file" style={{ fontSize: '0.8rem', maxWidth: '100%' }} />
                                </div>
                            ))}
                        </div>

                        {/* ... Keep Buttons ... */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <button className="btn" onClick={() => setStep(1)}>Atrás</button>
                            <button className="btn btn-primary" onClick={() => setStep(3)}>Siguiente Paso <ArrowRight /></button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h3 style={{ marginBottom: '1.5rem' }}>Revisión y Radicación</h3>

                        {error && (
                            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-sm)', color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <User size={20} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cliente</p>
                                    <p style={{ fontWeight: '600' }}>{selectedClient?.name}</p>
                                    <p style={{ fontSize: '0.9rem' }}>CC/NIT: {selectedClient?.documentNumber}</p>
                                </div>
                            </div>
                            <hr style={{ borderColor: 'var(--border)', margin: '1rem 0' }} />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Car size={20} style={{ color: 'var(--accent)' }} />
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vehículo</p>
                                    <p style={{ fontWeight: '600' }}>{selectedVehicle?.brand} {selectedVehicle?.line}</p>
                                    <p style={{ fontSize: '0.9rem' }}>VIN: {selectedVehicle?.vin}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notas adicionales</label>
                            <textarea
                                className="input-field"
                                rows="3"
                                placeholder="Observaciones para el trámite..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <button className="btn" onClick={() => setStep(2)}>Atrás</button>
                            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Radicando...' : 'Finalizar y Radicar'} <Save size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateProcedure;
