import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save, Star, ExternalLink, Image as ImageIcon, UploadCloud, Layers, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectsAPI } from '../../lib/api';
import type { Project } from '../../types';
import { useAdminTranslation } from '../../lib/adminTranslations';

type FilterTab = 'all' | 'mockup' | 'featured' | 'other';

export default function ProjectsManager() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll().then((r) => r.data as Project[]),
  });

  // Filtered projects based on active tab
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];
    switch (activeTab) {
      case 'mockup':
        return projects.filter((p) => p.category === 'mockup' || p.category === 'branding');
      case 'featured':
        return projects.filter((p) => p.featured);
      case 'other':
        return projects.filter((p) => p.category !== 'mockup' && p.category !== 'branding');
      default:
        return projects;
    }
  }, [projects, activeTab]);

  // Count badges
  const mockupCount = useMemo(() => {
    if (!Array.isArray(projects)) return 0;
    return projects.filter((p) => p.category === 'mockup' || p.category === 'branding').length;
  }, [projects]);

  const featuredCount = useMemo(() => {
    if (!Array.isArray(projects)) return 0;
    return projects.filter((p) => p.featured).length;
  }, [projects]);

  const isMockupCategory = (cat: string) => cat === 'mockup' || cat === 'branding';

  const buildProjectFormData = (data: any, coverFile: File | null, existingCover: string) => {
    const fd = new FormData();
    fd.append('title', data.title || '');
    fd.append('internal_name', data.internal_name || '');
    fd.append('category', data.category || 'graphic');
    fd.append('description', data.description || '');
    fd.append('featured', String(data.featured === true || data.featured === 'true'));
    fd.append('show_details_btn', String(data.show_details_btn === true || data.show_details_btn === 'true'));
    fd.append('github_url', data.github_url || '');
    fd.append('live_url', data.live_url || '');
    fd.append('tech_stack', JSON.stringify(data.techStack || []));
    if (coverFile) {
      fd.append('cover_image', coverFile);
    } else if (existingCover) {
      fd.append('cover_image', existingCover);
    }
    data.galleryFiles?.forEach((f: File) => fd.append('gallery_images', f));
    return fd;
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const fd = buildProjectFormData(data, data.coverFile, '');
      return projectsAPI.create(fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Category created successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const fd = buildProjectFormData(data, data.coverFile, data.existingCover || '');
      fd.append('existing_images', JSON.stringify(data.images || []));
      return projectsAPI.update(id, fd);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Category updated successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Category deleted successfully');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setValue('title', project.title);
      setValue('internal_name', project.internal_name || '');
      setValue('category', project.category);
      setValue('description', project.description);
      setValue('tech_stack', (project.tech_stack || []).join(', '));
      setValue('github_url', project.github_url || '');
      setValue('live_url', project.live_url || '');
      setValue('featured', project.featured === true || (project as any).featured === 'true');
      setValue('show_details_btn', project.show_details_btn !== false && (project as any).show_details_btn !== 'false');
      setExistingGalleryImages(project.images || []);
      setCoverImagePreview(project.cover_image);
      setNewGalleryPreviews([]);
    } else {
      setEditingProject(null);
      reset({
        title: '',
        internal_name: '',
        category: activeTab === 'mockup' ? 'mockup' : 'graphic',
        description: '',
        tech_stack: '',
        github_url: '',
        live_url: '',
        featured: false,
        show_details_btn: true,
      });
      setExistingGalleryImages([]);
      setCoverImagePreview(null);
      setNewGalleryPreviews([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setExistingGalleryImages([]);
    setCoverImagePreview(null);
    setNewGalleryPreviews([]);
  };

  const removeExistingImage = (imgUrl: string) => {
    setExistingGalleryImages((prev) => prev.filter((img) => img !== imgUrl));
  };

  const onSubmit = (data: any) => {
    const coverFile = data.cover_image?.[0] || null;
    const galleryFiles = data.gallery_images?.length ? Array.from(data.gallery_images) : [];
    const techStack = data.tech_stack
      ? data.tech_stack.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];
    const payload: any = {
      title: data.title || '',
      internal_name: data.internal_name || '',
      category: data.category || 'graphic',
      description: data.description || '',
      featured: data.featured,
      github_url: data.github_url || '',
      live_url: data.live_url || '',
      techStack,
      coverFile,
      galleryFiles,
    };
    if (editingProject) {
      payload.existingCover = editingProject.cover_image;
      payload.images = existingGalleryImages;
      updateMutation.mutate({ id: editingProject.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('areYouSureDeleteCategory'))) {
      deleteMutation.mutate(id);
    }
  };

  const coverImageRegister = register('cover_image');
  const galleryImagesRegister = register('gallery_images');

  const filterTabs: { key: FilterTab; label: string; count?: number; icon: React.ReactNode; color: string }[] = [
    { key: 'all', label: 'الكل', count: Array.isArray(projects) ? projects.length : 0, icon: <Layers size={14} />, color: '#ffffff' },
    { key: 'mockup', label: 'موك آب', count: mockupCount, icon: <Monitor size={14} />, color: '#f59e0b' },
    { key: 'featured', label: 'المميزة', count: featuredCount, icon: <Star size={14} />, color: '#00E5FF' },
    { key: 'other', label: 'أخرى', icon: <ImageIcon size={14} />, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">{t('designCategories')}</h1>
          <p className="text-xs text-gray-400">{t('configureCategories')}</p>
        </div>
        <button onClick={() => openModal()} className="neon-btn px-4 py-2 text-xs font-black flex items-center gap-1.5">
          <Plus size={14} /> {t('addCategory')}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer select-none ${
              activeTab === tab.key
                ? 'border-[#26EFFD] bg-[#26EFFD]/10 text-white shadow-[0_0_12px_rgba(38,239,253,0.2)]'
                : 'border-white/10 text-gray-400 hover:border-white/25 hover:text-white'
            }`}
          >
            <span style={{ color: activeTab === tab.key ? tab.color : undefined }}>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  background: activeTab === tab.key ? `${tab.color}20` : 'rgba(255,255,255,0.08)',
                  color: activeTab === tab.key ? tab.color : '#888',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Info Banner when Mockup tab is active */}
      {activeTab === 'mockup' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
          <Monitor size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-300">سكشن تصاميم الموك آب</p>
            <p className="text-xs text-gray-400 mt-0.5">
              العناصر هنا تظهر في سكشن "تصاميم الموك آب" على الموقع العام. اختر فئة <strong className="text-amber-300">موك آب</strong> أو <strong className="text-amber-300">براندينج</strong> لأي عنصر عشان يظهر في السلايدر.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'featured' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
          <Star size={18} className="text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-cyan-300">سكشن المشاريع المميزة</p>
            <p className="text-xs text-gray-400 mt-0.5">
              العناصر المحددة كـ <strong className="text-cyan-300">مميزة (Featured)</strong> تظهر في سكشن "المشاريع المميزة" على الموقع العام.
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <ImageIcon size={24} className="text-gray-500" />
          </div>
          <p className="text-gray-400 text-sm font-bold">لا توجد عناصر في هذا التصنيف</p>
          <p className="text-gray-500 text-xs mt-1">أضف عنصر جديد أو اختر تصنيف مختلف</p>
          <button
            onClick={() => openModal()}
            className="neon-btn px-5 py-2 text-xs font-black flex items-center gap-1.5 mt-4"
          >
            <Plus size={14} /> إضافة عنصر
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card group">
              <div className="project-card-image relative">
                <img src={project.cover_image} alt={project.title} className="object-cover w-full h-48" />
                {/* Badges row */}
                <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                  {/* Mockup badge */}
                  {isMockupCategory(project.category) && (
                    <div className="h-7 px-2.5 rounded-lg bg-amber-500/25 border border-amber-500/50 flex items-center gap-1 text-amber-300 text-[10px] font-bold">
                      <Monitor size={11} />
                      <span>موك آب</span>
                    </div>
                  )}
                  {/* Featured badge */}
                  {project.featured && (
                    <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,255,0.25)] border border-primary flex items-center justify-center text-primary shadow-neon-sm">
                      <Star size={14} fill="#00E5FF" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] uppercase font-mono tracking-wider ${
                        isMockupCategory(project.category) ? 'text-amber-400' : 'text-primary'
                      }`}
                    >
                      {project.category}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <ImageIcon size={10} /> {project.images?.length || 0} {t('designsCount')}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{project.internal_name || project.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                </div>

                {/* Section indicator */}
                <div className="flex items-center gap-1.5">
                  {isMockupCategory(project.category) && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                      📺 سلايدر الموك آب
                    </span>
                  )}
                  {project.featured && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
                      ⭐ سلايدر المميزة
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-glass-border">
                  <button onClick={() => openModal(project)} className="p-2 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl max-h-[85vh] overflow-y-auto my-auto bg-[#090d1f] border border-[#26EFFD]/30 shadow-[0_0_50px_rgba(38,239,253,0.15)] rounded-3xl p-6 md:p-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#26EFFD]/10 border border-[#26EFFD]/30 flex items-center justify-center text-[#26EFFD]">
                  {editingProject ? <Edit size={18} /> : <Plus size={18} />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-wide">
                    {editingProject ? t('modifyCategorySettings') : t('createDesignCategory')}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {editingProject ? 'تعديل بيانات وإعدادات العرض' : 'إضافة تصميم أو موك آب جديد للمعرض'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Titles Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">{t('publicTitle')}</label>
                  <input
                    {...register('title')}
                    className="w-full bg-[#050816] border border-white/15 focus:border-[#26EFFD] focus:ring-1 focus:ring-[#26EFFD] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
                    placeholder="مثال: Pop Art Designs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">{t('internalName')}</label>
                  <input
                    {...register('internal_name')}
                    className="w-full bg-[#050816] border border-white/15 focus:border-[#26EFFD] focus:ring-1 focus:ring-[#26EFFD] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all"
                    placeholder="مثال: تصاميم البوب آرت - معتز"
                  />
                </div>
              </div>

              {/* Category & Featured Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">{t('groupCategory')}</label>
                  <div className="relative">
                    <select
                      {...register('category')}
                      className="w-full bg-[#050816] border border-white/15 focus:border-[#26EFFD] focus:ring-1 focus:ring-[#26EFFD] rounded-xl px-4 py-2.5 text-xs text-white cursor-pointer outline-none transition-all appearance-none"
                    >
                      <option value="graphic" className="bg-[#090d1f] text-white py-2">{t('graphicDesign')}</option>
                      <option value="branding" className="bg-[#090d1f] text-white py-2">{t('brandingStrategy')}</option>
                      <option value="mockup" className="bg-[#090d1f] text-white py-2">{t('mockupShowcase')}</option>
                      <option value="ui-ux" className="bg-[#090d1f] text-white py-2">{t('uiUxDesign')}</option>
                      <option value="web" className="bg-[#090d1f] text-white py-2">{t('webDevelopment')}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-400">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-300/80 mt-1.5 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                    💡 اختيار <span className="font-bold text-amber-300">موك آب</span> أو <span className="font-bold text-amber-300">براندينج</span> يُظهر العنصر في سلايدر الموك آب الأعلى.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">خيارات التفاعل والظهور</label>
                  
                  {/* Featured checkbox */}
                  <div className="p-2.5 rounded-xl border border-white/15 bg-[#050816] flex items-center gap-3 cursor-pointer hover:border-[#26EFFD]/40 transition-colors">
                    <input
                      type="checkbox"
                      id="featured"
                      {...register('featured')}
                      className="w-4 h-4 rounded border-white/20 bg-surface text-[#26EFFD] focus:ring-0 cursor-pointer accent-[#26EFFD]"
                    />
                    <label htmlFor="featured" className="text-xs font-bold text-gray-200 cursor-pointer select-none">
                      {t('featureThisCategory')} (سلايدر مميز)
                    </label>
                  </div>

                  {/* Show Details Button checkbox */}
                  <div className="p-2.5 rounded-xl border border-white/15 bg-[#050816] flex items-center gap-3 cursor-pointer hover:border-[#26EFFD]/40 transition-colors">
                    <input
                      type="checkbox"
                      id="show_details_btn"
                      {...register('show_details_btn')}
                      className="w-4 h-4 rounded border-white/20 bg-surface text-[#26EFFD] focus:ring-0 cursor-pointer accent-[#26EFFD]"
                    />
                    <label htmlFor="show_details_btn" className="text-xs font-bold text-gray-200 cursor-pointer select-none">
                      إظهار زر "عرض التفاصيل" في الكارد
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">{t('descriptionAr')}</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  className="w-full bg-[#050816] border border-white/15 focus:border-[#26EFFD] focus:ring-1 focus:ring-[#26EFFD] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-all resize-none"
                  placeholder="e.g. تصاميم مستوحاة من ثقافة البوب آرت..."
                  required
                />
              </div>

              {/* Cover Image Upload Card */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">{t('categoryCoverImage')}</label>
                <div className="flex items-center gap-4 p-3 rounded-2xl border border-dashed border-white/20 bg-[#050816] hover:border-[#26EFFD]/50 transition-all group">
                  {coverImagePreview ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={coverImagePreview} alt="Cover Preview" className="object-cover w-full h-full" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#26EFFD] group-hover:border-[#26EFFD]/40 transition-all flex-shrink-0">
                      <UploadCloud size={20} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white">
                      {coverImagePreview ? 'صورة الغلاف الحالية' : 'اختر صورة غلاف للمجموعة'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP (تنسيق عالي الجودة)</p>
                  </div>

                  <label className="px-4 py-2 rounded-xl bg-[#26EFFD]/10 hover:bg-[#26EFFD]/20 border border-[#26EFFD]/40 text-[#26EFFD] text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5">
                    <UploadCloud size={14} />
                    <span>{coverImagePreview ? 'تغيير الصورة' : 'رفع غلاف'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      {...coverImageRegister}
                      onChange={(e) => {
                        coverImageRegister.onChange(e);
                        if (e.target.files && e.target.files[0]) {
                          setCoverImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Multiple Gallery Images Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">{t('uploadDesignItems')}</label>
                
                {/* Previews if any selected */}
                {newGalleryPreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mb-3 max-h-28 overflow-y-auto p-2.5 bg-[#050816] rounded-2xl border border-white/10">
                    {newGalleryPreviews.map((url, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 aspect-square group">
                        <img src={url} className="object-cover w-full h-full" alt="Upload Preview" />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">جديد</span>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-[#26EFFD] bg-[#050816] hover:bg-[#26EFFD]/5 transition-all cursor-pointer group text-center space-y-2">
                  <UploadCloud size={26} className="text-gray-400 group-hover:text-[#26EFFD] transition-colors" />
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#26EFFD] transition-colors">
                      {newGalleryPreviews.length > 0 ? `تم اختيار ${newGalleryPreviews.length} صور (اضغط لإضافة المزيد)` : 'اضغط لرفع عناصر صور التصاميم (يمكنك اختيار عدة صور)'}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">يدعم رفع ملفات متعددة دفعة واحدة</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    {...galleryImagesRegister}
                    onChange={(e) => {
                      galleryImagesRegister.onChange(e);
                      if (e.target.files) {
                        const filesArray = Array.from(e.target.files);
                        const urls = filesArray.map(file => URL.createObjectURL(file));
                        setNewGalleryPreviews(urls);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Existing Gallery Images */}
              {editingProject && existingGalleryImages.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">
                    {t('existingDesigns')} ({existingGalleryImages.length})
                  </label>
                  <div className="grid grid-cols-5 gap-3 max-h-36 overflow-y-auto p-2.5 bg-[#050816] rounded-2xl border border-white/10">
                    {existingGalleryImages.map((imgUrl, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden border border-white/10 aspect-square">
                        <img src={imgUrl} className="object-cover w-full h-full" alt="Design Item" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imgUrl)}
                          className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 hover:text-red-300 transition-opacity cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 border border-white/15 hover:border-white/30 rounded-full text-xs font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="neon-btn px-7 py-2.5 text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(38,239,253,0.3)] hover:shadow-[0_0_30px_rgba(38,239,253,0.5)]"
                >
                  <Save size={15} />
                  <span>{t('saveCategory')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
