import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
  Save, User, ShieldAlert, Sparkles, HelpCircle, Activity,
  PhoneCall, Tag, Search, Plus, Trash2, Upload, FileText, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsAPI, mediaAPI } from '../../lib/api';
import { useAdminTranslation } from '../../lib/adminTranslations';
import FileDropzone from '../../components/admin/FileDropzone';
import type { SiteSettings, ClientLogo, MarqueeTag, SocialLink } from '../../types';

type ActiveTab = 'general' | 'hero' | 'marquees' | 'about' | 'contact' | 'seo' | 'database';
const DEFAULT_AVATAR = '/me2.png';

export const SOCIAL_PLATFORMS = [
  'facebook', 'instagram', 'tiktok', 'behance', 'dribbble', 'linkedin',
  'x', 'youtube', 'whatsapp', 'pinterest', 'github', 'telegram', 'other',
];

const SOCIAL_PLATFORM_LABELS: Record<string, string> = {
  facebook: 'فيسبوك', instagram: 'انستجرام', tiktok: 'تيك توك', behance: 'بيهانس',
  dribbble: 'دريببل', linkedin: 'لينكد إن', x: 'X (تويتر)', youtube: 'يوتيوب',
  whatsapp: 'واتساب', pinterest: 'بينترست', github: 'جيت هب', telegram: 'تيليجرام',
  other: 'أخرى (مخصص)',
};

