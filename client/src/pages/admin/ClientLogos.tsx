import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save, ImageIcon, Upload, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { clientLogosAPI } from '../../lib/api';
import { useAdminTranslation } from '../../lib/adminTranslations';

interface ClientLogo {
  id: string;
  name: string;
  src: string;
  order: number;
  created_at: string;
}

export default function ClientLogosManager() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [editingLogo, setEditingLogo] = useState<ClientLogo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: logos, isLoading } = useQuery({
    queryKey: ['client-logos'],
    queryFn: () => clientLogosAPI.getAll().then((r) => r.data as ClientLogo[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => clientLogosAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-logos'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('تمت إضافة اللوجو بنجاح');
      closeModal();
    },
    onError: () => toast.error('فشل في إضافة اللوجو'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => clientLogosAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-logos'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('تم تحديث اللوجو بنجاح');
      closeModal();
    },
    onError: () => toast.error('فشل في تحديث اللوجو'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientLogosAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-logos'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('تم حذف اللوجو بنجاح');
    },
    onError: () => toast.error('فشل في حذف اللوجو'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const openModal = (logo?: ClientLogo) => {
    if (logo) {
      setEditingLogo(logo);
      setValue('name', logo.name);
      setValue('src', logo.src);
      setValue('order', logo.order);
      setImagePreview(logo.src);
    } else {
      setEditingLogo(null);
      reset({
        name: '',
        src: '',
        order: (logos?.length || 0) + 1,
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLogo(null);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('order', String(Number(data.order) || 1));

    if (selectedFile) {
      formData.append('logo_image', selectedFile);
    } else if (data.src) {
      formData.append('src', data.src);
    }

    if (editingLogo) {
      updateMutation.mutate({ id: editingLogo.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(t('deleteLogoConfirm'))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">{t('clientLogos')}</h1>
          <p className="text-xs text-gray-400">{t('clientLogosDesc')}</p>
        </div>
        <button onClick={() => openModal()} className="neon-btn px-4 py-2 text-xs font-black flex items-center gap-1.5">
          <Plus size={14} /> {t('addLogo')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : logos && logos.length > 0 ? (
        <div className="glass-card p-6">
          {/* Grid View of Logos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="group relative rounded-xl border border-glass-border bg-surface/50 p-4 transition-all duration-300 hover:border-[rgba(0,191,255,0.3)] hover:shadow-[0_0_20px_rgba(0,191,255,0.08)]"
              >
                {/* Order Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-mono text-gray-500">
                  <GripVertical size={12} />
                  {t('orderHash')} {logo.order}
                </div>

                {/* Logo Preview */}
                <div className="flex items-center justify-center h-24 mb-4 mt-2">
                  <img
                    src={logo.src}
                    alt={logo.name || 'Client Logo'}
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: 'brightness(0.9)' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden flex-col items-center gap-1 text-gray-500">
                    <ImageIcon size={32} />
                    <span className="text-[10px] font-mono">{t('imageNotFound')}</span>
                  </div>
                </div>

                {/* Logo Name */}
                <div className="text-center border-t border-glass-border pt-3">
                  <h3 className="text-sm font-semibold text-white truncate">{logo.name || t('logoName')}</h3>
                  <p className="text-[10px] font-mono text-gray-500 mt-1 truncate">{logo.src}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-glass-border opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(logo)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors"
                  >
                    <Edit size={12} /> {t('edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(logo.id, logo.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors"
                  >
                    <Trash2 size={12} /> {t('delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-glass-border flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={28} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{t('noLogosYet')}</h3>
          <p className="text-sm text-gray-400 mb-6">{t('addLogoDesc')}</p>
          <button onClick={() => openModal()} className="neon-btn px-6 py-2.5 text-xs font-black inline-flex items-center gap-2">
            <Plus size={14} /> {t('addFirstLogo')}
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-black text-white tracking-wide">
                {editingLogo ? t('edit') : t('addLogo')}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Logo Image Upload */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2">{t('logoImage')}</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-glass-border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group"
                >
                  {imagePreview ? (
                    <div className="flex items-center justify-center h-20">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-500 group-hover:text-primary mb-2 transition-colors" />
                      <span className="text-xs text-gray-400">{t('clickToChooseImage')}</span>
                      <span className="text-[10px] text-gray-500 mt-1">PNG, SVG, WEBP</span>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Manual URL Input */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">{t('manualUrlInput')}</label>
                <input
                  {...register('src')}
                  className="input-field text-sm"
                  placeholder="/logos/client-name.png"
                  dir="ltr"
                  onChange={(e) => {
                    if (!selectedFile && e.target.value) {
                      setImagePreview(e.target.value);
                    }
                  }}
                />
              </div>

              {/* Logo Name */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">{t('clientName')}</label>
                <input
                  {...register('name')}
                  className="input-field text-sm"
                  placeholder="e.g. Perfect Company"
                  dir="auto"
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">{t('displayOrder')}</label>
                <input
                  type="number"
                  {...register('order')}
                  className="input-field text-sm"
                  min={1}
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-glass-border">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-glass-border rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="neon-btn px-6 py-2 text-xs font-black flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save size={14} /> {editingLogo ? t('commitChanges') : t('addLogo')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
