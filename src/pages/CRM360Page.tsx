import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FolderKanban, TrendingUp, AlertCircle, Activity, Package, Truck, CreditCard, GitBranch } from 'lucide-react';
import { companies, contacts, projectRFQs, orders } from '../data/mockData';

const CHARACTERS = ['🟠', '🟢', '🔵', '🟡', '🫧', '⭐', '🌿', '💛', '🔶', '🩵', '🟣', '🌟'];

const FloatingChar: React.FC<{ emoji: string; style: React.CSSProperties }> = ({ emoji, style }) => (
  <span
    className="absolute text-2xl select-none pointer-events-none"
    style={{ ...style, fontSize: style.fontSize ?? '1.6rem' }}
    aria-hidden
  >
    {emoji}
  </span>
);

const StatCard: React.FC<{
  label: string;
  value: number | string;
  accent: string;
  onClick?: () => void;
}> = ({ label, value, accent, onClick }) => (
  <div
    onClick={onClick}
    className="family-card flex flex-col gap-1"
    style={{ cursor: onClick ? 'pointer' : 'default', transition: 'box-shadow 0.15s' }}
    onMouseEnter={e => onClick && ((e.currentTarget as HTMLDivElement).style.boxShadow = 'rgba(0,0,0,0.04) 0px 1px 6px 0px, rgba(0,0,0,0.05) 0px 0px 24px 0px')}
    onMouseLeave={e => onClick && ((e.currentTarget as HTMLDivElement).style.boxShadow = '')}
  >
    <p className="text-xs font-medium" style={{ color: '#848281', letterSpacing: '-0.12px' }}>{label}</p>
    <p className="text-4xl font-semibold" style={{ color: accent, letterSpacing: '-1.14px', lineHeight: 1.09 }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </p>
  </div>
);

const ModuleCard: React.FC<{
  label: string;
  sub: string;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
  path: string;
  alertCount?: number;
}> = ({ label, sub, icon, accentBg, accentText, path, alertCount }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(path)}
      className="family-card flex items-center gap-4 cursor-pointer"
      style={{ padding: '20px 24px', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = 'rgba(0,0,0,0.04) 0px 1px 6px 0px, rgba(0,0,0,0.05) 0px 0px 24px 0px')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '')}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 40, height: 40, borderRadius: 40, background: accentBg, color: accentText }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: '#343433', letterSpacing: '-0.17px' }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: '#848281' }}>{sub}</p>
      </div>
      {alertCount && alertCount > 0 ? (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: '#fff0ed', color: '#ff3e00', letterSpacing: '-0.12px' }}
        >
          {alertCount}
        </span>
      ) : null}
    </div>
  );
};

const ActivityRow: React.FC<{ time: string; desc: string; type: 'visit' | 'order' | 'rfq' | 'alert' }> = ({ time, desc, type }) => {
  const cfg = {
    visit:  { bg: '#f0fdf4', color: '#00ca48', icon: '👁' },
    order:  { bg: '#f0f9ff', color: '#0090ff', icon: '📦' },
    rfq:    { bg: '#fefce8', color: '#d48f00', icon: '📋' },
    alert:  { bg: '#fff0ed', color: '#ff3e00', icon: '⚠️' },
  }[type];
  return (
    <div className="flex items-start gap-3 py-3 border-b" style={{ borderColor: '#f2f0ed' }}>
      <span
        className="text-xs px-2 py-1 rounded-full flex-shrink-0 font-medium"
        style={{ background: cfg.bg, color: cfg.color }}
      >
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm" style={{ color: '#474645', letterSpacing: '-0.2px', lineHeight: 1.47 }}>{desc}</p>
        <p className="text-xs mt-0.5" style={{ color: '#848281' }}>{time}</p>
      </div>
    </div>
  );
};

