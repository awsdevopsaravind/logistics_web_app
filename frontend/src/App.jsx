import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import TripsPage from './pages/TripsPage';
import PaymentsPage from './pages/PaymentsPage';
import RoyaltyPage from './pages/RoyaltyPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import MaterialsPage from './pages/MaterialsPage';
import CustomerMaterialRatesPage from './pages/CustomerMaterialRatesPage';
import QuarryOwnersPage from './pages/QuarryOwnersPage';
import VehicleOwnersPage from './pages/VehicleOwnersPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="royalty" element={<RoyaltyPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="customer-material-rates" element={<CustomerMaterialRatesPage />} />
          <Route path="quarry-owners" element={<QuarryOwnersPage />} />
          <Route path="vehicle-owners" element={<VehicleOwnersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
