import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardCustomer from './components/DashboardCustomer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Menambahkan route untuk halaman utama */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-dashboard" element={<DashboardAdmin />} />
        <Route path="/customer-dashboard" element={<DashboardCustomer />} />
      </Routes>
    </Router>
  );
};

export default App;