export const CRM360Page: React.FC = () => {
  const navigate = useNavigate();

  const activeCompanies  = companies.filter(c => c.customerStatus === 'Active').length;
  const prospectCompanies = companies.filter(c => c.customerStatus === 'Prospect').length;
  const alertCompanies   = companies.filter(c => c.hasAlert).length;
  const overdueOrders    = orders.filter(o => o.status === 'Overdue').length;
  const ongoingRFQs      = projectRFQs.filter(p => p.projectOutcome === 'Ongoing').length;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: 'var(--canvas)' }}>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ background: 'var(--canvas)', padding: '64px 32px 56px', minHeight: 260 }}
      >
        {/* Floating characters */}
        <FloatingChar emoji="🟠" style={{ top: '18%',  left:  '8%'  }} />
        <FloatingChar emoji="🟢" style={{ top: '12%',  left:  '22%', fontSize: '1.2rem' }} />
        <FloatingChar emoji="⭐" style={{ top: '30%',  left:  '5%',  fontSize: '1rem'   }} />
        <FloatingChar emoji="🟡" style={{ top: '60%',  left:  '12%', fontSize: '1.4rem' }} />
        <FloatingChar emoji="🩵" style={{ bottom:'18%',left:  '20%', fontSize: '1rem'   }} />
        <FloatingChar emoji="🔶" style={{ top: '15%',  right: '9%'  }} />
        <FloatingChar emoji="🌿" style={{ top: '28%',  right: '4%',  fontSize: '1.2rem' }} />
        <FloatingChar emoji="🟣" style={{ top: '55%',  right: '15%', fontSize: '1rem'   }} />
        <FloatingChar emoji="🌟" style={{ bottom:'20%',right: '8%',  fontSize: '1.4rem' }} />
        <FloatingChar emoji="🫧" style={{ top: '10%',  left:  '42%', fontSize: '1rem'   }} />
        <FloatingChar emoji="💛" style={{ bottom:'12%',right: '28%', fontSize: '0.9rem' }} />

        {/* Headline */}
        <h1
          className="font-display relative z-10"
          style={{
            fontSize: 'clamp(40px, 6vw, 68px)',
            lineHeight: 1.09,
            letterSpacing: '-2.11px',
            color: 'var(--midnight)',
          }}
        >
          CRM 360
        </h1>
        <p
          className="relative z-10 mt-3"
          style={{ fontSize: 17, lineHeight: 1.47, letterSpacing: '-0.22px', color: 'var(--graphite)', maxWidth: 420 }}
        >
          客戶關係管理平台 — 公司、聯絡人、項目、訂單，全在一處。
        </p>

        {/* CTAs */}
        <div className="relative z-10 flex items-center gap-3 mt-6">
          <button className="btn-dark-pill" onClick={() => navigate('/company')}>
            進入公司列表
          </button>
          <button className="btn-light-pill" onClick={() => navigate('/project-rfq')}>
            查看項目 / RFQ
          </button>
        </div>
      </div>

      {/* Thin divider */}
      <div style={{ height: 1, background: 'var(--stone)', margin: '0 32px' }} />

      {/* ── Stats row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-8 py-6">
        <StatCard label="總公司數"      value={companies.length}   accent="var(--midnight)"  onClick={() => navigate('/company')} />
        <StatCard label="Active 客戶"   value={activeCompanies}    accent="var(--meadow)"    onClick={() => navigate('/company')} />
        <StatCard label="潛在客戶"      value={prospectCompanies}  accent="var(--sky)"       onClick={() => navigate('/company')} />
        <StatCard label="進行中 RFQ"    value={ongoingRFQs}        accent="var(--sunburst)"  onClick={() => navigate('/project-rfq')} />
      </div>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-8 pb-6">

        {/* Modules grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ModuleCard label="公司"       sub="Company"       path="/company"            icon={<Building2 size={18}/>}  accentBg="#fff0ed" accentText="#ff3e00" alertCount={alertCompanies} />
          <ModuleCard label="集團公司"   sub="Group Company" path="/group-company"       icon={<GitBranch size={18}/>}  accentBg="#f0fdf4" accentText="#00ca48" />
          <ModuleCard label="關聯公司"   sub="Associated"    path="/associated-company"  icon={<Users size={18}/>}      accentBg="#f0f9ff" accentText="#0090ff" />
          <ModuleCard label="聯絡人"     sub="Contacts"      path="/contact"             icon={<Users size={18}/>}      accentBg="#fefce8" accentText="#d48f00" />
          <ModuleCard label="項目 / RFQ" sub="Projects"      path="/project-rfq"         icon={<FolderKanban size={18}/>} accentBg="#fdf4ff" accentText="#9f4fff" />
          <ModuleCard label="報告"       sub="Reports"       path="/reports"             icon={<TrendingUp size={18}/>}  accentBg="#f0fdf4" accentText="#00ca48" />
          <ModuleCard label="訂單"       sub="Orders"        path="/orders"              icon={<Package size={18}/>}    accentBg="#fff0ed" accentText="#ff3e00" alertCount={overdueOrders} />
          <ModuleCard label="送貨"       sub="Delivery"      path="/delivery"            icon={<Truck size={18}/>}      accentBg="#f0f9ff" accentText="#0090ff" />
          <ModuleCard label="信用額度情況" sub="Credit Limit" path="/credit-limit"        icon={<CreditCard size={18}/>} accentBg="#fefce8" accentText="#d48f00" alertCount={8} />
        </div>

        {/* Right column: Alerts + Activity */}
        <div className="flex flex-col gap-4">

          {/* Alerts */}
          <div className="family-card" style={{ padding: 24 }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={15} style={{ color: '#ff3e00' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--charcoal)', letterSpacing: '-0.17px' }}>需要關注</h3>
            </div>
            <div className="flex flex-col gap-2">
              {alertCompanies > 0 && (
                <button
                  onClick={() => navigate('/company')}
                  className="flex items-center justify-between p-3 rounded-xl w-full text-left"
                  style={{ background: '#fff0ed', border: 'none', cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-2">
                    <Building2 size={13} style={{ color: '#ff3e00' }} />
                    <span className="text-xs font-medium" style={{ color: '#ff3e00' }}>公司需跟進</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#ff3e00', color: '#fff' }}>
                    {alertCompanies}
                  </span>
                </button>
              )}
              {overdueOrders > 0 && (
                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center justify-between p-3 rounded-xl w-full text-left"
                  style={{ background: '#fefce8', border: 'none', cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-2">
                    <Activity size={13} style={{ color: '#d48f00' }} />
                    <span className="text-xs font-medium" style={{ color: '#d48f00' }}>逾期訂單</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#d48f00', color: '#fff' }}>
                    {overdueOrders}
                  </span>
                </button>
              )}
              <button
                onClick={() => navigate('/credit-limit')}
                className="flex items-center justify-between p-3 rounded-xl w-full text-left"
                style={{ background: '#f0f9ff', border: 'none', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-2">
                  <CreditCard size={13} style={{ color: '#0090ff' }} />
                  <span className="text-xs font-medium" style={{ color: '#0090ff' }}>信用額度警示</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#0090ff', color: '#fff' }}>8</span>
              </button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="family-card" style={{ padding: 24 }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--charcoal)', letterSpacing: '-0.17px' }}>最近動態</h3>
            <ActivityRow time="2 小時前"  desc="Alpha Engineering 提交客戶拜訪報告"                    type="visit" />
            <ActivityRow time="5 小時前"  desc="新 RFQ RFQ2024-0049 建立 — Zeta2 Consumer Electronics" type="rfq"   />
            <ActivityRow time="昨天"      desc="SO-2024-1040 已逾期 — Zeta2 Consumer Electronics"      type="alert" />
            <ActivityRow time="昨天"      desc="訂單 SO-2024-1034 已送達 Beta2 Electronics Assembly"    type="order" />
            <div className="pt-3">
              <button className="ember-link text-sm" onClick={() => navigate('/reports')}>
                查看所有報告 →
              </button>
            </div>
          </div>

          {/* This month summary */}
          <div className="family-card-warm" style={{ padding: 24 }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--charcoal)', letterSpacing: '-0.17px' }}>本月概覽</h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: '聯絡人總數',   value: contacts.length,                                          color: 'var(--sky)'      },
                { label: '待處理送貨',   value: orders.filter(o => o.status !== 'Delivered').length,      color: 'var(--ember)'    },
                { label: '項目成功率',   value: `${Math.round(projectRFQs.filter(p => p.projectOutcome === 'Win').length / projectRFQs.length * 100)}%`, color: 'var(--meadow)' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--ash)', letterSpacing: '-0.12px' }}>{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: item.color, letterSpacing: '-0.17px' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