export default function SettingsPage() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>('general');

  // Interactive Lists State
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [marqueeRow1, setMarqueeRow1] = useState<MarqueeTag[]>([]);
  const [marqueeRow2, setMarqueeRow2] = useState<MarqueeTag[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialPlatform, setNewSocialPlatform] = useState('behance');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  // Add Item Temp States
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const [newTagText1, setNewTagText1] = useState('');
  const [newTagVariant1, setNewTagVariant1] = useState<'solid' | 'glass'>('solid');

  const [newTagText2, setNewTagText2] = useState('');
  const [newTagVariant2, setNewTagVariant2] = useState<'solid' | 'glass'>('solid');

  const [dbPassword, setDbPassword] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get().then((r) => r.data as SiteSettings),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => settingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['client-logos'] });
      toast.success('Settings saved successfully');
    },
    onError: () => toast.error('Failed to save settings'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (settings) {
      reset({
        name: settings.name,
        title: settings.title,
        subtitle: settings.subtitle,
        bio: settings.bio,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        hero_headline: settings.hero_headline || '',
        hero_subheadline: settings.hero_subheadline || '',
        about_section_title: settings.about_section_title || '',
        about_section_heading: settings.about_section_heading || '',
        about_description: settings.about_description || '',
        about_cta_text: settings.about_cta_text || '',
        stat1_value: settings.stat1_value || '',
        stat1_label: settings.stat1_label || '',
        stat2_value: settings.stat2_value || '',
        stat2_label: settings.stat2_label || '',
        availability_status: settings.availability_status || 'available',
        availability_response_time: settings.availability_response_time || '',
      });

      setClientLogos(Array.isArray(settings.client_logos) ? settings.client_logos : []);
      setMarqueeRow1(Array.isArray(settings.marquee_row1) && settings.marquee_row1.length ? settings.marquee_row1 : (() => { try { return JSON.parse(localStorage.getItem('portfolio_marquee_row1') || '[]'); } catch { return []; } })());
      setMarqueeRow2(Array.isArray(settings.marquee_row2) && settings.marquee_row2.length ? settings.marquee_row2 : (() => { try { return JSON.parse(localStorage.getItem('portfolio_marquee_row2') || '[]'); } catch { return []; } })());
      setSocialLinks(Array.isArray(settings.social_links) && settings.social_links.length
        ? settings.social_links
        : [
            ...(settings.facebook_url ? [{ id: crypto.randomUUID(), platform: 'facebook', url: settings.facebook_url, icon: '', order: 0, enabled: true }] : []),
            ...(settings.instagram_url ? [{ id: crypto.randomUUID(), platform: 'instagram', url: settings.instagram_url, icon: '', order: 1, enabled: true }] : []),
            ...(settings.tiktok_url ? [{ id: crypto.randomUUID(), platform: 'tiktok', url: settings.tiktok_url, icon: '', order: 2, enabled: true }] : []),
          ]);
      setAvatarPreview(settings.avatar || DEFAULT_AVATAR);
      setAvatarRemoved(false);
    }
  }, [settings, reset]);

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await mediaAPI.upload(fd);
    return res.data.url;
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('bio', data.bio);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('location', data.location);
    formData.append('seo_title', data.seo_title);
    formData.append('seo_description', data.seo_description);

    formData.append('hero_headline', data.hero_headline);
    formData.append('hero_subheadline', data.hero_subheadline);
    formData.append('about_section_title', data.about_section_title);
    formData.append('about_section_heading', data.about_section_heading);
    formData.append('about_description', data.about_description);
    formData.append('about_cta_text', data.about_cta_text);
    formData.append('stat1_value', data.stat1_value);
    formData.append('stat1_label', data.stat1_label);
    formData.append('stat2_value', data.stat2_value);
    formData.append('stat2_label', data.stat2_label);
    formData.append('availability_status', data.availability_status);
    formData.append('availability_response_time', data.availability_response_time);

    // Append visual list editors states
    const mq1 = JSON.stringify(marqueeRow1);
    const mq2 = JSON.stringify(marqueeRow2);
    localStorage.setItem('portfolio_marquee_row1', mq1);
    localStorage.setItem('portfolio_marquee_row2', mq2);
    formData.append('marquee_row1', mq1);
    formData.append('marquee_row2', mq2);
    formData.append('client_logos', JSON.stringify(clientLogos));
    formData.append('social_links', JSON.stringify(socialLinks.map((link, i) => ({ ...link, order: i }))));

    if (avatarRemoved) {
      formData.append('avatar', DEFAULT_AVATAR);
    } else if (data.avatar && data.avatar[0]) {
      try {
        const file = data.avatar[0];
        const url = await uploadFile(file);
        formData.append('avatar', url);
      } catch {
        toast.error('Failed to upload avatar image.');
        return;
      }
    }
    if (data.cv && data.cv[0]) {
      try {
        const url = await uploadFile(data.cv[0]);
        formData.append('cv_url', url);
      } catch {
        toast.error('Failed to upload CV file.');
        return;
      }
    }

    updateMutation.mutate(formData);
  };

  const handleReset = () => {
    if (settings) {
      reset({
        name: settings.name,
        title: settings.title,
        subtitle: settings.subtitle,
        bio: settings.bio,
        email: settings.email,
        phone: settings.phone,
        location: settings.location,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        hero_headline: settings.hero_headline || '',
        hero_subheadline: settings.hero_subheadline || '',
        about_section_title: settings.about_section_title || '',
        about_section_heading: settings.about_section_heading || '',
        about_description: settings.about_description || '',
        about_cta_text: settings.about_cta_text || '',
        stat1_value: settings.stat1_value || '',
        stat1_label: settings.stat1_label || '',
        stat2_value: settings.stat2_value || '',
        stat2_label: settings.stat2_label || '',
        availability_status: settings.availability_status || 'available',
        availability_response_time: settings.availability_response_time || '',
      });

      setClientLogos(Array.isArray(settings.client_logos) ? settings.client_logos : []);
      const ls1 = (() => { try { return JSON.parse(localStorage.getItem('portfolio_marquee_row1') || '[]'); } catch { return []; } })();
      const ls2 = (() => { try { return JSON.parse(localStorage.getItem('portfolio_marquee_row2') || '[]'); } catch { return []; } })();
      setMarqueeRow1(Array.isArray(settings.marquee_row1) && settings.marquee_row1.length ? settings.marquee_row1 : (ls1.length ? ls1 : []));
      setMarqueeRow2(Array.isArray(settings.marquee_row2) && settings.marquee_row2.length ? settings.marquee_row2 : (ls2.length ? ls2 : []));
      setSocialLinks(Array.isArray(settings.social_links) ? settings.social_links : []);
      setAvatarPreview(settings.avatar || DEFAULT_AVATAR);
      setAvatarRemoved(false);
    }
  };

  const handleAvatarSelect = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const dt = new DataTransfer();
    dt.items.add(file);
    setValue('avatar', dt.files);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarRemoved(false);
  };

  const handleRemoveAvatar = () => {
    setValue('avatar', undefined);
    setAvatarPreview(DEFAULT_AVATAR);
    setAvatarRemoved(true);
  };

  // Add brand logo
  const handleAddLogo = async () => {
    if (!newLogoName.trim()) {
      toast.error('Please specify the logo name.');
      return;
    }
    if (!newLogoFile) {
      toast.error('Please choose a logo file.');
      return;
    }

    try {
      setIsUploadingLogo(true);
      const fd = new FormData();
      fd.append('file', newLogoFile);
      const res = await mediaAPI.upload(fd);
      const url = res.data.url;

      setClientLogos(prev => [...prev, { name: newLogoName.trim(), src: url }]);
      setNewLogoName('');
      setNewLogoFile(null);
      setLogoPreview(null);
      toast.success('Logo added successfully!');
    } catch {
      toast.error('Failed to upload logo image.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = (idx: number) => {
    setClientLogos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMigration = async () => {
    if (!dbPassword.trim()) {
      toast.error('Please enter the database password.');
      return;
    }
    try {
      setIsMigrating(true);
      const res = await fetch('/api/_migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: dbPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(t('migrationSuccess'));
        setDbPassword('');
      } else {
        toast.error(data.error || t('migrationFailed'));
      }
    } catch (err: any) {
      toast.error(err.message || t('migrationFailed'));
    } finally {
      setIsMigrating(false);
    }
  };

  // Add marquee tag row 1
  const handleAddTag1 = () => {
    if (!newTagText1.trim()) return;
    setMarqueeRow1(prev => [...prev, { text: newTagText1.trim(), variant: newTagVariant1 }]);
    setNewTagText1('');
  };

  const handleRemoveTag1 = (idx: number) => {
    setMarqueeRow1(prev => prev.filter((_, i) => i !== idx));
  };

  // Add marquee tag row 2
  const handleAddTag2 = () => {
    if (!newTagText2.trim()) return;
    setMarqueeRow2(prev => [...prev, { text: newTagText2.trim(), variant: newTagVariant2 }]);
    setNewTagText2('');
  };

  const handleRemoveTag2 = (idx: number) => {
    setMarqueeRow2(prev => prev.filter((_, i) => i !== idx));
  };

  // Social links
  const handleAddSocialLink = () => {
    const url = newSocialUrl.trim();
    if (!url) {
      toast.error('يرجى إدخال رابط المنصة أولاً');
      return;
    }
    setSocialLinks(prev => [...prev, {
      id: crypto.randomUUID(),
      platform: newSocialPlatform,
      url,
      icon: '',
      order: prev.length,
      enabled: true,
    }]);
    setNewSocialUrl('');
  };

  const handleUpdateSocialLink = (id: string, patch: Partial<SocialLink>) => {
    setSocialLinks(prev => prev.map(link => (link.id === id ? { ...link, ...patch } : link)));
  };

  const handleRemoveSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  // Tab configurations
  const tabs = [
    { id: 'general', label: t('generalBio'), icon: User },
    { id: 'hero', label: t('heroLogos'), icon: Sparkles },
    { id: 'marquees', label: t('tagsMarquees'), icon: Tag },
    { id: 'about', label: t('aboutStats'), icon: HelpCircle },
    { id: 'contact', label: t('contactDetails'), icon: PhoneCall },
    { id: 'seo', label: t('seoConfig'), icon: Search },
    { id: 'database', label: t('databaseConfig'), icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-wide">{t('systemSettings')}</h1>
        <p className="text-xs text-gray-400">{t('systemSettingsDesc')}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Sidebar Nav */}
          <div className="glass-card p-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible no-scrollbar">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-black font-bold shadow-neon-sm border-2 border-black'
                      : 'text-gray-400 border-2 border-transparent hover:text-white hover:bg-surface'
                  }`}
                >
                  <TabIcon size={14} className="flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-6">
            
            {/* Tab: General */}
            {activeTab === 'general' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <User size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('personalBioInfo')}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('developerName')}</label>
                    <input {...register('name')} className="input-field text-sm" placeholder="e.g. معتز جمعة" required />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('jobTitle')}</label>
                    <input {...register('title')} className="input-field text-sm" placeholder="e.g. جرافيك ديزاينر" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('shortProfileBio')}</label>
                  <textarea {...register('bio')} rows={3} className="input-field text-sm" placeholder="Enter bio text..." required />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('avatarProfile')}</label>
                    <FileDropzone
                      onFilesSelect={handleAvatarSelect}
                      accept="image/*"
                      className="py-4"
                      label={t('avatarProfile')}
                      hint="JPG, PNG, WEBP"
                    >
                      <div className="flex items-center gap-3 w-full">
                        {avatarPreview && (
                          <img src={avatarPreview} className="w-10 h-10 object-cover rounded-xl border border-glass-border bg-surface" alt="Avatar" />
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-xs font-bold text-white">{t('avatarProfile')}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">اسحب وأفلت أو اضغط للاختيار - يتم رفع الصورة بدون ضغط</p>
                        </div>
                      </div>
                    </FileDropzone>
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-[11px] font-bold text-red-300 transition hover:bg-red-500/10"
                    >
                      <X size={12} />
                      إزالة الصورة والرجوع للأصلية
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('cvPdf')}</label>
                    <FileDropzone
                      onFilesSelect={(files) => {
                        const dt = new DataTransfer();
                        dt.items.add(files[0]);
                        setValue('cv', dt.files);
                      }}
                      accept=".pdf,application/pdf"
                      className="py-4"
                      label={t('cvPdf')}
                      hint="PDF"
                    >
                      <div className="flex items-center gap-3 w-full">
                        {settings?.cv_url && (
                          <a href={settings.cv_url} target="_blank" rel="noreferrer" className="p-2 border border-glass-border bg-surface hover:text-primary rounded-xl text-xs flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <FileText size={12} /> {t('viewCv')}
                          </a>
                        )}
                        <div className="flex-1 text-left">
                          <p className="text-xs font-bold text-white">{t('cvPdf')}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">اسحب وأفلت ملف PDF أو اضغط للاختيار</p>
                        </div>
                      </div>
                    </FileDropzone>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Hero */}
            {activeTab === 'hero' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <Sparkles size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('heroLogos')}</h3>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('heroHeadline')}</label>
                  <textarea {...register('hero_headline')} rows={2} className="input-field text-sm" placeholder="Headline text..." />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('heroSubtitle')}</label>
                  <input {...register('hero_subheadline')} className="input-field text-sm" placeholder="e.g. موثوق من قبل" />
                </div>

                {/* Brand Logos Editor */}
                <div className="space-y-3 pt-3 border-t border-glass-border">
                  <label className="block text-xs font-mono text-gray-400">{t('clientBrandLogos')}</label>
                  
                  {/* Logos List Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#082127] p-3 rounded-2xl border border-glass-border max-h-48 overflow-y-auto">
                    {clientLogos.length === 0 ? (
                      <div className="col-span-full py-4 text-center text-xs text-gray-500">{t('noLogosAdded')}</div>
                    ) : (
                      clientLogos.map((logo, idx) => (
                        <div key={idx} className="relative group p-2 border border-glass-border bg-surface rounded-xl flex items-center gap-2 overflow-hidden">
                          <img src={logo.src} className="w-8 h-8 object-contain rounded-md" alt={logo.name} />
                          <div className="flex-1 min-w-0">
                             <p className="text-[10px] font-bold text-white truncate">{logo.name}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveLogo(idx)}
                            className="absolute right-1 top-1 p-1 bg-red-950/60 text-red-400 hover:text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Brand Form */}
                  <div className="grid sm:grid-cols-3 gap-3 p-3 bg-surface/5 border border-glass-border/60 rounded-2xl items-end">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">{t('brandName')}</label>
                      <input
                        type="text"
                        value={newLogoName}
                        onChange={(e) => setNewLogoName(e.target.value)}
                        className="input-field text-xs bg-[#082127]"
                        placeholder="e.g. Egyfield"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">{t('uploadBrandLogo')}</label>
                      <FileDropzone
                        onFilesSelect={(files) => {
                          const file = files[0];
                          if (file) {
                            setNewLogoFile(file);
                            setLogoPreview(URL.createObjectURL(file));
                          }
                        }}
                        accept="image/*"
                        className="py-3"
                        label={logoPreview ? 'اللوجو المحدد ✓' : t('uploadBrandLogo')}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLogo}
                      disabled={isUploadingLogo}
                      className="neon-btn py-2 text-xs font-black flex items-center justify-center gap-1.5 h-10 w-full disabled:opacity-50"
                    >
                      {isUploadingLogo ? (
                        t('uploading')
                      ) : (
                        <>
                          <Plus size={12} /> {t('addBrand')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Marquees */}
            {activeTab === 'marquees' && (
              <div className="glass-card p-6 space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <Tag size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('tagsMarquees')}</h3>
                </div>

                {/* Marquee Row 1 */}
                <div className="space-y-3">
                  <label className="block text-xs font-mono text-gray-300">{t('marqueeRow1Tags')}</label>
                  
                  {/* Current Tags */}
                  <div className="flex flex-wrap gap-2 p-3 bg-[#082127] border border-glass-border rounded-2xl min-h-12 items-center">
                    {marqueeRow1.length === 0 ? (
                      <span className="text-xs text-gray-500">{t('noTagsRow1')}</span>
                    ) : (
                      marqueeRow1.map((tag, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            tag.variant === 'glass'
                              ? 'bg-white/5 border-white/20 text-white backdrop-blur-sm'
                              : 'bg-primary border-black text-black shadow-[2px_2px_0px_#000000]'
                          }`}
                        >
                          {tag.text}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag1(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Tag Row 1 */}
                  <div className="flex items-center gap-3 max-w-md">
                    <input
                      type="text"
                      value={newTagText1}
                      onChange={(e) => setNewTagText1(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag1(); } }}
                      placeholder={t('typeTagText')}
                      className="input-field text-xs bg-[#082127] flex-1"
                    />
                    <select
                      value={newTagVariant1}
                      onChange={(e) => setNewTagVariant1(e.target.value as 'solid' | 'glass')}
                      className="input-field text-xs bg-[#082127] w-24 cursor-pointer"
                    >
                      <option value="solid">{t('solid')}</option>
                      <option value="glass">{t('glass')}</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddTag1}
                      className="p-2.5 bg-primary text-black border border-black hover:scale-105 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Marquee Row 2 */}
                <div className="space-y-3 pt-4 border-t border-glass-border">
                  <label className="block text-xs font-mono text-gray-300">{t('marqueeRow2Tags')}</label>
                  
                  {/* Current Tags */}
                  <div className="flex flex-wrap gap-2 p-3 bg-[#082127] border border-glass-border rounded-2xl min-h-12 items-center">
                    {marqueeRow2.length === 0 ? (
                      <span className="text-xs text-gray-500">{t('noTagsRow2')}</span>
                    ) : (
                      marqueeRow2.map((tag, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                            tag.variant === 'glass'
                              ? 'bg-white/5 border-white/20 text-white backdrop-blur-sm'
                              : 'bg-primary border-black text-black shadow-[2px_2px_0px_#000000]'
                          }`}
                        >
                          {tag.text}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag2(idx)}
                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Tag Row 2 */}
                  <div className="flex items-center gap-3 max-w-md">
                    <input
                      type="text"
                      value={newTagText2}
                      onChange={(e) => setNewTagText2(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag2(); } }}
                      placeholder={t('typeTagText')}
                      className="input-field text-xs bg-[#082127] flex-1"
                    />
                    <select
                      value={newTagVariant2}
                      onChange={(e) => setNewTagVariant2(e.target.value as 'solid' | 'glass')}
                      className="input-field text-xs bg-[#082127] w-24 cursor-pointer"
                    >
                      <option value="solid">{t('solid')}</option>
                      <option value="glass">{t('glass')}</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddTag2}
                      className="p-2.5 bg-primary text-black border border-black hover:scale-105 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: About */}
            {activeTab === 'about' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <HelpCircle size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('aboutStats')}</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('aboutSectionTitle')}</label>
                    <input {...register('about_section_title')} className="input-field text-sm" placeholder="e.g. نبذة عني" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('aboutSectionHeading')}</label>
                    <input {...register('about_section_heading')} className="input-field text-sm" placeholder="e.g. نحول الأفكار إلى تصاميم مؤثرة" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('aboutMainDesc')}</label>
                  <textarea {...register('about_description')} rows={3} className="input-field text-sm" placeholder="Description..." />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('ctaButtonText')}</label>
                    <input {...register('about_cta_text')} className="input-field text-sm" placeholder="e.g. لنعمل معاً الآن" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-glass-border pt-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('stat1Value')}</label>
                    <input {...register('stat1_value')} className="input-field text-sm" placeholder="e.g. +4" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('stat1Label')}</label>
                    <input {...register('stat1_label')} className="input-field text-sm" placeholder="e.g. شركات" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('stat2Value')}</label>
                    <input {...register('stat2_value')} className="input-field text-sm" placeholder="e.g. +75" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('stat2Label')}</label>
                    <input {...register('stat2_label')} className="input-field text-sm" placeholder="e.g. تصميم" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Contact */}
            {activeTab === 'contact' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <PhoneCall size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('contactDetails')}</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('contactEmail')}</label>
                    <input type="email" {...register('email')} className="input-field text-sm" placeholder="e.g. hello@portfolio.dev" required />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('contactPhone')}</label>
                    <input {...register('phone')} className="input-field text-sm" placeholder="e.g. +1..." />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('locationText')}</label>
                    <input {...register('location')} className="input-field text-sm" placeholder="e.g. البحيرة، مصر" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 border-t border-glass-border pt-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('availabilityStatus')}</label>
                    <select {...register('availability_status')} className="input-field text-sm bg-[#082127] w-full">
                      <option value="available">{t('availableForWork')}</option>
                      <option value="busy">{t('busyHighLoad')}</option>
                      <option value="unavailable">{t('notAvailable')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('availabilityResponseTime')}</label>
                    <input {...register('availability_response_time')} className="input-field text-sm" placeholder="e.g. < 24 hours" />
                  </div>
                </div>

                {/* Social Links Manager */}
                <div className="border-t border-glass-border pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-mono text-gray-400">روابط السوشيال ميديا</label>
                    <span className="text-[10px] text-gray-500">تظهر في الفوتر — كل رابط اختياري (اظهر/اخفي)</span>
                  </div>

                  {socialLinks.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {socialLinks.map((link) => (
                        <div key={link.id} className="flex items-center gap-2 p-2 rounded-xl border border-glass-border bg-[#082127]">
                          <select
                            value={link.platform}
                            onChange={(e) => handleUpdateSocialLink(link.id, { platform: e.target.value })}
                            className="input-field py-1.5 px-2 text-xs bg-[#082127] w-32 flex-shrink-0 cursor-pointer"
                          >
                            {SOCIAL_PLATFORMS.map((p) => (
                              <option key={p} value={p} className="bg-[#090d1f] text-white">{SOCIAL_PLATFORM_LABELS[p]}</option>
                            ))}
                          </select>
                          <input
                            value={link.url}
                            onChange={(e) => handleUpdateSocialLink(link.id, { url: e.target.value })}
                            placeholder="https://..."
                            dir="ltr"
                            className="input-field py-1.5 px-2 text-xs bg-[#082127] flex-1 min-w-0 text-left"
                          />
                          <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-300 cursor-pointer select-none flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={link.enabled !== false}
                              onChange={(e) => handleUpdateSocialLink(link.id, { enabled: e.target.checked })}
                              className="w-3.5 h-3.5 rounded border-white/20 accent-[#26EFFD] cursor-pointer"
                            />
                            اظهار
                          </label>
                          <button
                            type="button"
                            onClick={() => handleRemoveSocialLink(link.id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                            title="حذف الرابط"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <select
                      value={newSocialPlatform}
                      onChange={(e) => setNewSocialPlatform(e.target.value)}
                      className="input-field py-2 px-2 text-xs bg-[#082127] w-32 flex-shrink-0 cursor-pointer"
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p} value={p} className="bg-[#090d1f] text-white">{SOCIAL_PLATFORM_LABELS[p]}</option>
                      ))}
                    </select>
                    <input
                      value={newSocialUrl}
                      onChange={(e) => setNewSocialUrl(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSocialLink(); } }}
                      placeholder="https://behance.net/yourname"
                      dir="ltr"
                      className="input-field py-2 px-2 text-xs bg-[#082127] flex-1 min-w-0 text-left"
                    />
                    <button
                      type="button"
                      onClick={handleAddSocialLink}
                      className="neon-btn px-4 py-2 text-xs font-black flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                    >
                      <Plus size={14} /> إضافة
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                    كل رابط تختار إظهاره يظهر في فوتر الموقع. أوقف "اظهار" أو احذف الرابط لإخفائه.
                  </p>
                </div>
              </div>
            )}

            {/* Tab: SEO */}
            {activeTab === 'seo' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <Search size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('seoConfig')}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('metaTitle')}</label>
                    <input {...register('seo_title')} className="input-field text-sm" placeholder="SEO Title Tag..." />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('metaDescription')}</label>
                    <textarea {...register('seo_description')} rows={3} className="input-field text-sm" placeholder="SEO Meta Description tag..." />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Database */}
            {activeTab === 'database' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <ShieldAlert size={16} className="text-primary" />
                  <h3 className="font-bold text-white text-sm">{t('dbMigration')}</h3>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {t('dbMigrationDesc')}
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('dbPassword')}</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={dbPassword}
                        onChange={(e) => setDbPassword(e.target.value)}
                        className="input-field text-sm flex-1"
                        placeholder={t('dbPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={handleMigration}
                        disabled={isMigrating || !dbPassword}
                        className="neon-btn px-4 py-2 text-xs font-black disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isMigrating ? (
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          t('runMigration')
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-glass-border pt-4 mt-6">
                    <h4 className="text-xs font-bold text-white mb-2">{t('manualMigration')}</h4>
                    <p className="text-[11px] text-gray-400 mb-3">{t('manualMigrationDesc')}</p>
                    <pre className="p-3 bg-black/60 rounded-xl border border-glass-border font-mono text-[10px] text-primary overflow-x-auto whitespace-pre-wrap select-all">
                      {`ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'graphic';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons Row */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-glass-border rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                {t('resetFields')}
              </button>
              <button
                type="submit"
                className="neon-btn px-6 py-2.5 text-xs font-black flex items-center gap-1.5"
              >
                <Save size={14} /> {t('commitSettings')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
