import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Save, Briefcase, GraduationCap, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { experienceAPI } from '../../lib/api';
import type { ExperienceEntry } from '../../types';

const typeOptions = [
  { value: 'experience', label: 'خبرة عملية', icon: '💼' },
  { value: 'education', label: 'تعليم', icon: '🎓' },
  { value: 'certification', label: 'شهادة', icon: '🏆' },
];

const colorOptions = ['#00E5FF', '#4F46E5', '#f59e0b', '#10b981', '#06B6D4', '#8b5cf6', '#ef4444', '#ec4899'];

const defaultForm = {
  type: 'experience' as 'experience' | 'education' | 'certification',
  title: '',
  organization: '',
  period: '',
  description: '',
  tags: '',
  icon: '💼',
  color: '#00E5FF',
  order: 0,
};

export default function ExperiencePage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: () => experienceAPI.getAll().then((r) => r.data as ExperienceEntry[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: object) => experienceAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('تمت إضافة العنصر بنجاح');
      resetForm();
    },
    onError: () => toast.error('فشل في إضافة العنصر'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => experienceAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('تم التحديث بنجاح');
      resetForm();
    },
    onError: () => toast.error('فشل في التحديث'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experienceAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      toast.success('تم الحذف بنجاح');
    },
    onError: () => toast.error('فشل في الحذف'),
  });

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (entry: ExperienceEntry) => {
    setForm({
      type: entry.type,
      title: entry.title,
      organization: entry.organization,
      period: entry.period,
      description: entry.description,
      tags: (entry.tags || []).join(', '),
      icon: entry.icon,
      color: entry.color,
      order: entry.order,
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'experience': return <Briefcase size={14} />;
      case 'education': return <GraduationCap size={14} />;
      case 'certification': return <Award size={14} />;
      default: return <Briefcase size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Experience & Timeline</h1>
          <p className="text-xs text-gray-400">إدارة الخبرات والتعليم والشهادات</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="neon-btn-solid px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Plus size={14} /> إضافة عنصر
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="glass-card p-6 space-y-4 border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-sm">
              {editingId ? 'تعديل العنصر' : 'إضافة عنصر جديد'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">النوع</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                className="input-field text-sm w-full"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">العنوان</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field text-sm"
                placeholder="مثال: Senior Developer"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">المؤسسة / الشركة</label>
              <input
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                className="input-field text-sm"
                placeholder="مثال: TechCorp Global"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">الفترة الزمنية</label>
              <input
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="input-field text-sm"
                placeholder="مثال: 2022 — Present"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">الوصف</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field text-sm"
              placeholder="وصف تفصيلي..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">التاجات (مفصولة بفواصل)</label>
              <input
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="input-field text-sm"
                placeholder="React, Node.js, AWS"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">الأيقونة (Emoji)</label>
              <input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                className="input-field text-sm"
                placeholder="💼"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">اللون</label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className="w-7 h-7 rounded-lg border-2 transition-all"
                    style={{
                      background: c,
                      borderColor: form.color === c ? '#fff' : 'transparent',
                      transform: form.color === c ? 'scale(1.2)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">الترتيب</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                className="input-field text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={resetForm} className="px-4 py-2 border border-glass-border rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors">
              إلغاء
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="neon-btn-solid px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Save size={14} /> {editingId ? 'حفظ التعديلات' : 'إضافة'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-400 text-sm">لا توجد عناصر بعد. أضف خبراتك وتعليمك وشهاداتك.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.sort((a, b) => a.order - b.order).map((entry) => (
            <div
              key={entry.id}
              className="glass-card p-5 flex items-start gap-4 group hover:border-opacity-60 transition-all"
              style={{ borderColor: `${entry.color}30` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${entry.color}20`, border: `1px solid ${entry.color}40` }}
              >
                {entry.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-sm">{entry.title}</h3>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1"
                    style={{ background: `${entry.color}20`, color: entry.color, border: `1px solid ${entry.color}40` }}
                  >
                    {getTypeIcon(entry.type)}
                    {entry.type}
                  </span>
                </div>
                <p className="text-xs text-primary mb-1">{entry.organization} · {entry.period}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{entry.description}</p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md font-mono" style={{ background: `${entry.color}10`, color: `${entry.color}cc`, border: `1px solid ${entry.color}25` }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(entry)} className="p-2 rounded-lg border border-glass-border hover:bg-surface text-primary transition-colors">
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => { if (confirm('هل أنت متأكد من الحذف؟')) deleteMutation.mutate(entry.id); }}
                  className="p-2 rounded-lg border border-glass-border hover:bg-[rgba(239,68,68,0.1)] text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
