import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock3,
  Eye,
  FolderKanban,
  Globe,
  Inbox,
  Laptop,
  MailOpen,
  Monitor,
  MousePointer2,
  PieChart as PieChartIcon,
  RadioTower,
  Settings2,
  Smartphone,
  Sparkles,
  Tablet,
  TrendingUp,
  Users
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis
} from 'recharts';
import { analyticsAPI } from '../../lib/api';
import type { ActivityLog, DashboardStats } from '../../types';
import { useAdminTranslation } from '../../lib/adminTranslations';

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
  { name: 'Desktop', value: 65, color: '#1f6fb2' },
  { name: 'Mobile', value: 30, color: '#22d3d6' },
  { name: 'Tablet', value: 5, color: '#f59e0b' },
];

const defaultBrowserData = [
  { name: 'Google Chrome', value: 58, color: '#1f6fb2' },
  { name: 'Apple Safari', value: 22, color: '#22d3d6' },
  { name: 'Mozilla Firefox', value: 12, color: '#8b5cf6' },
  { name: 'Microsoft Edge', value: 8, color: '#f59e0b' },
];

const defaultLogs: ActivityLog[] = [
  { id: '1', action: 'Project Created', description: 'Added new project NeoBank Dashboard', created_at: '2 hours ago' },
  { id: '2', action: 'System Config', description: 'Updated SEO meta tags in settings', created_at: '5 hours ago' },
  { id: '3', action: 'Inquiry Received', description: 'New message received from Sarah Mitchell', created_at: '1 day ago' },
  { id: '4', action: 'Skills Updated', description: 'Modified React & Next.js level status', created_at: '2 days ago' },
];

const palette = ['#1f6fb2', '#22d3d6', '#17213c', '#8b5cf6', '#f59e0b', '#ef476f'];

