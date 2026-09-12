import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Eye, UploadCloud, Loader2, Sparkles, Sliders, ChevronLeft, ChevronRight, GalleryHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { carouselsAPI, mediaAPI, compressImage } from '../../lib/api';
import { useAdminTranslation } from '../../lib/adminTranslations';
import FileDropzone from '../../components/admin/FileDropzone';
import type { Carousel } from '../../types';

export default function CarouselsManager() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [spacing, setSpacing] = useState<number>(16);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [compressing, setCompressing] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all carousels
  const { data: carousels, isLoading } = useQuery({
    queryKey: ['carousels'],
    queryFn: () => carouselsAPI.getAll().then((r) => r.data as Carousel[]),
  });

  const openCreateModal = () => {
    setEditingCarousel(null);
    setTitle('');
    setSpacing(16);
    setExistingImages([]);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Carousel) => {
    setEditingCarousel(c);
    setTitle(c.title || '');
    setSpacing(c.spacing ?? 16);
    setExistingImages(c.images || []);
    setSelectedFiles([]);
    setPreviewUrls([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isUploading) return;
    setIsModalOpen(false);
    setEditingCarousel(null);
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  const handleFilesAdded = (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (valid.length < files.length) {
      toast.error('تم تجاهل بعض الملفات لأنها ليست صوراً');
    }
    const newFiles = [...selectedFiles, ...valid];
    setSelectedFiles(newFiles);

    const newPreviews = valid.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  };

  const removeSelectedFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imgUrl: string) => {
    setExistingImages(prev => prev.filter(url => url !== imgUrl));
  };

  const uploadFilesToMedia = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    setCompressing(true);
    const compressed: File[] = [];
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(Math.round((i / files.length) * 20));
      const blob = await compressImage(files[i]);
      const f = new File([blob], files[i].name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
      compressed.push(f);
    }
    setCompressing(false);
    setUploadProgress(25);

    const urls: string[] = [];
    let failedCount = 0;
    for (let i = 0; i < compressed.length; i++) {
      const fd = new FormData();
      fd.append('file', compressed[i]);
      try {
        const res = await mediaAPI.upload(fd);
        urls.push(res.data.url);
      } catch {
        failedCount++;
        toast.error(`فشل رفع الصورة "${compressed[i].name}"`);
      }
      setUploadProgress(25 + Math.round(((i + 1) / compressed.length) * 60));
    }
    if (failedCount > 0) toast.error(`فشل رفع ${failedCount} صورة`);
    return urls;
  };

  // Create / Update Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      const newUrls = await uploadFilesToMedia(selectedFiles);
      const finalImages = [...existingImages, ...newUrls];

      const formData = new FormData();
      formData.append('title', title.trim() || 'كاروسيل جديد');
      formData.append('spacing', String(spacing));
      formData.append('existing_images', JSON.stringify(finalImages));

      setUploadProgress(90);

      if (editingCarousel) {
        return carouselsAPI.update(editingCarousel.id, formData);
      } else {
        return carouselsAPI.create(formData);
      }
    },
    onSuccess: () => {
      setUploadProgress(100);
      toast.success(editingCarousel ? 'تم تحديث الكاروسيل بنجاح' : 'تم إنشاء الكاروسيل بنجاح');
      queryClient.invalidateQueries({ queryKey: ['carousels'] });
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.message || 'حدث خطأ أثناء حفظ الكاروسيل');
    },
    onSettled: () => {
      setIsUploading(false);
      setUploadProgress(0);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => carouselsAPI.delete(id),
    onSuccess: () => {
      toast.success('تم حذف الكاروسيل بنجاح');
      queryClient.invalidateQueries({ queryKey: ['carousels'] });
    },
    onError: () => toast.error('فشل حذف الكاروسيل'),
  });

  return (
    <div className="space-y-8 p-4 md:p-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-glass-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
            <GalleryHorizontal size={28} className="text-[#00E5FF]" />
            إدارة الكاروسيل الإنتراكتيف
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            إضافة وتعديل معرض الصور المتصلة بدقة <span className="text-[#00E5FF] font-mono dir-ltr font-bold">391×524 px</span> والتحكم في المسافات بين الصور (Spacing).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="glow-button py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-bold cursor-pointer transition-all self-start md:self-auto"
        >
          <Plus size={20} />
          إضافة كاروسيل جديد
        </button>
      </div>

      {/* Carousels List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#00E5FF]" size={40} />
        </div>
      ) : !carousels || carousels.length === 0 ? (
        <div className="glass-card p-12 text-center text-gray-400 border border-white/10 rounded-2xl">
          <GalleryHorizontal size={48} className="mx-auto mb-4 opacity-30 text-[#00E5FF]" />
          <p className="text-lg font-bold">لا يوجد أي كاروسيل حالياً</p>
          <p className="text-sm text-gray-500 mt-1">اضغط على زر "إضافة كاروسيل جديد" لإنشاء المعرض الأول</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {carousels.map((carousel) => (
            <div
              key={carousel.id}
              className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col gap-6 relative overflow-hidden bg-black/40 backdrop-blur-md hover:border-[#00E5FF]/40 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              {/* Carousel Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{carousel.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-3">
                      <span>المسافة بين الصور: <strong className="text-[#00E5FF]">{carousel.spacing ?? 16}px</strong></span>
                      <span>•</span>
                      <span>عدد الصور: <strong className="text-white">{carousel.images?.length || 0}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(carousel)}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF] hover:text-[#00E5FF] text-gray-300 transition-colors cursor-pointer flex items-center gap-2 text-xs font-bold"
                  >
                    <Edit2 size={16} />
                    تعديل الكاروسيل
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`هل أنت تأكد من حذف الكاروسيل "${carousel.title}"؟`)) {
                        deleteMutation.mutate(carousel.id);
                      }
                    }}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                    title="حذف الكاروسيل"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Carousel Preview Banner Horizontal Scroll */}
              {carousel.images && carousel.images.length > 0 ? (
                <div className="relative w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#00E5FF]/30">
                  <div
                    className="flex items-center"
                    style={{ gap: `${carousel.spacing ?? 16}px` }}
                  >
                    {carousel.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="relative flex-shrink-0 group cursor-pointer rounded-xl overflow-hidden border border-white/10 hover:border-[#00E5FF] transition-all shadow-md"
                        style={{
                          width: '180px',
                          height: '241px', // Maintains exact 391:524 aspect ratio
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Carousel item ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <Eye size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-mono dir-ltr">
                          #{i + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-gray-500 text-sm">
                  لا توجد صور مضافة لهذا الكاروسيل بعد.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card border border-white/10 w-full max-w-3xl rounded-3xl p-6 md:p-8 relative bg-[#090D1A] my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-glass-border pb-4 mb-6">
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <GalleryHorizontal className="text-[#00E5FF]" />
                {editingCarousel ? 'تعديل الكاروسيل' : 'إضافة كاروسيل جديد'}
              </h2>
              <button
                onClick={closeModal}
                disabled={isUploading}
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">عنوان الكاروسيل</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: كاروسيل خاص بشركة 3M Techs"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#00E5FF] focus:outline-none"
                />
              </div>

              {/* Spacing Slider & Input */}
              <div className="glass-card p-4 rounded-xl border border-white/10 bg-black/30 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-200 flex items-center gap-2">
                    <Sliders size={18} className="text-[#00E5FF]" />
                    المسافة بين الصور (Spacing):
                  </label>
                  <span className="text-[#00E5FF] font-mono font-bold text-base px-3 py-1 bg-[#00E5FF]/10 rounded-lg border border-[#00E5FF]/30">
                    {spacing}px
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="2"
                    value={spacing}
                    onChange={(e) => setSpacing(Number(e.target.value))}
                    className="flex-1 accent-[#00E5FF] cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={spacing}
                    onChange={(e) => setSpacing(Number(e.target.value))}
                    className="w-20 bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-center text-white font-mono text-sm focus:border-[#00E5FF] focus:outline-none"
                  />
                </div>
                <p className="text-xs text-gray-400">
                  تحكم بالبكسل في المسافة التي تفصل بين كل بطاقة تصميم والأخرى داخل المعرض.
                </p>
              </div>

              {/* Upload Target Notice */}
              <div className="p-3 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl text-xs text-[#00E5FF] flex items-center gap-2">
                <Sparkles size={16} className="flex-shrink-0" />
                <span>النماذج يتم قياسها وتجهيزها بنسبة العرض إلى الارتفاع المطلوبة <strong>391 × 524 بكسل</strong>.</span>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">
                    الصور الحالية ({existingImages.length}):
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                    {existingImages.map((imgUrl, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10 h-28 bg-black">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imgUrl)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                          title="حذف هذه الصورة"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Files Dropzone */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">رفع صور جديدة:</label>
                <FileDropzone multiple onFilesSelect={handleFilesAdded} />
              </div>

              {/* Preview Newly Selected Files */}
              {previewUrls.length > 0 && (
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">الصور الجديدة المحددة ({previewUrls.length}):</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-56 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-white/10 h-28 bg-black">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(i)}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>{compressing ? 'جاري ضغط الصور...' : 'جاري رفع الصور والتحديث...'}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/10">
                    <div
                      className="bg-[#00E5FF] h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-glass-border">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isUploading}
                  className="px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-sm font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="glow-button py-3 px-8 rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2"
                >
                  {isUploading && <Loader2 className="animate-spin" size={18} />}
                  {editingCarousel ? 'حفظ التعديلات' : 'إنشاء الكاروسيل'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Preview */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={lightboxImage} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-white/20 shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
