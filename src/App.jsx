import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Login from './pages/Login';
import UsersPage from './pages/UsersPage';
import ClientsPage from './pages/ClientsPage';
import VehiclesPage from './pages/VehiclesPage';
import ProceduresPage from './pages/ProceduresPage';
import CreateProcedure from './pages/CreateProcedure';
import ProcedureDetailsPage from './pages/ProcedureDetailsPage';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="clients" element={<ClientsPage />} />
              <Route path="vehicles" element={<VehiclesPage />} />
              {/* Placeholders for upcoming routes */}
              <Route path="procedures" element={<ProceduresPage />} />
              <Route path="procedures/new" element={<CreateProcedure />} />
              <Route path="procedures/:id" element={<ProcedureDetailsPage />} />
              <Route path="reports" element={<div>Reportes (Próximamente)</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
