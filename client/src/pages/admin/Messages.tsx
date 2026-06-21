import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Archive, CheckCircle, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { messagesAPI } from '../../lib/api';
import { useAdminTranslation } from '../../lib/adminTranslations';
import type { Message } from '../../types';

export default function MessagesCenter() {
  const { t } = useAdminTranslation();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => messagesAPI.getAll().then((r) => r.data as Message[]),
  });

  const readMutation = useMutation({
    mutationFn: (id: string) => messagesAPI.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Inquiry marked as read');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => messagesAPI.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Inquiry archived');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => messagesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Inquiry deleted');
    },
    onError: () => toast.error('Failed to delete inquiry'),
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('deleteInquiryConfirm'))) {
      deleteMutation.mutate(id);
    }
  };

  const unreadCount = messages?.filter((m) => m.status === 'unread').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide">{t('inquiryCenter')}</h1>
          <p className="text-xs text-gray-400">{t('inquiryCenterDesc')}</p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(38,239,253,0.3)] bg-[rgba(38,239,253,0.1)] text-primary text-xs font-mono shadow-neon-sm">
            <AlertCircle size={14} className="animate-pulse text-[#FF2E93]" /> <span className="text-[#FF2E93] font-bold">{unreadCount} {t('pending')}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : (
        <div className="space-y-4">
          {messages?.length === 0 ? (
            <div className="glass-card p-12 text-center text-gray-500 space-y-2">
              <Mail className="mx-auto w-12 h-12 opacity-30 text-primary" />
              <p className="font-mono text-sm">{t('emptyInbox')}</p>
            </div>
          ) : (
            messages?.map((msg) => {
              const isUnread = msg.status === 'unread';
              const timeString = msg.created_at
                ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })
                : 'some time ago';

              return (
                <div
                  key={msg.id}
                  className={`glass-card p-6 border transition-all ${
                    isUnread
                      ? 'border-[rgba(38,239,253,0.4)] bg-[rgba(38,239,253,0.03)] shadow-neon-sm'
                      : 'border-glass-border'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                          isUnread ? 'bg-[rgba(38,239,253,0.15)] border-primary text-primary' : 'bg-surface border-glass-border text-gray-500'
                        }`}
                      >
                        <MessageSquare size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-2">
                          {msg.name}
                          {isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          )}
                        </h4>
                        <p className="text-xs text-gray-400 font-mono">
                          {msg.email} &bull; {timeString}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isUnread && (
                        <button
                          onClick={() => readMutation.mutate(msg.id)}
                          title={t('markRead')}
                          className="p-2 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {msg.status !== 'archived' && (
                        <button
                          onClick={() => archiveMutation.mutate(msg.id)}
                          title={t('archive')}
                          className="p-2 border border-glass-border hover:border-primary hover:text-primary rounded-lg text-gray-400 transition-colors"
                        >
                          <Archive size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(msg.id)}
                        title={t('delete')}
                        className="p-2 border border-glass-border hover:border-red-500 hover:text-red-500 rounded-lg text-gray-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="pl-12 space-y-2">
                    <div className="text-xs font-bold font-mono text-primary uppercase tracking-wider">
                      {t('subject')}: {msg.subject}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed max-w-3xl whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
