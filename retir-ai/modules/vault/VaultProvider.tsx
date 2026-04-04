'use client';

import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect, ReactNode } from 'react';
import { useDataStage } from '@/modules/identity/DataStageProvider';
import { documentsBefore, documentsAfter } from '@/modules/vault/data/mock-data';
import type { PensionDocument, Country, DocStatus, SourceType, DocCategory } from '@/shared/types';

export type GroupMode = 'category' | 'country' | 'flat';

export interface VaultFilters {
  status: DocStatus | 'all';
  country: Country | 'all';
  sourceType: SourceType | 'all';
  category: DocCategory | 'all';
  search: string;
}

interface VaultContextType {
  documents: PensionDocument[];
  filteredDocuments: PensionDocument[];
  filters: VaultFilters;
  setFilters: (update: Partial<VaultFilters>) => void;
  groupMode: GroupMode;
  setGroupMode: (v: GroupMode) => void;
  selectedDocument: PensionDocument | null;
  setSelectedDocument: (doc: PensionDocument | null) => void;
  addDocument: (doc: PensionDocument) => void;
  removeDocument: (id: string) => void;
  updateDocumentStatus: (id: string, status: DocStatus) => void;
  triggerUpload: () => void;
  registerUploadTrigger: (fn: () => void) => void;
}

const VaultContext = createContext<VaultContextType>({} as VaultContextType);

export function VaultProvider({ children }: { children: ReactNode }) {
  const { stage } = useDataStage();
  const [uploaded, setUploaded] = useState<PensionDocument[]>([]);
  const [filters, setFiltersState] = useState<VaultFilters>({ status: 'all', country: 'all', sourceType: 'all', category: 'all', search: '' });
  const [groupMode, setGroupMode] = useState<GroupMode>('category');
  const [selectedDocument, setSelectedDocument] = useState<PensionDocument | null>(null);
  const uploadTriggerRef = useRef<() => void>(() => {});

  const baseDocuments = stage === 'after' ? documentsAfter : documentsBefore;
  const documents = useMemo(() => [...baseDocuments, ...uploaded], [baseDocuments, uploaded]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      if (filters.status !== 'all' && d.status !== filters.status) return false;
      if (filters.country !== 'all' && d.country !== filters.country) return false;
      if (filters.sourceType !== 'all' && d.sourceType !== filters.sourceType) return false;
      if (filters.category !== 'all' && d.category !== filters.category) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!d.name.toLowerCase().includes(q) && !d.source.toLowerCase().includes(q) && !d.type.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [documents, filters]);

  const setFilters = useCallback((update: Partial<VaultFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...update }));
  }, []);

  const addDocument = useCallback((doc: PensionDocument) => {
    setUploaded((prev) => [...prev, doc]);
  }, []);

  const removeDocument = useCallback((id: string) => {
    setUploaded((prev) => {
      const doc = prev.find((d) => d.id === id);
      if (doc?.fileUrl) URL.revokeObjectURL(doc.fileUrl);
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const updateDocumentStatus = useCallback((id: string, status: DocStatus) => {
    setUploaded((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }, []);

  const registerUploadTrigger = useCallback((fn: () => void) => {
    uploadTriggerRef.current = fn;
  }, []);

  const triggerUpload = useCallback(() => {
    uploadTriggerRef.current();
  }, []);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      uploaded.forEach((d) => { if (d.fileUrl) URL.revokeObjectURL(d.fileUrl); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <VaultContext.Provider value={{
      documents, filteredDocuments, filters, setFilters,
      groupMode, setGroupMode,
      selectedDocument, setSelectedDocument,
      addDocument, removeDocument, updateDocumentStatus,
      triggerUpload, registerUploadTrigger,
    }}>
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  return useContext(VaultContext);
}
