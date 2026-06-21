import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { servicesAPI } from '../../lib/api';
import { useAdminTranslation } from '../../lib/adminTranslations';
import type { Service } from '../../types';

export default function ServicesManager() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesAPI.getAll().then((r) => r.data as Service[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => servicesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service added successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to add service'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => servicesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service updated successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to update service'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => servicesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Service deleted successfully');
    },
    onError: () => toast.error('Failed to delete service'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openModal = (service?: Service) => {
    setSelectedFile(null);
    if (service) {
      setEditingService(service);
      setValue('title', service.title);
      setValue('icon', service.icon);
      setValue('description', service.description);
      setValue('features', service.features.join('\n'));
      setValue('price', service.price || '');
      setValue('order', service.order);
      if (service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http'))) {
        setImagePreview(service.icon);
      } else {
        setImagePreview('');
      }
    } else {
      setEditingService(null);
      reset({
        title: '',
        icon: '',
        description: '',
        features: '',
        price: '',
        order: 1,
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setSelectedFile(null);
    setImagePreview('');
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title || '');
    formData.append('description', data.description || '');
    formData.append('price', data.price || '');
    formData.append('order', String(Number(data.order) || 1));

    const featuresList = data.features
      ? data.features
          .split('\n')
          .map((f: string) => f.trim())
          .filter(Boolean)
      : [];
    formData.append('features', JSON.stringify(featuresList));

    if (selectedFile) {
      formData.append('service_image', selectedFile);
    } else if (data.icon) {
      formData.append('icon', data.icon);
    } else {
      formData.append('icon', '');
    }

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteServiceConfirm'))) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">{t('servicesCatalog')}</h1>
          <p className="text-xs text-gray-400">{t('servicesDesc')}</p>
        </div>
        <button onClick={() => openModal()} className="neon-btn px-4 py-2 text-xs font-black flex items-center gap-1.5">
          <Plus size={14} /> {t('addService')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services?.map((service) => (
            <div key={service.id} className="glass-card p-6 group cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-surface border border-glass-border overflow-hidden p-1">
                  {service.icon && (service.icon.startsWith('/') || service.icon.startsWith('http')) ? (
                    <img src={service.icon} alt={service.title} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl">{service.icon || '⚡'}</span>
                  )}
                </div>
                <span className="text-xs font-mono text-primary font-bold">{service.price || 'Quotes'}</span>
              </div>

              <h3 className="font-bold text-white text-base mb-1">{service.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{service.description}</p>

              <ul className="space-y-1.5 mb-6">
                {service.features.map((feature, i) => (
                  <li key={i} className="text-[11px] text-gray-500 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end gap-2 pt-3 border-t border-glass-border">
                <button onClick={() => openModal(service)} className="p-2 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors">
                  <Edit size={12} />
                </button>
                <button onClick={() => handleDelete(service.id)} className="p-2 border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-black text-white tracking-wide">
                {editingService ? t('modifyServiceCard') : t('deployNewService')}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">{t('serviceTitle')}</label>
                  <input {...register('title')} className="input-field text-sm" placeholder="e.g. الهوية البصرية" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">{t('serviceCardImage')}</label>
                  <div className="flex items-center gap-4 p-3 bg-surface rounded-xl border border-glass-border">
                    <div className="w-16 h-16 rounded-lg bg-black/40 border border-glass-border flex items-center justify-center overflow-hidden flex-shrink-0">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-600 text-xs font-mono">{t('noImage')}</span>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="service-image-file"
                      />
                      <label
                        htmlFor="service-image-file"
                        className="neon-btn px-3 py-1.5 text-xs font-black cursor-pointer inline-block"
                      >
                        {t('uploadImageFile')}
                      </label>
                      <p className="text-[10px] text-gray-500">
                        {t('supportsImageDesc')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">{t('emojiFallback')}</label>
                  <input {...register('icon')} className="input-field text-sm" placeholder="e.g. ⚡ or manual URL path" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">{t('description', 'Description (optional)')}</label>
                <textarea {...register('description')} rows={3} className="input-field text-sm" placeholder="Summary of offering..." />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">{t('bulletFeatures', 'Bullet Point Features (one per line - optional)')}</label>
                <textarea {...register('features')} rows={4} className="input-field text-sm" placeholder="React & Next.js&#10;Node.js APIs&#10;PostgreSQL" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">{t('startingPrice')}</label>
                  <input {...register('price')} className="input-field text-sm" placeholder="e.g. $1,500" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">{t('displayOrder')}</label>
                  <input type="number" {...register('order')} className="input-field text-sm" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-glass-border">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-glass-border rounded-full text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  {t('cancel')}
                </button>
                <button type="submit" className="neon-btn px-6 py-2 text-xs font-black flex items-center gap-1.5">
                  <Save size={14} /> {t('commitChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
