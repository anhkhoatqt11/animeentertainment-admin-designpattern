// Memento Pattern Implementation for Anime Form

export interface AnimeFormState {
  // Basic Information
  landspaceImage: any[];
  coverImage: any[];
  movieName: string;
  description: string;
  genreSelected: any[];
  publisher: string;
  weeklyTime: string;
  ageFor: any;
  
  // Episode Information
  episodeList: any[];
  
  // Additional metadata
  timestamp: number;
  pageName: string;
}

/**
 * Memento - Stores the snapshot of anime form state
 */
export class AnimeFormMemento {
  private readonly state: AnimeFormState;

  constructor(state: AnimeFormState) {
    this.state = { ...state };
  }

  getState(): AnimeFormState {
    return { ...this.state };
  }

  getTimestamp(): number {
    return this.state.timestamp;
  }

  getPageName(): string {
    return this.state.pageName;
  }
}

/**
 * Originator - Creates and restores from mementos
 */
export class AnimeFormOriginator {
  private currentState: AnimeFormState;

  constructor() {
    this.currentState = this.getDefaultState();
  }

  private getDefaultState(): AnimeFormState {
    return {
      landspaceImage: [],
      coverImage: [],
      movieName: "",
      description: "",
      genreSelected: [],
      publisher: "",
      weeklyTime: "",
      ageFor: new Set([]),
      episodeList: [],
      timestamp: Date.now(),
      pageName: "addNewAnime"
    };
  }

  setState(state: Partial<AnimeFormState>): void {
    this.currentState = {
      ...this.currentState,
      ...state,
      timestamp: Date.now()
    };
  }

  getState(): AnimeFormState {
    return { ...this.currentState };
  }

  createMemento(): AnimeFormMemento {
    return new AnimeFormMemento(this.currentState);
  }

  restoreFromMemento(memento: AnimeFormMemento): void {
    this.currentState = memento.getState();
  }

  hasSignificantChanges(): boolean {
    const defaultState = this.getDefaultState();
    return (
      this.currentState.movieName !== defaultState.movieName ||
      this.currentState.description !== defaultState.description ||
      this.currentState.publisher !== defaultState.publisher ||
      this.currentState.weeklyTime !== defaultState.weeklyTime ||
      this.currentState.landspaceImage.length > 0 ||
      this.currentState.coverImage.length > 0 ||
      this.currentState.genreSelected.length > 0 ||
      this.currentState.episodeList.length > 0
    );
  }
}

/**
 * Caretaker - Manages mementos and provides draft functionality
 */
export class AnimeFormCaretaker {
  private mementos: Map<string, AnimeFormMemento> = new Map();
  private readonly maxMementos = 10;
  private readonly storageKey = 'anime_form_drafts';

  constructor() {
    this.loadFromStorage();
  }

  saveMemento(key: string, memento: AnimeFormMemento): void {
    this.mementos.set(key, memento);
    this.cleanup();
    this.saveToStorage();
  }

  getMemento(key: string): AnimeFormMemento | null {
    return this.mementos.get(key) || null;
  }
  getAllDrafts(): Array<{ key: string; memento: AnimeFormMemento }> {
    try {
      if (!this.mementos || typeof this.mementos.entries !== 'function') {
        console.warn('Mementos Map not properly initialized, reinitializing...');
        this.mementos = new Map();
        return [];
      }
      
      return Array.from(this.mementos.entries())
        .map(([key, memento]) => ({ key, memento }))
        .sort((a, b) => b.memento.getTimestamp() - a.memento.getTimestamp());
    } catch (error) {
      console.error('Error getting all drafts:', error);
      return [];
    }
  }

  deleteDraft(key: string): boolean {
    const deleted = this.mementos.delete(key);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  clearAllDrafts(): void {
    this.mementos.clear();
    this.saveToStorage();
  }

  private cleanup(): void {
    if (this.mementos.size > this.maxMementos) {
      const sorted = Array.from(this.mementos.entries())
        .sort(([, a], [, b]) => b.getTimestamp() - a.getTimestamp());
      
      this.mementos.clear();
      sorted.slice(0, this.maxMementos).forEach(([key, memento]) => {
        this.mementos.set(key, memento);
      });
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const data = Array.from(this.mementos.entries()).map(([key, memento]) => ({
          key,
          state: memento.getState()
        }));
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save drafts to storage:', error);
      }
    }
  }
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
          const parsed = JSON.parse(data);
          // Ensure parsed data is an array
          if (Array.isArray(parsed)) {
            parsed.forEach(({ key, state }: { key: string; state: AnimeFormState }) => {
              if (key && state) {
                this.mementos.set(key, new AnimeFormMemento(state));
              }
            });
          } else {
            console.warn('Invalid draft data format in localStorage, clearing...');
            localStorage.removeItem(this.storageKey);
          }
        }
      } catch (error) {
        console.error('Failed to load drafts from storage:', error);
        // Clear corrupted data
        try {
          localStorage.removeItem(this.storageKey);
        } catch (clearError) {
          console.error('Failed to clear corrupted storage:', clearError);
        }
      }
    }
  }

  generateDraftKey(movieName: string = ''): string {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_');
    const name = movieName.trim() || 'unnamed';
    return `${name}_${timestamp}`;
  }
}