const formatCompact = (value: number) =>
  new Intl.NumberFormat('en', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

const clampPercent = (value: number) => Math.max(4, Math.min(100, Math.round(value)));

export default function Dashboard() {
  const { adminLanguage } = useAdminTranslation();
  const isArabic = adminLanguage === 'ar';

  const copy = useMemo(() => ({
    title: isArabic ? 'لوحة التحكم' : 'Dashboard',
    subtitle: isArabic ? 'ملخص سريع لأداء الموقع والطلبات والمحتوى' : 'A quick view of traffic, inquiries, and content health',
    live: isArabic ? 'النظام يعمل' : 'Live system',
    overview: isArabic ? 'نظرة عامة' : 'Overview',
    analytics: isArabic ? 'التحليلات' : 'Analytics',
    content: isArabic ? 'المحتوى' : 'Content',
    visitors: isArabic ? 'الزوار' : 'Visitors',
    projects: isArabic ? 'المشاريع' : 'Projects',
    inquiries: isArabic ? 'الرسائل' : 'Messages',
    unread: isArabic ? 'غير مقروء' : 'Unread',
    weeklyTraffic: isArabic ? 'حركة الزوار الأسبوعية' : 'Weekly Traffic',
    bestDays: isArabic ? 'أعلى أيام النشاط' : 'Best activity days',
    channels: isArabic ? 'الأجهزة' : 'Devices',
    structure: isArabic ? 'هيكل الأداء' : 'Performance Structure',
    budget: isArabic ? 'توزيع المحتوى' : 'Content Mix',
    browserUsage: isArabic ? 'المتصفحات' : 'Browsers',
    activityLog: isArabic ? 'آخر العمليات' : 'Recent Activity',
    compareTraffic: isArabic ? 'مقارنة النشاط' : 'Traffic Compare',
    annualPlan: isArabic ? 'خطة النمو' : 'Growth Plan',
    needsAction: isArabic ? 'يحتاج متابعة' : 'Needs action',
    allClear: isArabic ? 'كل الرسائل مقروءة' : 'All clear',
    portfolioPulse: isArabic ? 'نبض البورتفوليو' : 'Portfolio Pulse',
    engagement: isArabic ? 'التفاعل' : 'Engagement',
    stability: isArabic ? 'الثبات' : 'Stability',
    reach: isArabic ? 'الوصول' : 'Reach',
    conversion: isArabic ? 'التحويل' : 'Conversion',
    freshness: isArabic ? 'تجدد المحتوى' : 'Freshness',
    total: isArabic ? 'الإجمالي' : 'Total',
    desktop: isArabic ? 'كمبيوتر' : 'Desktop',
    mobile: isArabic ? 'موبايل' : 'Mobile',
    tablet: isArabic ? 'تابلت' : 'Tablet',
    mon: isArabic ? 'الإثنين' : 'Mon',
    tue: isArabic ? 'الثلاثاء' : 'Tue',
    wed: isArabic ? 'الأربعاء' : 'Wed',
    thu: isArabic ? 'الخميس' : 'Thu',
    fri: isArabic ? 'الجمعة' : 'Fri',
    sat: isArabic ? 'السبت' : 'Sat',
    sun: isArabic ? 'الأحد' : 'Sun',
  }), [isArabic]);

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
  const browsersRaw = browserChart || defaultBrowserData;
  const logsRaw = logsData || defaultLogs;

  const visitors = useMemo(
    () =>
      visitorsDataRaw.map((item: any, index: number) => {
        const key = String(item.name || '').toLowerCase().slice(0, 3) as keyof typeof copy;
        return {
          ...item,
          label: copy[key] || item.name || `D${index + 1}`,
          visits: Number(item.visits || item.value || 0),
          goal: Math.round(Number(item.visits || item.value || 0) * 1.18),
        };
      }),
    [visitorsDataRaw, copy]
  );

  const devices = useMemo(
    () =>
      devicesDataRaw.map((item: any, index: number) => {
        const key = String(item.name || '').toLowerCase() as keyof typeof copy;
        return {
          ...item,
          name: copy[key] || item.name,
          value: Number(item.value || 0),
          color: item.color || palette[index % palette.length],
        };
      }),
    [devicesDataRaw, copy]
  );

  const browsers = useMemo(
    () =>
      browsersRaw.map((item: any, index: number) => ({
        ...item,
        value: Number(item.value || 0),
        color: item.color || palette[index % palette.length],
      })),
    [browsersRaw]
  );

  const totalVisits = visitors.reduce((sum: number, item: any) => sum + item.visits, 0);
  const topVisitorDay = visitors.reduce((top: any, item: any) => (item.visits > top.visits ? item : top), visitors[0] || { label: '-', visits: 0 });
  const readMessages = Math.max(stats.total_messages - stats.unread_messages, 0);
  const readRate = stats.total_messages ? clampPercent((readMessages / stats.total_messages) * 100) : 100;
  const postShare = clampPercent((stats.total_posts / Math.max(stats.total_projects + stats.total_posts, 1)) * 100);
  const inquiryShare = clampPercent((stats.total_messages / Math.max(stats.total_messages + stats.total_projects + stats.total_posts, 1)) * 100);
  const maxVisitors = Math.max(...visitors.map((item: any) => item.visits), 1);

  const radarData = [
    { subject: copy.reach, value: clampPercent((stats.total_visitors / Math.max(stats.total_visitors + 500, 1)) * 100) },
    { subject: copy.engagement, value: clampPercent((stats.total_messages / Math.max(stats.total_visitors || 1, 1)) * 260) },
    { subject: copy.conversion, value: inquiryShare },
    { subject: copy.freshness, value: postShare },
    { subject: copy.stability, value: readRate },
  ];

  const contentMix = [
    { name: copy.projects, value: Math.max(stats.total_projects, 1), color: '#1f6fb2' },
    { name: copy.inquiries, value: Math.max(stats.total_messages, 1), color: '#22d3d6' },
    { name: copy.content, value: Math.max(stats.total_posts, 1), color: '#8b5cf6' },
  ];

  const kpiCards = [
    { label: copy.visitors, value: stats.total_visitors, icon: Users, accent: '#1f6fb2', trend: '+12%' },
    { label: copy.projects, value: stats.total_projects, icon: Briefcase, accent: '#22d3d6', trend: '+4%' },
    { label: copy.inquiries, value: stats.total_messages, icon: Inbox, accent: '#8b5cf6', trend: '+8%' },
    { label: copy.unread, value: stats.unread_messages, icon: AlertCircle, accent: '#ef476f', trend: stats.unread_messages > 0 ? copy.needsAction : copy.allClear },
  ];

  const progressRows = [
    { label: copy.projects, value: stats.total_projects, target: Math.max(stats.total_projects + 4, 12), color: '#1f6fb2', icon: FolderKanban },
    { label: copy.inquiries, value: readMessages, target: Math.max(stats.total_messages, 1), color: '#22d3d6', icon: MailOpen },
    { label: copy.content, value: stats.total_posts, target: Math.max(stats.total_posts + 6, 18), color: '#8b5cf6', icon: Sparkles },
  ];

  const getDeviceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('mobile') || lower.includes('موبايل')) return Smartphone;
    if (lower.includes('tablet') || lower.includes('تابلت')) return Tablet;
    return Laptop;
  };

  const getLocalizedAction = (action: string) => {
    if (!isArabic) return action;
    const lower = action.toLowerCase();
    if (lower.includes('project created')) return 'تم إنشاء مشروع جديد';
    if (lower.includes('system config')) return 'تعديل إعدادات النظام';
    if (lower.includes('inquiry received')) return 'تم استقبال رسالة جديدة';
    if (lower.includes('skills updated')) return 'تحديث المهارات';
    return action;
  };

  const getLocalizedTime = (time: string) => {
    if (!isArabic) return time;
    return time
      .replace('hours ago', 'ساعات مضت')
      .replace('hour ago', 'ساعة مضت')
      .replace('days ago', 'أيام مضت')
      .replace('day ago', 'يوم مضى')
      .replace('some time ago', 'منذ قليل');
  };

  const logs = logsRaw.map((log) => ({
    ...log,
    action: getLocalizedAction(log.action),
    created_at: getLocalizedTime(log.created_at),
  }));

  return (
    <div className="admin-dashboard-frame rounded-[30px] border border-[#c9d6e7]/70 bg-[#dce7f4] p-3 text-[#17213c] shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:p-5">
      <div className="overflow-hidden rounded-[26px] border border-white/70 bg-[#c7d6e8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="flex flex-col gap-4 bg-[#17213c] px-4 py-4 text-white md:flex-row md:items-center md:justify-between md:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#22d3d6] text-[#17213c] shadow-[0_10px_24px_rgba(34,211,214,0.3)]">
              <BarChart3 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black leading-tight tracking-wide md:text-2xl">{copy.title}</h1>
              <p className="text-xs text-[#aab8d1] md:text-sm">{copy.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[copy.overview, copy.analytics, copy.content].map((item, index) => (
              <button
                key={item}
                className={`rounded-full border px-4 py-2 text-xs font-black transition ${
                  index === 0
                    ? 'border-[#22d3d6] bg-[#22d3d6] text-[#17213c] shadow-[0_0_18px_rgba(34,211,214,0.35)]'
                    : 'border-white/15 bg-white/5 text-[#aab8d1] hover:border-[#22d3d6]/70 hover:text-white'
                }`}
                type="button"
              >
                {item}
              </button>
            ))}
            <div className="ms-1 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#aab8d1]">
              <RadioTower size={14} className="text-[#22d3d6]" />
              {copy.live}
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-12 lg:p-6">
          <section className="lg:col-span-3 space-y-4">
            <div className="rounded-[20px] bg-[#0f4d7a] p-5 text-white shadow-[0_18px_36px_rgba(15,77,122,0.24)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#b9d1e7]">{copy.portfolioPulse}</p>
                  <h2 className="mt-1 text-3xl font-black">${formatCompact(totalVisits * 16)}</h2>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12">
                  <Eye size={18} />
                </div>
              </div>

              <div className="mt-6 flex items-end gap-2">
                {visitors.map((item: any) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-full bg-[#22d3d6]"
                      style={{ height: `${Math.max(20, (item.visits / maxVisitors) * 82)}px` }}
                    />
                    <span className="text-[10px] text-[#b9d1e7]">{String(item.label).slice(0, 2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[#17365c]/75 px-4 py-3">
                <div>
                  <p className="text-[11px] text-[#b9d1e7]">{copy.bestDays}</p>
                  <p className="text-sm font-black">{topVisitorDay.label}</p>
                </div>
                <div className="rounded-full bg-[#22d3d6]/15 px-3 py-1 text-xs font-black text-[#7ff7f7]">
                  +{formatCompact(topVisitorDay.visits)}
                </div>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-black">{copy.budget}</h3>
                <span className="text-sm font-black text-[#17213c]">{readRate}%</span>
              </div>

              <div className="space-y-4">
                {progressRows.map((row) => {
                  const Icon = row.icon;
                  const percent = clampPercent((row.value / row.target) * 100);
                  return (
                    <div key={row.label}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2 font-bold text-[#4a5c78]">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf4fb]">
                            <Icon size={14} style={{ color: row.color }} />
                          </span>
                          {row.label}
                        </div>
                        <span className="font-black text-[#17213c]">{percent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#e8eef6]">
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, background: row.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="space-y-4 lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {kpiCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-[18px] bg-white p-4 shadow-[0_14px_30px_rgba(60,86,120,0.13)]">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wide text-[#687895]">{card.label}</span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#edf4fb]" style={{ color: card.accent }}>
                        <Icon size={16} />
                      </span>
                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-2">
                      <span className="text-2xl font-black text-[#17213c]">{formatCompact(card.value)}</span>
                      <span
                        className="rounded-full px-2 py-1 text-[10px] font-black"
                        style={{ background: `${card.accent}18`, color: card.accent }}
                      >
                        {card.trend}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">{copy.weeklyTraffic}</h3>
                  <p className="text-xs font-semibold text-[#687895]">{copy.bestDays}: {topVisitorDay.label}</p>
                </div>
                <div className="flex rounded-full bg-[#edf4fb] p-1 text-xs font-black text-[#687895]">
                  <span className="rounded-full bg-[#1f6fb2] px-3 py-1.5 text-white">{copy.visitors}</span>
                  <span className="px-3 py-1.5">{copy.analytics}</span>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitors} margin={{ top: 12, right: 4, left: -22, bottom: 0 }}>
                    <CartesianGrid stroke="#dbe5f2" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#687895', fontSize: 11, fontWeight: 700 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8aa0bd', fontSize: 11 }} />
                    <ChartTooltip
                      cursor={{ fill: 'rgba(31,111,178,0.08)' }}
                      contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #d8e2ef',
                        borderRadius: '14px',
                        color: '#17213c',
                        boxShadow: '0 16px 30px rgba(60,86,120,0.18)'
                      }}
                    />
                    <Bar dataKey="visits" radius={[10, 10, 10, 10]} barSize={22}>
                      {visitors.map((_: any, index: number) => (
                        <Cell key={`visitor-bar-${index}`} fill={index >= 4 ? '#22d3d6' : '#17213c'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-black">{copy.budget}</h3>
                  <PieChartIcon size={18} className="text-[#1f6fb2]" />
                </div>
                <div className="grid grid-cols-[130px_1fr] items-center gap-4 max-sm:grid-cols-1">
                  <div className="relative h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={contentMix} innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value">
                          {contentMix.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-black">{formatCompact(stats.total_projects + stats.total_messages + stats.total_posts)}</span>
                      <span className="text-[10px] font-bold text-[#687895]">{copy.total}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {contentMix.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-bold text-[#4a5c78]">
                          <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                          {item.name}
                        </span>
                        <span className="font-black">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-[#17213c] p-5 text-white shadow-[0_16px_34px_rgba(23,33,60,0.22)]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-black">{copy.annualPlan}</h3>
                  <TrendingUp size={18} className="text-[#22d3d6]" />
                </div>
                <div className="flex h-32 items-end justify-around gap-4">
                  {[2025, 2026, 2027].map((year, index) => {
                    const height = [42, 78, 104][index];
                    return (
                      <div key={year} className="flex flex-col items-center gap-2">
                        <div className="flex h-28 items-end gap-1">
                          <div className="w-5 rounded-t-md bg-[#4f7dce]" style={{ height: `${height * 0.75}px` }} />
                          <div className="w-5 rounded-t-md border border-white/15 bg-white/5" style={{ height: `${height}px` }} />
                        </div>
                        <span className={`text-xs font-black ${index === 1 ? 'text-[#22d3d6]' : 'text-[#aab8d1]'}`}>{year}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 lg:col-span-3">
            <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)]">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black">{copy.structure}</h3>
                  <p className="text-xs font-semibold text-[#687895]">{copy.analytics}</p>
                </div>
                <Settings2 size={18} className="text-[#1f6fb2]" />
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="#d9e5f2" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#687895', fontSize: 10, fontWeight: 700 }} />
                    <Radar dataKey="value" stroke="#22d3d6" fill="#22d3d6" fillOpacity={0.24} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black">{copy.channels}</h3>
                  <p className="text-xs font-semibold text-[#687895]">{copy.total}: {formatCompact(totalVisits)}</p>
                </div>
                <Monitor size={18} className="text-[#1f6fb2]" />
              </div>
              <div className="relative h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={devices} cx="50%" cy="50%" innerRadius={54} outerRadius={74} paddingAngle={4} dataKey="value">
                      {devices.map((entry: any) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #d8e2ef',
                        borderRadius: '14px',
                        color: '#17213c'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black">{formatCompact(totalVisits)}</span>
                  <span className="text-[10px] font-bold text-[#687895]">{copy.total}</span>
                </div>
              </div>
              <div className="mt-3 space-y-3">
                {devices.map((device: any) => {
                  const Icon = getDeviceIcon(device.name);
                  return (
                    <div key={device.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-bold text-[#4a5c78]">
                        <Icon size={15} style={{ color: device.color }} />
                        {device.name}
                      </span>
                      <span className="font-black">{device.value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="grid gap-4 lg:col-span-12 lg:grid-cols-12">
            <div className="rounded-[20px] bg-[#0f4d7a] p-5 text-white shadow-[0_18px_36px_rgba(15,77,122,0.24)] lg:col-span-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black">{copy.compareTraffic}</h3>
                  <p className="text-xs text-[#b9d1e7]">{copy.weeklyTraffic}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-black">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#22d3d6]" />{copy.visitors}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#89b4ff]" />{copy.analytics}</span>
                </div>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitors} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="visitorArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#22d3d6" stopOpacity={0.42} />
                        <stop offset="95%" stopColor="#22d3d6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#b9d1e7', fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#b9d1e7', fontSize: 10 }} />
                    <ChartTooltip
                      contentStyle={{
                        background: '#17213c',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '14px',
                        color: '#ffffff'
                      }}
                    />
                    <Area type="monotone" dataKey="goal" stroke="#89b4ff" strokeWidth={2} fill="transparent" dot={false} />
                    <Area type="monotone" dataKey="visits" stroke="#22d3d6" strokeWidth={3} fill="url(#visitorArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)] lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-black">{copy.browserUsage}</h3>
                <Globe size={18} className="text-[#1f6fb2]" />
              </div>
              <div className="space-y-4">
                {browsers.map((browser: any) => (
                  <div key={browser.name}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-bold text-[#4a5c78]">{browser.name}</span>
                      <span className="font-black">{browser.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#e8eef6]">
                      <div className="h-full rounded-full" style={{ width: `${clampPercent(browser.value)}%`, background: browser.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_16px_34px_rgba(60,86,120,0.16)] lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-black">{copy.activityLog}</h3>
                <Activity size={18} className="text-[#1f6fb2]" />
              </div>
              <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-3 rounded-2xl bg-[#f2f6fb] p-3">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#1f6fb2]">
                      {log.action.toLowerCase().includes('inquiry') || log.action.includes('رسالة') ? <MousePointer2 size={15} /> : <CheckCircle2 size={15} />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-black">{log.action}</p>
                        <Clock3 size={12} className="shrink-0 text-[#8aa0bd]" />
                      </div>
                      <p className="mt-1 truncate text-xs font-semibold text-[#687895]">{log.description}</p>
                      <p className="mt-1 text-[10px] font-black text-[#8aa0bd]">{log.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
