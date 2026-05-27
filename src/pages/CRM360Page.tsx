import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FolderKanban, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { companies, contacts, projectRFQs, orders } from '../data/mockData';

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string; onClick?: () => void }> = ({ label, value, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className={`card flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value.toLocaleString()}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{ time: string; desc: string; type: 'visit' | 'order' | 'rfq' | 'alert' }> = ({ time, desc, type }) => {
  const colors = { visit: 'bg-blue-100 text-blue-600', order: 'bg-green-100 text-green-600', rfq: 'bg-purple-100 text-purple-600', alert: 'bg-red-100 text-red-600' };
  const icons = { visit: '👁', order: '📦', rfq: '📋', alert: '⚠️' };
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <span className={`text-xs px-2 py-1 rounded-full ${colors[type]}`}>{icons[type]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-700">{desc}</p>
        <p className="text-xs text-slate-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

export const CRM360Page: React.FC = () => {
  const navigate = useNavigate();
  const activeCompanies = companies.filter(c => c.customerStatus === 'Active').length;
  const prospectCompanies = companies.filter(c => c.customerStatus === 'Prospect').length;
  const alertCompanies = companies.filter(c => c.hasAlert).length;
  const overdueOrders = orders.filter(o => o.status === 'Overdue').length;
  const ongoingRFQs = projectRFQs.filter(p => p.projectOutcome === 'Ongoing').length;

  const newThisMonth = companies.filter(c => {
    const d = new Date(c.lastInvoiceDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-bold text-slate-800">CRM 360 Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of your customer relationship management</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Companies" value={companies.length} icon={<Building2 size={20} className="text-blue-600" />} color="bg-blue-50" onClick={() => navigate('/company')} />
          <StatCard label="Active Customers" value={activeCompanies} icon={<TrendingUp size={20} className="text-green-600" />} color="bg-green-50" onClick={() => navigate('/company')} />
          <StatCard label="Prospects" value={prospectCompanies} icon={<Users size={20} className="text-purple-600" />} color="bg-purple-50" onClick={() => navigate('/company')} />
          <StatCard label="Ongoing RFQs" value={ongoingRFQs} icon={<FolderKanban size={20} className="text-orange-600" />} color="bg-orange-50" onClick={() => navigate('/project-rfq')} />
        </div>

        {/* Alert summary & activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alerts */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-red-500" />
              <h3 className="text-sm font-semibold text-slate-700">Attention Required</h3>
            </div>
            <div className="space-y-2">
              {alertCompanies > 0 && (
                <div onClick={() => navigate('/company')} className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-100 cursor-pointer hover:bg-red-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-red-500" />
                    <span className="text-xs text-red-700 font-medium">Companies need follow-up</span>
                  </div>
                  <span className="badge bg-red-100 text-red-700">{alertCompanies}</span>
                </div>
              )}
              {overdueOrders > 0 && (
                <div onClick={() => navigate('/orders')} className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg border border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-orange-500" />
                    <span className="text-xs text-orange-700 font-medium">Overdue orders</span>
                  </div>
                  <span className="badge bg-orange-100 text-orange-700">{overdueOrders}</span>
                </div>
              )}
              <div onClick={() => navigate('/credit-limit')} className="flex items-center justify-between p-2.5 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-yellow-600" />
                  <span className="text-xs text-yellow-700 font-medium">Credit limit alerts</span>
                </div>
                <span className="badge bg-yellow-100 text-yellow-700">8</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">This Month</h3>
            <div className="space-y-3">
              {[
                { label: 'New invoiced companies', value: newThisMonth, color: 'text-blue-600' },
                { label: 'Total contacts', value: contacts.length, color: 'text-green-600' },
                { label: 'Active RFQs', value: ongoingRFQs, color: 'text-purple-600' },
                { label: 'Pending deliveries', value: orders.filter(o => o.status !== 'Delivered').length, color: 'text-orange-600' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="card">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Recent Activity</h3>
            <div>
              <ActivityItem time="2 hours ago" desc="Customer Visit report submitted for Alpha Engineering Products" type="visit" />
              <ActivityItem time="5 hours ago" desc="New RFQ RFQ2024-0049 created for Zeta2 Consumer Electronics" type="rfq" />
              <ActivityItem time="Yesterday" desc="SO-2024-1040 marked as overdue — Zeta2 Consumer Electronics" type="alert" />
              <ActivityItem time="Yesterday" desc="Order SO-2024-1034 delivered to Beta2 Electronics Assembly Co" type="order" />
              <ActivityItem time="2 days ago" desc="Technical Service report for Pi Medical Instruments Ltd" type="visit" />
            </div>
          </div>
        </div>

        {/* Module quick links */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {[
            { label: '公司', sub: 'Company', path: '/company', icon: <Building2 size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '聯絡人', sub: 'Contacts', path: '/contact', icon: <Users size={20} />, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '項目/RFQ', sub: 'Projects', path: '/project-rfq', icon: <FolderKanban size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: '訂單', sub: 'Orders', path: '/orders', icon: <Activity size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: '報告', sub: 'Reports', path: '/reports', icon: <TrendingUp size={20} />, color: 'text-teal-600', bg: 'bg-teal-50' },
          ].map(item => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="card flex flex-col items-center gap-2 py-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
                {item.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
