import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Edit, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { skillsAPI } from '../../lib/api';
import type { Skill } from '../../types';

export default function SkillsManager() {
  const queryClient = useQueryClient();
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => skillsAPI.getAll().then((r) => r.data as Skill[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => skillsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill added successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to add skill'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => skillsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill updated successfully');
      closeModal();
    },
    onError: () => toast.error('Failed to update skill'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => skillsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted successfully');
    },
    onError: () => toast.error('Failed to delete skill'),
  });

  const { register, handleSubmit, reset, setValue } = useForm();

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setValue('name', skill.name);
      setValue('level', skill.level);
      setValue('category', skill.category);
      setValue('order', skill.order);
    } else {
      setEditingSkill(null);
      reset({
        name: '',
        level: 80,
        category: 'frontend',
        order: 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      level: Number(data.level),
      order: Number(data.order),
    };

    if (editingSkill) {
      updateMutation.mutate({ id: editingSkill.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this skill from portfolio?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Skill Matrix Settings</h1>
          <p className="text-xs text-gray-400">Manage technical stack proficiencies and categories</p>
        </div>
        <button onClick={() => openModal()} className="neon-btn-solid px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-lg">
          <Plus size={14} /> Add Skill
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="glass-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-glass-border text-xs font-mono uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Display Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border">
                {skills?.map((skill) => (
                  <tr key={skill.id} className="hover:bg-surface/30 transition-colors text-sm">
                    <td className="py-3.5 px-4 font-semibold text-white">{skill.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-surface border border-glass-border text-primary capitalize">
                        {skill.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 w-40">
                        <div className="flex-1 h-2 rounded-full bg-surface border border-glass-border overflow-hidden">
                          <div className="h-full bg-gradient-neon" style={{ width: `${skill.level}%` }} />
                        </div>
                        <span className="text-xs font-mono font-bold text-gray-300">{skill.level}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-gray-400">{skill.order}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button onClick={() => openModal(skill)} className="p-1.5 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(skill.id)} className="p-1.5 border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-glass-border">
              <h3 className="text-lg font-bold text-white">
                {editingSkill ? 'Modify Skill metrics' : 'Configure New Skill'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Skill Name</label>
                <input {...register('name', { required: true })} className="input-field text-sm" placeholder="e.g. React.js" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Category</label>
                  <select {...register('category')} className="input-field text-sm bg-[#050816]">
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="graphic">Graphic Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">Proficiency Level (0-100)</label>
                  <input type="number" {...register('level', { required: true, min: 0, max: 100 })} className="input-field text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">Display Order</label>
                <input type="number" {...register('order')} className="input-field text-sm" />
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
