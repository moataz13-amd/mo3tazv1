import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { testimonialsAPI } from '../../lib/api';
import type { Testimonial } from '../../types';

export default function TestimonialsManager() {
  const queryClient = useQueryClient();
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialsAPI.getAll().then((r) => r.data as Testimonial[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => testimonialsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial created');
      closeModal();
    },
    onError: () => toast.error('Failed to create testimonial'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => testimonialsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated');
      closeModal();
    },
    onError: () => toast.error('Failed to update testimonial'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted');
    },
    onError: () => toast.error('Failed to delete testimonial'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setValue('client_name', testimonial.client_name);
      setValue('client_title', testimonial.client_title);
      setValue('client_company', testimonial.client_company);
      setValue('content', testimonial.content);
      setValue('rating', testimonial.rating);
      setValue('project_type', testimonial.project_type || '');
      setValue('status', testimonial.status);
    } else {
      setEditingTestimonial(null);
      reset({
        client_name: '',
        client_title: '',
        client_company: '',
        content: '',
        rating: 5,
        project_type: '',
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTestimonial(null);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('client_name', data.client_name);
    formData.append('client_title', data.client_title);
    formData.append('client_company', data.client_company);
    formData.append('content', data.content);
    formData.append('rating', String(data.rating));
    formData.append('project_type', data.project_type);
    formData.append('status', data.status);

    if (data.client_photo && data.client_photo[0]) {
      formData.append('client_photo', data.client_photo[0]);
    }

    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Client Testimonials</h1>
          <p className="text-xs text-gray-400">Review, manage, and verify client feedback recommendations</p>
        </div>
        <button onClick={() => openModal()} className="neon-btn-solid px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-lg">
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {testimonials?.map((testimonial) => (
            <div key={testimonial.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-glass-border flex-shrink-0">
                      {testimonial.client_photo ? (
                        <img src={testimonial.client_photo} alt={testimonial.client_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface text-primary flex items-center justify-center font-bold">
                          {testimonial.client_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{testimonial.client_name}</h4>
                      <p className="text-[10px] text-gray-400">
                        {testimonial.client_title}, {testimonial.client_company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={12} fill="#f59e0b" stroke="none" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed italic mb-4">"{testimonial.content}"</p>
                {testimonial.project_type && (
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-surface border border-glass-border text-primary">
                    {testimonial.project_type}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-6 pt-3 border-t border-glass-border">
                <span className={`text-[10px] uppercase font-mono tracking-wider ${testimonial.status === 'active' ? 'text-green-400' : 'text-gray-500'}`}>
                  {testimonial.status}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => openModal(testimonial)} className="p-2 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors">
                    <Edit size={12} />
                  </button>
                  <button onClick={() => handleDelete(testimonial.id)} className="p-2 border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors">
                    <Trash2 size={12} />
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
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-bold text-white">
                {editingTestimonial ? 'Update Testimonial File' : 'Deploy Testimonial Card'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Client Name</label>
                  <input {...register('client_name', { required: true })} className="input-field text-sm" placeholder="e.g. Sarah Mitchell" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Project Type</label>
                  <input {...register('project_type')} className="input-field text-sm" placeholder="e.g. Web Development" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Role/Title</label>
                  <input {...register('client_title', { required: true })} className="input-field text-sm" placeholder="e.g. Product Manager" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Company</label>
                  <input {...register('client_company', { required: true })} className="input-field text-sm" placeholder="e.g. Innovate Inc." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Review Statement</label>
                <textarea {...register('content', { required: true })} rows={4} className="input-field text-sm" placeholder="Paste feedback statement..." />
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2">
                  <label className="block text-xs font-mono text-gray-400 mb-1">Client Avatar/Photo</label>
                  <input type="file" {...register('client_photo')} className="text-xs text-gray-400 bg-surface border border-glass-border p-2 rounded-xl w-full" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Rating Stars (1-5)</label>
                  <input type="number" {...register('rating', { required: true, min: 1, max: 5 })} className="input-field text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Status</label>
                <select {...register('status')} className="input-field text-sm bg-[#050816]">
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-glass-border">
                <button type="button" onClick={closeModal} className="px-4 py-2 border border-glass-border rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="neon-btn-solid px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <Save size={14} /> Commit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
