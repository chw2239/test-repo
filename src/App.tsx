import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { CRM360Page } from './pages/CRM360Page';
import { CompanyPage } from './pages/CompanyPage';
import { GroupCompanyPage } from './pages/GroupCompanyPage';
import { AssociatedCompanyPage } from './pages/AssociatedCompanyPage';
import { ContactPage } from './pages/ContactPage';
import { ProjectRFQPage } from './pages/ProjectRFQPage';
import { ReportsPage } from './pages/ReportsPage';
import { OrdersPage } from './pages/OrdersPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { CreditLimitPage } from './pages/CreditLimitPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CRM360Page />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/group-company" element={<GroupCompanyPage />} />
          <Route path="/associated-company" element={<AssociatedCompanyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/project-rfq" element={<ProjectRFQPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/credit-limit" element={<CreditLimitPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
