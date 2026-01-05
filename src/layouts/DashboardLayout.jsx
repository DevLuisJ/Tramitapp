import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const DashboardLayout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>
            <Sidebar />

            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '0 2rem 2rem 2rem',
                minWidth: 0 // Prevent flex overflow
            }}>
                <Header />

                <div className="content-area" style={{
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <Outlet />
                </div>
            </main>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default DashboardLayout;
