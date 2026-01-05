import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();

        // Optional: Realtime subscription could go here
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [clientsRes, vehiclesRes, proceduresRes] = await Promise.all([
                supabase.from('clients').select('*').order('created_at', { ascending: false }),
                supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
                supabase.from('procedures').select('*, timeline:procedure_events(*)').order('created_at', { ascending: false })
            ]);

            if (clientsRes.data) {
                const mappedClients = clientsRes.data.map(c => ({
                    ...c,
                    documentNumber: c.document_number
                }));
                setClients(mappedClients);
            }
            if (vehiclesRes.data) {
                const mappedVehicles = vehiclesRes.data.map(v => ({
                    ...v,
                    ownerId: v.owner_id
                }));
                setVehicles(mappedVehicles);
            }
            if (proceduresRes.data) setProcedures(proceduresRes.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Actions
    const addClient = async (client) => {
        const { data, error } = await supabase
            .from('clients')
            .insert([{
                type: client.type,
                document_number: client.documentNumber,
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address
            }])
            .select()
            .single();

        if (error) throw error;
        // Map back to camelCase for local state
        const newClient = {
            ...data,
            documentNumber: data.document_number
        };
        setClients(prev => [newClient, ...prev]);
        return newClient;
    };

    const updateClient = async (client) => {
        const { error } = await supabase
            .from('clients')
            .update({
                type: client.type,
                document_number: client.documentNumber,
                name: client.name,
                email: client.email,
                phone: client.phone,
                address: client.address
            })
            .eq('id', client.id);

        if (error) throw error;
        setClients(prev => prev.map(c => c.id === client.id ? { ...c, ...client } : c));
    };

    const deleteClient = async (id) => {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setClients(prev => prev.filter(c => c.id !== id));
    };

    const addVehicle = async (vehicle) => {
        const { data, error } = await supabase
            .from('vehicles')
            .insert([{
                brand: vehicle.brand,
                line: vehicle.line,
                model: vehicle.model,
                plate: vehicle.plate,
                vin: vehicle.vin,
                service: vehicle.service,
                condition: vehicle.condition,
                owner_id: vehicle.ownerId
            }])
            .select()
            .single();

        if (error) throw error;

        const newVehicle = {
            ...data,
            ownerId: data.owner_id
        };
        setVehicles(prev => [newVehicle, ...prev]);
        return newVehicle;
    };

    const updateVehicle = async (vehicle) => {
        const { error } = await supabase
            .from('vehicles')
            .update({
                brand: vehicle.brand,
                line: vehicle.line,
                model: vehicle.model,
                plate: vehicle.plate,
                vin: vehicle.vin,
                service: vehicle.service,
                condition: vehicle.condition,
                owner_id: vehicle.ownerId
            })
            .eq('id', vehicle.id);

        if (error) throw error;
        setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v));
    };

    const deleteVehicle = async (id) => {
        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    const addProcedure = async (procedure) => {
        // 1. Create Procedure
        const { data: newProc, error: procError } = await supabase
            .from('procedures')
            .insert([{
                type: procedure.type,
                vehicle_id: procedure.vehicleId,  // Snake case for DB
                client_id: procedure.clientId,    // Snake case for DB
                cost: procedure.cost,
                status: 'RADICADO'
            }])
            .select()
            .single();

        if (procError) throw procError;

        // 2. Create Initial Event
        const { data: eventData, error: eventError } = await supabase
            .from('procedure_events')
            .insert([{
                procedure_id: newProc.id,
                status: 'RADICADO',
                note: 'Trámite creado y radicado'
            }])
            .select()
            .single();

        if (eventError) console.error("Error creating initial event", eventError);

        // 3. Update local state
        const completeProc = {
            ...newProc,
            vehicleId: newProc.vehicle_id, // Map back to camelCase if needed by UI
            clientId: newProc.client_id,
            timeline: [eventData]
        };

        setProcedures(prev => [completeProc, ...prev]);
        return completeProc;
    };

    return (
        <DataContext.Provider value={{
            clients,
            addClient,
            updateClient,
            deleteClient,
            vehicles,
            addVehicle,
            updateVehicle,
            deleteVehicle,
            procedures,
            addProcedure,
            loading
        }}>
            {children}
        </DataContext.Provider>
    );
};
