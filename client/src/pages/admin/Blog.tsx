import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save, Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';
import { blogAPI } from '../../lib/api';
import type { BlogPost } from '../../types';

export default function BlogManager() {
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => blogAPI.getAll().then((r) => r.data as BlogPost[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: FormData) => blogAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Article published');
      closeModal();
    },
    onError: () => toast.error('Failed to publish article'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => blogAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Article updated');
      closeModal();
    },
    onError: () => toast.error('Failed to update article'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast.success('Article deleted');
    },
    onError: () => toast.error('Failed to delete article'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setValue('title', post.title);
      setValue('excerpt', post.excerpt);
      setValue('content', post.content);
      setValue('tags', post.tags.join(', '));
      setValue('status', post.status);
    } else {
      setEditingPost(null);
      reset({
        title: '',
        excerpt: '',
        content: '',
        tags: '',
        status: 'published',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    formData.append('status', data.status);

    const tagsArr = data.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    formData.append('tags', JSON.stringify(tagsArr));

    if (data.cover_image && data.cover_image[0]) {
      formData.append('cover_image', data.cover_image[0]);
    }

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Articles & Insights</h1>
          <p className="text-xs text-gray-400">Manage digital notes, tech research, and articles</p>
        </div>
        <button onClick={() => openModal()} className="neon-btn-solid px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-lg">
          <Plus size={14} /> Add Article
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts?.map((post) => (
            <div key={post.id} className="project-card">
              {post.cover_image && (
                <div className="project-card-image">
                  <img src={post.cover_image} alt={post.title} />
                </div>
              )}
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-primary font-bold uppercase">{post.status}</span>
                    <span className="text-[9px] text-gray-500 font-mono">Views: {post.views || 0}</span>
                  </div>
                  <h3 className="font-bold text-white text-base truncate">{post.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-glass-border">
                  <button onClick={() => openModal(post)} className="p-2 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors">
                    <Edit size={12} />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors">
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
          <div className="modal-content max-w-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-bold text-white">
                {editingPost ? 'Modify Article Parameters' : 'Deploy New Article'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Article Title</label>
                <input {...register('title', { required: true })} className="input-field text-sm" placeholder="e.g. Navigating WebGL Shader Layouts" />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Excerpt (Summary)</label>
                <textarea {...register('excerpt', { required: true })} rows={2} className="input-field text-sm" placeholder="Summarize article..." />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Rich Text Content (HTML/Markdown)</label>
                <textarea {...register('content', { required: true })} rows={8} className="input-field text-sm font-mono text-xs leading-relaxed" placeholder="Type content here..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Tags (comma separated)</label>
                  <input {...register('tags')} className="input-field text-sm" placeholder="WebGL, CSS, React" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Publish Status</label>
                  <select {...register('status')} className="input-field text-sm bg-[#050816]">
                    <option value="published">Published (Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Cover Image Asset</label>
                <input type="file" {...register('cover_image')} className="text-xs text-gray-400 bg-surface border border-glass-border p-2 rounded-xl w-full" />
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
