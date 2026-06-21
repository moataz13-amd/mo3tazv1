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
import type { SiteSettings, ClientLogo, MarqueeTag } from '../../types';

type ActiveTab = 'general' | 'hero' | 'marquees' | 'about' | 'contact' | 'seo';

export default function SettingsPage() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ActiveTab>('general');

  // Interactive Lists State
  const [clientLogos, setClientLogos] = useState<ClientLogo[]>([]);
  const [marqueeRow1, setMarqueeRow1] = useState<MarqueeTag[]>([]);
  const [marqueeRow2, setMarqueeRow2] = useState<MarqueeTag[]>([]);

  // Add Item Temp States
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const [newTagText1, setNewTagText1] = useState('');
  const [newTagVariant1, setNewTagVariant1] = useState<'solid' | 'glass'>('solid');

  const [newTagText2, setNewTagText2] = useState('');
  const [newTagVariant2, setNewTagVariant2] = useState<'solid' | 'glass'>('solid');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsAPI.get().then((r) => r.data as SiteSettings),
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => settingsAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings updated successfully');
    },
    onError: () => toast.error('Failed to update settings'),
  });

  const { register, handleSubmit, reset } = useForm();

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

      setClientLogos(settings.client_logos || []);
      setMarqueeRow1(settings.marquee_row1 || []);
      setMarqueeRow2(settings.marquee_row2 || []);
    }
  }, [settings, reset]);

  const onSubmit = (data: any) => {
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
    formData.append('client_logos', JSON.stringify(clientLogos));
    formData.append('marquee_row1', JSON.stringify(marqueeRow1));
    formData.append('marquee_row2', JSON.stringify(marqueeRow2));

    if (data.avatar && data.avatar[0]) {
      formData.append('avatar', data.avatar[0]);
    }
    if (data.cv && data.cv[0]) {
      formData.append('cv', data.cv[0]);
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

      setClientLogos(settings.client_logos || []);
      setMarqueeRow1(settings.marquee_row1 || []);
      setMarqueeRow2(settings.marquee_row2 || []);
    }
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

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = (idx: number) => {
    setClientLogos(prev => prev.filter((_, i) => i !== idx));
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

  // Tab configurations
  const tabs = [
    { id: 'general', label: t('generalBio'), icon: User },
    { id: 'hero', label: t('heroLogos'), icon: Sparkles },
    { id: 'marquees', label: t('tagsMarquees'), icon: Tag },
    { id: 'about', label: t('aboutStats'), icon: HelpCircle },
    { id: 'contact', label: t('contactDetails'), icon: PhoneCall },
    { id: 'seo', label: t('seoConfig'), icon: Search },
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
                    <div className="flex items-center gap-3">
                      {settings?.avatar && (
                        <img src={settings.avatar} className="w-10 h-10 object-cover rounded-xl border border-glass-border bg-surface" alt="Avatar" />
                      )}
                      <input type="file" {...register('avatar')} className="text-xs text-gray-400 bg-surface border border-glass-border p-2 rounded-xl w-full" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('cvPdf')}</label>
                    <div className="flex items-center gap-3">
                      {settings?.cv_url && (
                        <a href={settings.cv_url} target="_blank" rel="noreferrer" className="p-2 border border-glass-border bg-surface hover:text-primary rounded-xl text-xs flex items-center gap-1.5">
                          <FileText size={12} /> {t('viewCv')}
                        </a>
                      )}
                      <input type="file" {...register('cv')} className="text-xs text-gray-400 bg-surface border border-glass-border p-2 rounded-xl w-full" />
                    </div>
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#050816] p-3 rounded-2xl border border-glass-border max-h-48 overflow-y-auto">
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
                        className="input-field text-xs bg-[#050816]"
                        placeholder="e.g. Egyfield"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-400 mb-1">{t('uploadBrandLogo')}</label>
                      <input
                        type="file"
                        onChange={handleLogoFileChange}
                        accept="image/*"
                        className="text-[10px] text-gray-400 bg-[#050816] border border-glass-border p-1 rounded-xl w-full"
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
                  <div className="flex flex-wrap gap-2 p-3 bg-[#050816] border border-glass-border rounded-2xl min-h-12 items-center">
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
                      placeholder={t('typeTagText')}
                      className="input-field text-xs bg-[#050816] flex-1"
                    />
                    <select
                      value={newTagVariant1}
                      onChange={(e) => setNewTagVariant1(e.target.value as 'solid' | 'glass')}
                      className="input-field text-xs bg-[#050816] w-24 cursor-pointer"
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
                  <div className="flex flex-wrap gap-2 p-3 bg-[#050816] border border-glass-border rounded-2xl min-h-12 items-center">
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
                      placeholder={t('typeTagText')}
                      className="input-field text-xs bg-[#050816] flex-1"
                    />
                    <select
                      value={newTagVariant2}
                      onChange={(e) => setNewTagVariant2(e.target.value as 'solid' | 'glass')}
                      className="input-field text-xs bg-[#050816] w-24 cursor-pointer"
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
                    <select {...register('availability_status')} className="input-field text-sm bg-[#050816] w-full">
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
              </div>
            )}

            {/* Tab: SEO */}
            {activeTab === 'seo' && (
              <div className="glass-card p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 pb-2 border-b border-glass-border">
                  <ShieldAlert size={16} className="text-primary" />
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
