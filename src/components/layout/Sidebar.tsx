import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, Users, FolderKanban, FileText,
  ShoppingCart, Truck, CreditCard, ChevronDown, ChevronRight,
  Network, Link2, Home, Menu, X
} from 'lucide-react';
import { companies, orders, creditLimits } from '../../data/mockData';

interface NavItem {
  path: string;
  label: string;
  labelEn?: string;
  icon: React.ReactNode;
  hasAlert?: boolean;
}

const crmSubItems: NavItem[] = [
  { path: '/company', label: '公司', labelEn: 'Company', icon: <Building2 size={15} />, hasAlert: companies.some(c => c.hasAlert) },
  { path: '/group-company', label: '集團公司', labelEn: 'Group Company', icon: <Network size={15} /> },
  { path: '/associated-company', label: '關聯公司', labelEn: 'Associated Company', icon: <Link2 size={15} /> },
  { path: '/contact', label: '聯絡人', labelEn: 'Contacts', icon: <Users size={15} /> },
  { path: '/project-rfq', label: '項目/RFQ', labelEn: 'Projects/RFQ', icon: <FolderKanban size={15} /> },
  { path: '/reports', label: '報告', labelEn: 'Reports', icon: <FileText size={15} /> },
  { path: '/orders', label: '訂單', labelEn: 'Orders', icon: <ShoppingCart size={15} />, hasAlert: orders.some(o => o.hasAlert) },
  { path: '/delivery', label: '送貨', labelEn: 'Delivery', icon: <Truck size={15} /> },
  { path: '/credit-limit', label: '信用額度情況', labelEn: 'Credit Limit', icon: <CreditCard size={15} />, hasAlert: creditLimits.some(c => c.hasAlert) },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [crmExpanded, setCrmExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const isCrmRoute = location.pathname !== '/';
  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`flex flex-col bg-slate-800 text-white transition-all duration-200 flex-shrink-0 ${
        collapsed ? 'w-14' : 'w-56'
      }`}
      style={{ minHeight: '100vh' }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">CRM 360</p>
              <p className="text-xs text-slate-400 mt-0.5">Management System</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {/* Home */}
        <div
          onClick={() => navigate('/')}
          className={`sidebar-link ${isActive('/') ? 'active' : ''}`}
          title={collapsed ? 'Home' : undefined}
        >
          <Home size={16} className="flex-shrink-0" />
          {!collapsed && <span>Home</span>}
        </div>

        {/* CRM 360 */}
        <div>
          <div
            onClick={() => { setCrmExpanded(!crmExpanded); if (!isCrmRoute) navigate('/company'); }}
            className={`sidebar-link justify-between ${isCrmRoute ? 'text-white' : ''}`}
            title={collapsed ? 'CRM 360' : undefined}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={16} className="flex-shrink-0" />
              {!collapsed && <span>CRM 360</span>}
            </div>
            {!collapsed && (
              <span className="text-slate-400">
                {crmExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </div>

          {/* Sub-items */}
          {(crmExpanded || isCrmRoute) && !collapsed && (
            <div className="mt-1 space-y-0.5">
              {crmSubItems.map(item => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`sidebar-sublink ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.hasAlert && (
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Collapsed sub-items */}
          {collapsed && (
            <div className="mt-1 space-y-0.5">
              {crmSubItems.map(item => (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors relative ${
                    isActive(item.path) ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={`${item.label} (${item.labelEn})`}
                >
                  {item.icon}
                  {item.hasAlert && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">v1.0.0</p>
        </div>
      )}
    </div>
  );
};
