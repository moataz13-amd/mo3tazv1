import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Link2, Eye, FileImage } from 'lucide-react';
import toast from 'react-hot-toast';
import { mediaAPI } from '../../lib/api';
import type { MediaFile } from '../../types';

export default function MediaManager() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['mediaFiles'],
    queryFn: () => mediaAPI.getAll().then((r) => r.data as MediaFile[]),
  });

  const uploadMutation = useMutation({
    mutationFn: (data: FormData) => mediaAPI.upload(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaFiles'] });
      toast.success('File uploaded successfully');
    },
    onError: () => toast.error('Failed to upload file'),
    onSettled: () => setUploading(false),
  });

  const deleteMutation = useMutation({
    mutationFn: (publicId: string) => mediaAPI.delete(publicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaFiles'] });
      toast.success('File deleted successfully');
    },
    onError: () => toast.error('Failed to delete file'),
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    uploadMutation.mutate(formData);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleDelete = (publicId: string) => {
    if (window.confirm('Delete this media asset permanently?')) {
      deleteMutation.mutate(publicId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Media Manager</h1>
          <p className="text-xs text-gray-400">Upload, organize, and manage Cloudinary media assets</p>
        </div>

        <label className={`neon-btn-solid px-4 py-2 text-xs font-bold flex items-center gap-1.5 rounded-lg cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Asset'}
          <input type="file" onChange={handleUpload} className="hidden" accept="image/*,video/*" />
        </label>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mediaFiles?.map((file) => (
            <div key={file.id} className="glass-card group overflow-hidden">
              <div className="h-40 bg-[rgba(11,18,36,0.5)] border-b border-glass-border relative flex items-center justify-center overflow-hidden">
                {file.resource_type === 'image' ? (
                  <img src={file.url} alt="asset" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-2">
                    <FileImage size={24} />
                    <span className="text-[10px] font-mono">{file.format.toUpperCase()} VIDEO</span>
                  </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-[rgba(5,8,22,0.85)] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={file.url} target="_blank" rel="noreferrer" title="Preview" className="w-8 h-8 rounded-lg bg-surface border border-glass-border hover:border-primary text-gray-400 hover:text-primary flex items-center justify-center transition-colors">
                    <Eye size={14} />
                  </a>
                  <button onClick={() => handleCopyLink(file.url)} title="Copy Link" className="w-8 h-8 rounded-lg bg-surface border border-glass-border hover:border-primary text-gray-400 hover:text-primary flex items-center justify-center transition-colors">
                    <Link2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(file.public_id)} title="Delete" className="w-8 h-8 rounded-lg bg-surface border border-glass-border hover:border-red-500 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <div className="text-[10px] font-mono text-gray-400 truncate">{file.public_id}</div>
                <div className="text-[9px] font-mono text-gray-500 mt-0.5">
                  {(file.size / 1024).toFixed(1)} KB &bull; {file.format.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
