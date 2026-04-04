'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useVault } from '@/modules/vault/VaultProvider';
import { Card } from '@/shared/ui/Card';
import type { PensionDocument } from '@/shared/types';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ACCEPTED_EXT = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
const MAX_SIZE = 25 * 1024 * 1024;

function iconForType(mime: string): string {
  if (mime === 'application/pdf') return '📄';
  if (mime.startsWith('image/')) return '🖼️';
  return '📎';
}

export function UploadZone() {
  const { addDocument, registerUploadTrigger } = useVault();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openFilePicker = useCallback(() => inputRef.current?.click(), []);

  useEffect(() => {
    registerUploadTrigger(openFilePicker);
  }, [registerUploadTrigger, openFilePicker]);

  function processFiles(files: FileList | null) {
    if (!files) return;
    setError(null);

    for (const file of Array.from(files)) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXT.includes(ext)) {
        setError(`"${file.name}" is not a supported file type.`);
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" exceeds the 25 MB limit.`);
        continue;
      }

      const doc: PensionDocument = {
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        country: 'FR',
        flag: '🇫🇷',
        source: 'User upload',
        status: 'pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        type: file.type.split('/').pop()?.toUpperCase() || 'FILE',
        icon: iconForType(file.type),
        fileUrl: URL.createObjectURL(file),
        fileType: file.type,
        fileSize: file.size,
      };
      addDocument(doc);
    }
  }

  return (
    <Card>
      <div
        className="rounded-xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-200 text-center"
        style={{
          border: dragging ? '1.5px dashed var(--gold-border)' : '1.5px dashed var(--navy-5)',
          background: dragging ? 'var(--gold-dim)' : 'transparent',
        }}
        onClick={openFilePicker}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); processFiles(e.dataTransfer.files); }}
        onMouseEnter={(e) => { if (!dragging) { e.currentTarget.style.borderColor = 'var(--gold-border)'; e.currentTarget.style.background = 'var(--gold-dim)'; } }}
        onMouseLeave={(e) => { if (!dragging) { e.currentTarget.style.borderColor = 'var(--navy-5)'; e.currentTarget.style.background = 'transparent'; } }}
      >
        <div className="text-[28px]">📄</div>
        <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Drop files here or click to upload</div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Supports PDF, JPG, PNG, DOCX up to 25MB</div>
        <div className="flex gap-2 mt-2">
          {['PDF', 'JPG', 'PNG', 'DOCX'].map((t) => (
            <span key={t} className="text-[11px] px-3 py-1 rounded-[20px]"
              style={{ background: 'var(--navy-3)', border: '1px solid var(--border)', color: 'var(--text-dim)' }}>
              {t}
            </span>
          ))}
        </div>
        {error && <div className="text-[12px] mt-2" style={{ color: 'var(--red)' }}>{error}</div>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.docx"
        multiple
        className="hidden"
        onChange={(e) => { processFiles(e.target.files); e.target.value = ''; }}
      />
    </Card>
  );
}
