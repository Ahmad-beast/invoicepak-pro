import { useState, useEffect } from 'react';
import { InvoiceTemplate } from '@/types/invoice';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'invoicepk_invoice_templates';

export const useInvoiceTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // Load templates from localStorage on mount
  useEffect(() => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem(`${STORAGE_KEY}_${user.uid}`);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch {
        setTemplates([]);
      }
    }
    setLoading(false);
  }, [user]);

  // Save templates to localStorage whenever they change
  const saveTemplates = (newTemplates: InvoiceTemplate[]) => {
    if (!user) return;
    localStorage.setItem(`${STORAGE_KEY}_${user.uid}`, JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const addTemplate = (template: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: InvoiceTemplate = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTemplates([...templates, newTemplate]);
    return newTemplate;
  };

  const deleteTemplate = (id: string) => {
    saveTemplates(templates.filter((t) => t.id !== id));
  };

  const updateTemplate = (id: string, updates: Partial<Omit<InvoiceTemplate, 'id' | 'createdAt'>>) => {
    saveTemplates(
      templates.map((t) =>
        t.id === id 
          ? { ...t, ...updates, updatedAt: new Date().toISOString() } 
          : t
      )
    );
  };

  const getTemplate = (id: string) => {
    return templates.find((t) => t.id === id);
  };

  return { 
    templates, 
    loading,
    addTemplate, 
    deleteTemplate, 
    updateTemplate,
    getTemplate 
  };
};
