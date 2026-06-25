import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, X, Image as ImageIcon, Eye, UploadCloud, Filter, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { projectsAPI, compressImage } from '../../lib/api';
import { useAdminTranslation } from '../../lib/adminTranslations';
import type { Project } from '../../types';

export default function DesignsManager() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Fetch all projects/categories
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsAPI.getAll().then((r) => r.data as Project[]),
  });

  const selectedProject = projects?.find(p => p.id === targetProjectId);

  // Flat list of all designs from all projects
  const allDesigns = (projects || []).flatMap((project) => {
    return (project.images || []).map((imgUrl, idx) => ({
      url: imgUrl,
      projectTitle: project.title,
      projectInternalName: project.internal_name,
      projectId: project.id,
      projectCategory: project.category,
      index: idx,
    }));
  });

  const filteredDesigns = selectedProjectId === 'all'
    ? allDesigns
    : allDesigns.filter(d => d.projectId === selectedProjectId);

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ projectId, files }: { projectId: string; files: File[] }) => {
      const projectToUpdate = projects?.find(p => p.id === projectId);
      if (!projectToUpdate) throw new Error('Category not found');

      setCompressing(true);
      const compressedBlobs = await Promise.all(
        files.map(async (file, i) => {
          setUploadProgress(Math.round((i / files.length) * 40));
          const blob = await compressImage(file);
          return new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
        })
      );
      setCompressing(false);
      setUploadProgress(50);

      const formData = new FormData();
      formData.append('title', projectToUpdate.title);
      formData.append('category', projectToUpdate.category);
      formData.append('description', projectToUpdate.description);
      formData.append('featured', String(projectToUpdate.featured));
      formData.append('tech_stack', JSON.stringify(projectToUpdate.tech_stack || []));
      formData.append('existing_images', JSON.stringify(projectToUpdate.images || []));

      compressedBlobs.forEach((file) => formData.append('gallery_images', file));

      setUploadProgress(70);
      return projectsAPI.update(projectId, formData);
    },
    onSuccess: () => {
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setTimeout(() => { toast.success('Designs added successfully'); }, 100);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload designs');
    },
    onSettled: () => {
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ projectId, imageUrl }: { projectId: string; imageUrl: string }) => {
      const projectToUpdate = projects?.find(p => p.id === projectId);
      if (!projectToUpdate) throw new Error('Category not found');

      const updatedImages = (projectToUpdate.images || []).filter(img => img !== imageUrl);

      const projectFormData = new FormData();
      projectFormData.append('title', projectToUpdate.title);
      projectFormData.append('category', projectToUpdate.category);
      projectFormData.append('description', projectToUpdate.description);
      projectFormData.append('featured', String(projectToUpdate.featured));
      projectFormData.append('tech_stack', JSON.stringify(projectToUpdate.tech_stack || []));
      projectFormData.append('existing_images', JSON.stringify(updatedImages));

      return projectsAPI.update(projectId, projectFormData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Design deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete design');
    }
  });

  const openModal = () => {
    if (projects && projects.length > 0) {
      setTargetProjectId(projects[0].id);
    } else {
      setTargetProjectId('');
    }
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsCategoryDropdownOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      const newUrls = newFiles.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
    e.target.value = '';
  };

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId) {
      toast.error('Please select a category first.');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image to upload.');
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate({ projectId: targetProjectId, files: selectedFiles });
  };

  const handleDelete = (projectId: string, imageUrl: string) => {
    if (window.confirm(t('areYouSureDeleteDesign'))) {
      deleteMutation.mutate({ projectId, imageUrl });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">{t('designsManager')}</h1>
          <p className="text-xs text-gray-400">{t('designsManagerDesc')}</p>
        </div>
        <button
          onClick={openModal}
          disabled={!projects || projects.length === 0}
          className="neon-btn px-4 py-2.5 text-xs font-black flex items-center gap-1.5 self-start disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={14} /> {t('addDesign')}
        </button>
      </div>

      {/* Filter and stats bar */}
      <div className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-primary" />
          <span className="text-xs font-mono text-gray-400">{t('filterCategory')}</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="input-field py-1 px-3 text-xs bg-[#050816] max-w-xs cursor-pointer"
          >
            <option value="all">{t('allCategories')} ({allDesigns.length})</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.internal_name || p.title} ({(p.images || []).length})
              </option>
            ))}
          </select>
        </div>
        <div className="text-right text-xs font-mono text-gray-400">
          {t('showing')} <span className="text-primary font-bold">{filteredDesigns.length}</span> {t('designsText')}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-400 space-y-4">
          <ImageIcon size={48} className="mx-auto text-gray-600 animate-pulse" />
          <h3 className="text-base font-bold text-white">{t('noDesignsFound')}</h3>
          <p className="text-xs max-w-sm mx-auto">
            {projects && projects.length > 0
              ? t('noDesignsDesc1')
              : t('noDesignsDesc2')}
          </p>
          {projects && projects.length > 0 && (
            <button onClick={openModal} className="neon-btn px-4 py-2 text-xs font-black">
              {t('addDesign')}
            </button>
          )}
        </div>
      ) : (
        /* Designs Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredDesigns.map((design, index) => (
            <div key={index} className="project-card group overflow-hidden relative aspect-square border border-glass-border hover:border-primary hover:shadow-neon-sm rounded-2xl transition-all duration-300">
              <img
                src={design.url}
                alt={`${design.projectInternalName || design.projectTitle} - Design`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay hover panel */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-between p-4 transition-all duration-300">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setLightboxImage(design.url)}
                    className="p-1.5 bg-[#ffffff]/10 hover:bg-[#ffffff]/25 text-white border border-white/20 rounded-lg transition-colors cursor-pointer"
                    title={t('zoomDesign')}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(design.projectId, design.url)}
                    className="p-1.5 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 rounded-lg transition-colors cursor-pointer"
                    title={t('deleteDesign')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {design.projectCategory}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate mt-2" title={design.projectInternalName || design.projectTitle}>
                    {design.projectInternalName || design.projectTitle}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Design Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md bg-[#050816] border border-glass-border">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-black text-white tracking-wide">
                {t('uploadNewDesign')}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('selectCategoryAlbum')}</label>
                
                {/* Custom Trigger Button */}
                <div
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="input-field text-sm bg-[#050816] w-full flex items-center justify-between cursor-pointer select-none"
                  style={{
                    paddingRight: '2.5rem',
                    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300E5FF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.1em'
                  }}
                >
                  {selectedProject ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProject.cover_image}
                        alt=""
                        className="w-6 h-6 rounded-md object-cover border border-glass-border"
                      />
                      <span className="text-white font-bold">{selectedProject.internal_name || selectedProject.title}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">{t('chooseCategory')}</span>
                  )}
                </div>

                {/* Custom Options list */}
                {isCategoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    />
                    
                    <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-[#0b1224] border border-glass-border rounded-xl z-20 shadow-neon-sm p-1">
                      {projects?.map((p) => {
                        const isSelected = p.id === targetProjectId;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setTargetProjectId(p.id);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-primary text-black font-bold'
                                : 'text-white hover:bg-surface/30'
                            }`}
                          >
                            <img
                              src={p.cover_image}
                              alt=""
                              className={`w-8 h-8 rounded-md object-cover border ${
                                isSelected ? 'border-black' : 'border-glass-border'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate ${isSelected ? 'text-black font-black' : 'text-white font-bold'}`}>
                                {p.internal_name || p.title}
                              </p>
                              <p className={`text-[10px] uppercase font-mono ${isSelected ? 'text-black/80' : 'text-gray-400'}`}>
                                {p.category}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">{t('designImageFile')}</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                
                {previewUrls.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      {previewUrls.map((url, i) => {
                        const file = selectedFiles[i];
                        const sizeMB = file ? (file.size / 1024 / 1024).toFixed(1) : '';
                        return (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-glass-border aspect-square group bg-surface">
                            <img src={url} className="object-cover w-full h-full" alt="" />
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                              <p className="text-[9px] text-white/70 font-mono">{sizeMB} MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileSelect}
                      className="text-xs text-primary hover:underline font-bold"
                    >
                      + {t('addMoreImages')}
                    </button>
                  </div>
                ) : (
                  /* Custom dropzone box */
                  <div
                    onClick={triggerFileSelect}
                    className="border-2 border-dashed border-glass-border hover:border-primary rounded-2xl p-6 text-center cursor-pointer hover:bg-surface/5 transition-all space-y-3"
                  >
                    <UploadCloud size={32} className="mx-auto text-primary animate-pulse" />
                    <div>
                      <p className="text-xs text-white font-bold">{t('clickToChooseImage')}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{t('imageTypesDesc')}</p>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-1">
                    <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 font-mono text-right">
                      {compressing ? t('compressingImages') : `${uploadProgress}%`}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUploading}
                  className="px-4 py-2 border border-glass-border rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isUploading || selectedFiles.length === 0}
                  className="neon-btn px-6 py-2.5 text-xs font-black flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      {compressing ? t('compressing') : t('uploading')}
                    </>
                  ) : (
                    <>
                      <UploadCloud size={14} />
                      {selectedFiles.length > 1
                        ? `${t('uploadDesign')} (${selectedFiles.length})`
                        : t('uploadDesign')}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-black/80 hover:scale-105 transition-all cursor-pointer z-50"
          >
            <X size={20} />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] relative rounded-2xl overflow-hidden bg-transparent border border-white/15">
            <img src={lightboxImage} alt="Preview" className="max-w-full max-h-[85vh] object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
