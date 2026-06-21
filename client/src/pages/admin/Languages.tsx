import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Save, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { languagesAPI } from '../../lib/api';
import type { Language } from '../../types';

const colorOptions = ['#00E5FF', '#4F46E5', '#f59e0b', '#10b981', '#06B6D4', '#8b5cf6', '#ef4444', '#ec4899'];

const flagOptions = ['🇸🇦', '🇬🇧', '🇺🇸', '🇫🇷', '🇩🇪', '🇪🇸', '🇮🇹', '🇹🇷', '🇯🇵', '🇨🇳', '🇰🇷', '🇷🇺', '🇧🇷', '🇮🇳', '🇪🇬'];

const defaultForm = {
  name: '',
  level: 'Professional',
  proficiency: 80,
  flag: '🇸🇦',
  color: '#00E5FF',
  description: '',
  order: 0,
};

export default function LanguagesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['languages'],
    queryFn: () => languagesAPI.getAll().then((r) => r.data as Language[]),
  });

  const createMutation = useMutation({
    mutationFn: (data: object) => languagesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('تمت إضافة اللغة بنجاح');
      resetForm();
    },
    onError: () => toast.error('فشل في إضافة اللغة'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: object }) => languagesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('تم التحديث بنجاح');
      resetForm();
    },
    onError: () => toast.error('فشل في التحديث'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => languagesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['languages'] });
      toast.success('تم الحذف بنجاح');
    },
    onError: () => toast.error('فشل في الحذف'),
  });

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (lang: Language) => {
    setForm({
      name: lang.name,
      level: lang.level,
      proficiency: lang.proficiency,
      flag: lang.flag,
      color: lang.color,
      description: lang.description,
      order: lang.order,
    });
    setEditingId(lang.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      proficiency: Number(form.proficiency),
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Languages</h1>
          <p className="text-xs text-gray-400">إدارة اللغات ومستوى الإتقان</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="neon-btn-solid px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Plus size={14} /> إضافة لغة
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6 space-y-4 border-primary/30">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-white text-sm">
              {editingId ? 'تعديل اللغة' : 'إضافة لغة جديدة'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">اسم اللغة</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field text-sm"
                placeholder="مثال: Arabic"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">المستوى</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="input-field text-sm w-full"
              >
                <option value="Native">Native</option>
                <option value="Professional">Professional</option>
                <option value="Advanced">Advanced</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Beginner">Beginner</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">نسبة الإتقان ({form.proficiency}%)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={form.proficiency}
                onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
                className="w-full accent-[#00E5FF]"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">العلم</label>
              <div className="flex gap-2 flex-wrap">
                {flagOptions.map((f) => (
                  <button
                    key={f}
                    onClick={() => setForm({ ...form, flag: f })}
                    className="w-9 h-9 rounded-lg border-2 flex items-center justify-center text-xl transition-all"
                    style={{
                      borderColor: form.flag === f ? '#00E5FF' : 'rgba(255,255,255,0.1)',
                      background: form.flag === f ? 'rgba(0,191,255,0.15)' : 'transparent',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
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

          <div>
            <label className="block text-xs font-mono text-gray-400 mb-1">الوصف</label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field text-sm"
              placeholder="مثال: Mother tongue — full professional fluency"
            />
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
      ) : languages.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-4xl mb-3">🌐</div>
          <p className="text-gray-400 text-sm">لا توجد لغات بعد. أضف اللغات التي تتقنها.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {languages.sort((a, b) => a.order - b.order).map((lang) => (
            <div
              key={lang.id}
              className="glass-card p-5 group hover:border-opacity-60 transition-all"
              style={{ borderColor: `${lang.color}30` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{lang.flag}</span>
                  <div>
                    <div className="font-bold text-white text-sm">{lang.name}</div>
                    <div className="text-xs" style={{ color: lang.color }}>{lang.level}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono" style={{ color: lang.color }}>
                    {lang.proficiency}%
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(lang)} className="p-1.5 rounded-lg border border-glass-border hover:bg-surface text-primary transition-colors">
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => { if (confirm('هل أنت متأكد من الحذف؟')) deleteMutation.mutate(lang.id); }}
                      className="p-1.5 rounded-lg border border-glass-border hover:bg-[rgba(239,68,68,0.1)] text-red-400 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar-track mb-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${lang.proficiency}%`,
                    background: `linear-gradient(90deg, ${lang.color}, ${lang.color}80)`,
                    boxShadow: `0 0 10px ${lang.color}60`,
                  }}
                />
              </div>

              {lang.description && (
                <p className="text-xs text-gray-400 mt-2">{lang.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
