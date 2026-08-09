import { useRef, useState } from 'react';
import type { DragEvent, ReactNode } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileDropzoneProps {
  onFilesSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  className?: string;
  children?: ReactNode;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(',').some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
    return file.type.toLowerCase() === rule;
  });
}

export default function FileDropzone({
  onFilesSelect,
  accept,
  multiple = false,
  disabled = false,
  label,
  hint,
  className = '',
  children,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    let files = Array.from(fileList).filter((f) => matchesAccept(f, accept));
    if (!multiple) files = files.slice(0, 1);
    if (files.length > 0) onFilesSelect(files);
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    dragCounter.current++;
    if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer select-none ${
        isDragging
          ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(0,229,255,0.2)]'
          : 'border-glass-border hover:border-primary/60 hover:bg-surface/30'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      {children ?? (
        <>
          <UploadCloud
            size={28}
            className={isDragging ? 'text-primary animate-bounce' : 'text-gray-500'}
          />
          {label && <p className="text-xs font-bold text-white">{label}</p>}
          {hint && <p className="text-[10px] text-gray-500">{hint}</p>}
        </>
      )}
    </div>
  );
}
