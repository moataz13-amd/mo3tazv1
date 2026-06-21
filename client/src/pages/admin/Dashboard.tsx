import { useQuery } from '@tanstack/react-query';
import {
  Users,
  Briefcase,
  MailOpen,
  Activity,
  ArrowUpRight,
  TrendingUp,
  Monitor,
  Globe,
  Inbox,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { analyticsAPI } from '../../lib/api';
import type { DashboardStats, ActivityLog } from '../../types';
import { useAdminTranslation } from '../../lib/adminTranslations';

// Fallback/Mock data for premium display
const defaultStats: DashboardStats = {
  total_visitors: 1240,
  total_projects: 8,
  total_messages: 45,
  total_posts: 12,
  unread_messages: 3,
};

const defaultVisitorData = [
  { name: 'Mon', visits: 120 },
  { name: 'Tue', visits: 180 },
  { name: 'Wed', visits: 150 },
  { name: 'Thu', visits: 220 },
  { name: 'Fri', visits: 200 },
  { name: 'Sat', visits: 310 },
  { name: 'Sun', visits: 280 },
];

const defaultDeviceData = [
  { name: 'Desktop', value: 65, color: '#00E5FF' },
  { name: 'Mobile', value: 30, color: '#4F46E5' },
  { name: 'Tablet', value: 5, color: '#7C3AED' },
];

const defaultBrowserData = [
  { name: 'Google Chrome', value: 58, color: '#00E5FF' },
  { name: 'Apple Safari', value: 22, color: '#4F46E5' },
  { name: 'Mozilla Firefox', value: 12, color: '#4F46E5' },
  { name: 'Microsoft Edge', value: 8, color: '#FF2E93' },
];

const defaultLogs: ActivityLog[] = [
  { id: '1', action: 'Project Created', description: 'Added new project NeoBank Dashboard', created_at: '2 hours ago' },
  { id: '2', action: 'System Config', description: 'Updated SEO meta tags in settings', created_at: '5 hours ago' },
  { id: '3', action: 'Inquiry Received', description: 'New message received from Sarah Mitchell', created_at: '1 day ago' },
  { id: '4', action: 'Skills Updated', description: 'Modified React & Next.js level status', created_at: '2 days ago' },
];

export default function Dashboard() {
  const { t, adminLanguage } = useAdminTranslation();

  const { data: statsData } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => analyticsAPI.getDashboardStats().then((r) => r.data as DashboardStats),
  });

  const { data: visitorChart } = useQuery({
    queryKey: ['visitorChart'],
    queryFn: () => analyticsAPI.getVisitorChart().then((r) => r.data),
  });

  const { data: deviceChart } = useQuery({
    queryKey: ['deviceChart'],
    queryFn: () => analyticsAPI.getDeviceChart().then((r) => r.data),
  });

  const { data: browserChart } = useQuery({
    queryKey: ['browserChart'],
    queryFn: () => analyticsAPI.getBrowserChart().then((r) => r.data),
  });

  const { data: logsData } = useQuery({
    queryKey: ['activityLogs'],
    queryFn: () => analyticsAPI.getActivityLogs().then((r) => r.data as ActivityLog[]),
  });

  const stats = statsData || defaultStats;
  const visitorsDataRaw = visitorChart || defaultVisitorData;
  const devicesDataRaw = deviceChart || defaultDeviceData;
  const browsers = browserChart || defaultBrowserData;
  const logsRaw = logsData || defaultLogs;

  // Localization utilities
  const visitors = visitorsDataRaw.map((v: any) => ({
    ...v,
    name: t(v.name.toLowerCase() as any, v.name)
  }));

  const devices = devicesDataRaw.map((d: any) => ({
    ...d,
    name: t(d.name.toLowerCase() as any, d.name)
  }));

  const getLocalizedAction = (action: string) => {
    if (adminLanguage !== 'ar') return action;
    if (action.toLowerCase().includes('project created')) return 'تم إنشاء مجموعة جديدة';
    if (action.toLowerCase().includes('system config')) return 'تعديل تهيئة النظام';
    if (action.toLowerCase().includes('inquiry received')) return 'تم استقبال استفسار جديد';
    if (action.toLowerCase().includes('skills updated')) return 'تحديث المهارات';
    return action;
  };

  const getLocalizedTime = (time: string) => {
    if (adminLanguage !== 'ar') return time;
    return time
      .replace('hours ago', 'ساعات مضت')
      .replace('hour ago', 'ساعة مضت')
      .replace('days ago', 'أيام مضت')
      .replace('day ago', 'يوم مضى')
      .replace('some time ago', 'منذ فترة وجيزة');
  };

  const logs = logsRaw.map(log => ({
    ...log,
    action: getLocalizedAction(log.action),
    created_at: getLocalizedTime(log.created_at)
  }));

  const statCards = [
    { label: t('systemVisitors'), value: stats.total_visitors, icon: Users, color: '#00E5FF' },
    { label: t('totalProjects'), value: stats.total_projects, icon: Briefcase, color: '#4F46E5' },
    { label: t('totalInquiries'), value: stats.total_messages, icon: Inbox, color: '#7C3AED' },
    { label: t('unreadInquiries'), value: stats.unread_messages, icon: AlertCircle, color: '#FF2E93' },
  ];

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="stat-card hover-lift border border-glass-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] tracking-widest uppercase font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {card.label}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-glass-border"
                  style={{ background: `${card.color}15`, color: card.color }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-4xl font-black text-white">{card.value}</span>
                {card.label !== t('unreadInquiries') ? (
                  <span className="text-[9px] text-green-400 font-mono flex items-center gap-0.5">
                    <TrendingUp size={10} /> +12%
                  </span>
                ) : card.value > 0 ? (
                  <span className="text-[9px] text-red-400 font-mono animate-pulse">
                    {t('requiresAction')}
                  </span>
                ) : (
                  <span className="text-[9px] text-gray-400 font-mono">
                    {t('allRead')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main analytic charts */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Visitors Chart */}
        <div className="glass-card p-5 lg:col-span-2 border border-glass-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-white text-lg tracking-wide">{t('trafficOverview')}</h3>
              <p className="text-xs text-gray-400">
                {t('weeklyVisitorMetrics')}
              </p>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-primary flex items-center gap-1">
              {t('activeServer')} <ArrowUpRight size={12} />
            </span>
          </div>

          <div className="h-72 w-full font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitors} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                <ChartTooltip
                  contentStyle={{
                    background: 'rgba(11, 18, 36, 0.95)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                    fontFamily: 'monospace'
                  }}
                />
                <Area type="monotone" dataKey="visits" stroke="#00E5FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="glass-card p-5 border border-glass-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-white text-lg tracking-wide">{t('deviceInsights')}</h3>
              <p className="text-xs text-gray-400">
                {t('userPlatforms')}
              </p>
            </div>
            <Monitor size={16} className="text-primary" />
          </div>

          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={devices} cx="50%" cy="50%" innerRadius={60} outerRadius={75} paddingAngle={4} dataKey="value">
                  {devices.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip
                  contentStyle={{
                    background: 'rgba(11, 18, 36, 0.95)',
                    border: '1px solid rgba(38, 239, 253, 0.3)',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                    fontFamily: 'monospace'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Middle label */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">{t('platform')}</span>
              <span className="text-sm font-black text-white">{t('metrics')}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {devices.map((device: any) => (
              <div key={device.name} className="flex flex-col items-center">
                <span className="text-[12px] text-gray-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: device.color }} />
                  {device.name}
                </span>
                <span className="text-xs font-bold mt-0.5 font-mono">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browser analytics & Activity Logs */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Browser Stats */}
        <div className="glass-card p-5 border border-glass-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-white text-lg tracking-wide">{t('clientBrowsers')}</h3>
              <p className="text-xs text-gray-400">
                {t('appTrafficAgent')}
              </p>
            </div>
            <Globe size={16} className="text-primary" />
          </div>

          <div className="space-y-4">
            {browsers.map((browser: any) => (
              <div key={browser.name} className="space-y-1">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-300">{browser.name}</span>
                  <span className="text-primary font-mono">{browser.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface border border-glass-border overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${browser.value}%`, background: browser.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div className="glass-card p-5 lg:col-span-2 border border-glass-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-white text-lg tracking-wide">{t('operationsLog')}</h3>
              <p className="text-xs text-gray-400">
                {t('auditHistoryLog')}
              </p>
            </div>
            <Activity size={16} className="text-primary animate-pulse" />
          </div>

          <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-3 rounded-xl border border-glass-border bg-[rgba(11,18,36,0.3)] hover:bg-surface transition-colors"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-white truncate">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono whitespace-nowrap">
                      {log.created_at}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 truncate">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
