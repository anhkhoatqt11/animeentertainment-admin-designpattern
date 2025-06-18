import { useEffect, useRef, useState } from 'react';
import { AnimeFormOriginator, AnimeFormCaretaker, AnimeFormMemento, AnimeFormState } from '@/lib/memento/AnimeFormMemento';

export interface UseDraftManagerReturn {
  // Draft operations
  saveDraft: (name?: string) => string;
  loadDraft: (key: string) => void;
  deleteDraft: (key: string) => void;
  clearAllDrafts: () => void;
  
  // Auto-save functionality
  enableAutoSave: (interval?: number) => void;
  disableAutoSave: () => void;
  
  // Draft management
  getAllDrafts: () => Array<{ key: string; memento: AnimeFormMemento }>;
  hasUnsavedChanges: () => boolean;
  
  // Form state management
  updateFormState: (state: Partial<AnimeFormState>) => void;
  getCurrentState: () => AnimeFormState;
  restoreState: (setters: FormSetters) => void;
}

export interface FormSetters {
  setLandspaceImage: (value: any[]) => void;
  setCoverImage: (value: any[]) => void;
  setMovieName: (value: string) => void;
  setDescription: (value: string) => void;
  setGenreSelected: (value: any[]) => void;
  setPublisher: (value: string) => void;
  setWeeklyTime: (value: string) => void;
  setAgeFor: (value: any) => void;
  setEpisodeList: (value: any[]) => void;
}

export const useDraftManager = (): UseDraftManagerReturn => {
  const originatorRef = useRef<AnimeFormOriginator>(new AnimeFormOriginator());
  const caretakerRef = useRef<AnimeFormCaretaker>(new AnimeFormCaretaker());
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedStateRef = useRef<string>('');

  const [, forceUpdate] = useState({});

  useEffect(() => {
    // Cleanup auto-save on unmount
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);
  const saveDraft = (name?: string): string => {
    try {
      const originator = originatorRef.current;
      const caretaker = caretakerRef.current;
      
      const memento = originator.createMemento();
      const key = caretaker.generateDraftKey(name || originator.getState().movieName);
      
      caretaker.saveMemento(key, memento);
      lastSavedStateRef.current = JSON.stringify(originator.getState());
      
      return key;
    } catch (error) {
      console.error('Error saving draft:', error);
      return '';
    }
  };
  const loadDraft = (key: string): void => {
    try {
      const originator = originatorRef.current;
      const caretaker = caretakerRef.current;
      
      const memento = caretaker.getMemento(key);
      if (memento) {
        originator.restoreFromMemento(memento);
        lastSavedStateRef.current = JSON.stringify(originator.getState());
        forceUpdate({});
      } else {
        console.warn(`Draft with key "${key}" not found`);
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const deleteDraft = (key: string): void => {
    const caretaker = caretakerRef.current;
    caretaker.deleteDraft(key);
    forceUpdate({});
  };

  const clearAllDrafts = (): void => {
    const caretaker = caretakerRef.current;
    caretaker.clearAllDrafts();
    forceUpdate({});
  };

  const enableAutoSave = (interval: number = 30000): void => {
    disableAutoSave(); // Clear existing interval
    
    autoSaveIntervalRef.current = setInterval(() => {
      const originator = originatorRef.current;
      if (originator.hasSignificantChanges() && hasUnsavedChanges()) {
        saveDraft('auto_save');
      }
    }, interval);
  };

  const disableAutoSave = (): void => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  };
  const getAllDrafts = () => {
    try {
      return caretakerRef.current.getAllDrafts();
    } catch (error) {
      console.error('Error getting drafts:', error);
      return [];
    }
  };

  const hasUnsavedChanges = (): boolean => {
    const currentState = JSON.stringify(originatorRef.current.getState());
    return currentState !== lastSavedStateRef.current;
  };

  const updateFormState = (state: Partial<AnimeFormState>): void => {
    originatorRef.current.setState(state);
  };

  const getCurrentState = (): AnimeFormState => {
    return originatorRef.current.getState();
  };

  const restoreState = (setters: FormSetters): void => {
    const state = originatorRef.current.getState();
    
    setters.setLandspaceImage(state.landspaceImage);
    setters.setCoverImage(state.coverImage);
    setters.setMovieName(state.movieName);
    setters.setDescription(state.description);
    setters.setGenreSelected(state.genreSelected);
    setters.setPublisher(state.publisher);
    setters.setWeeklyTime(state.weeklyTime);
    setters.setAgeFor(state.ageFor);
    setters.setEpisodeList(state.episodeList);
  };

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    clearAllDrafts,
    enableAutoSave,
    disableAutoSave,
    getAllDrafts,
    hasUnsavedChanges,
    updateFormState,
    getCurrentState,
    restoreState,
  };
};
