import { useState, useEffect } from 'react';
import { NoteTemplate } from '@/types/invoice';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'invoicepk_note_templates';

export const useNoteTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<NoteTemplate[]>([]);

  // Load templates from localStorage on mount
  useEffect(() => {
    if (!user) {
      setTemplates([]);
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
  }, [user]);

  // Save templates to localStorage whenever they change
  const saveTemplates = (newTemplates: NoteTemplate[]) => {
    if (!user) return;
    localStorage.setItem(`${STORAGE_KEY}_${user.uid}`, JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const addTemplate = (name: string, content: string) => {
    const newTemplate: NoteTemplate = {
      id: crypto.randomUUID(),
      name,
      content,
      createdAt: new Date().toISOString(),
    };
    saveTemplates([...templates, newTemplate]);
    return newTemplate;
  };

  const deleteTemplate = (id: string) => {
    saveTemplates(templates.filter((t) => t.id !== id));
  };

  const updateTemplate = (id: string, name: string, content: string) => {
    saveTemplates(
      templates.map((t) =>
        t.id === id ? { ...t, name, content } : t
      )
    );
  };

  return { templates, addTemplate, deleteTemplate, updateTemplate };
};
