import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save, Star, ExternalLink, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { GithubIcon } from '../../components/icons/BrandIcons';
import toast from 'react-hot-toast';
import { projectsAPI } from '../../lib/api';
import type { Project } from '../../types';
import { useAdminTranslation } from '../../lib/adminTranslations';

export default function ProjectsManager() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll().then((r) => r.data as Project[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => projectsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Category created successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => projectsAPI.update(id, data),
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
      setValue('featured', project.featured);
      setExistingGalleryImages(project.images || []);
      setCoverImagePreview(project.cover_image);
      setNewGalleryPreviews([]);
    } else {
      setEditingProject(null);
      reset({
        title: '',
        internal_name: '',
        category: 'graphic',
        description: '',
        tech_stack: '',
        github_url: '',
        live_url: '',
        featured: false,
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
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('internal_name', data.internal_name || '');
    formData.append('category', data.category || 'graphic');
    formData.append('description', data.description || '');
    formData.append('featured', String(data.featured));
    formData.append('github_url', data.github_url || '');
    formData.append('live_url', data.live_url || '');

    const stack = data.tech_stack
      ? data.tech_stack
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];
    formData.append('tech_stack', JSON.stringify(stack));

    if (data.cover_image && data.cover_image[0]) {
      formData.append('cover_image', data.cover_image[0]);
    }

    if (data.gallery_images && data.gallery_images.length > 0) {
      for (let i = 0; i < data.gallery_images.length; i++) {
        formData.append('gallery_images', data.gallery_images[i]);
      }
    }

    if (editingProject) {
      formData.append('existing_images', JSON.stringify(existingGalleryImages));
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('areYouSureDeleteCategory'))) {
      deleteMutation.mutate(id);
    }
  };

  const coverImageRegister = register('cover_image');
  const galleryImagesRegister = register('gallery_images');

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(projects) && projects.map((project) => (
            <div key={project.id} className="project-card group">
              <div className="project-card-image relative">
                <img src={project.cover_image} alt={project.title} className="object-cover w-full h-48" />
                <div className="absolute top-3 right-3 flex gap-1.5 z-10">
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
                    <span className="text-[10px] uppercase font-mono tracking-wider text-primary">{project.category}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <ImageIcon size={10} /> {project.images?.length || 0} {t('designsCount')}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{project.internal_name || project.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.description}</p>
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
          <div className="modal-content max-w-2xl bg-[#050816] border border-glass-border">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-black text-white tracking-wide">
                {editingProject ? t('modifyCategorySettings') : t('createDesignCategory')}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('publicTitle')}</label>
                  <input {...register('title')} className="input-field text-sm" placeholder="e.g. Pop Art Designs" required />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('internalName')}</label>
                  <input {...register('internal_name')} className="input-field text-sm" placeholder="e.g. Pop Art Designs - Moataz" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('groupCategory')}</label>
                  <select {...register('category')} className="input-field text-sm bg-[#050816]">
                    <option value="graphic">{t('graphicDesign')}</option>
                    <option value="branding">{t('brandingStrategy')}</option>
                    <option value="ui-ux">{t('uiUxDesign')}</option>
                    <option value="web">{t('webDevelopment')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('descriptionAr')}</label>
                <textarea {...register('description')} rows={2} className="input-field text-sm" placeholder="e.g. تصاميم مستوحاة من ثقافة البوب آرت..." required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('categoryCoverImage')}</label>
                  {coverImagePreview && (
                    <div className="relative mb-2 w-full h-24 rounded-xl overflow-hidden border border-glass-border bg-surface">
                      <img src={coverImagePreview} alt="Cover Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <input
                    type="file"
                    {...coverImageRegister}
                    onChange={(e) => {
                      coverImageRegister.onChange(e);
                      if (e.target.files && e.target.files[0]) {
                        setCoverImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="text-xs text-gray-400 bg-surface border border-glass-border p-2 rounded-xl w-full"
                  />
                </div>
                <div className="flex items-center gap-2 h-10 mb-1">
                  <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 rounded border-glass-border bg-surface text-primary focus:ring-0 cursor-pointer" />
                  <label htmlFor="featured" className="text-xs font-mono text-gray-400 cursor-pointer select-none">{t('featureThisCategory')}</label>
                </div>
              </div>

              {/* Multiple designs upload */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('uploadDesignItems')}</label>
                {newGalleryPreviews.length > 0 && (
                  <div className="grid grid-cols-6 gap-2 mb-3 max-h-24 overflow-y-auto p-2 bg-[#050816] rounded-xl border border-glass-border">
                    {newGalleryPreviews.map((url, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden border border-glass-border aspect-square">
                        <img src={url} className="object-cover w-full h-full" alt="New Upload Preview" />
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  {...galleryImagesRegister}
                  onChange={(e) => {
                    galleryImagesRegister.onChange(e);
                    if (e.target.files) {
                      const filesArray = Array.from(e.target.files);
                      const urls = filesArray.map(file => URL.createObjectURL(file));
                      setNewGalleryPreviews(urls);
                    }
                  }}
                  className="text-xs text-gray-400 bg-surface border border-glass-border p-2 rounded-xl w-full"
                />
              </div>

              {/* List of existing gallery images */}
              {editingProject && existingGalleryImages.length > 0 && (
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-2">{t('existingDesigns')} ({existingGalleryImages.length})</label>
                  <div className="grid grid-cols-5 gap-3 max-h-40 overflow-y-auto p-2 bg-[#050816] rounded-xl border border-glass-border">
                    {existingGalleryImages.map((imgUrl, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border border-glass-border aspect-square">
                        <img src={imgUrl} className="object-cover w-full h-full" alt="Design Item" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imgUrl)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-opacity cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-5 border-t border-glass-border">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-glass-border rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  {t('cancel')}
                </button>
                <button type="submit" className="neon-btn px-6 py-2.5 text-xs font-black flex items-center gap-1.5">
                  <Save size={14} /> {t('saveCategory')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

