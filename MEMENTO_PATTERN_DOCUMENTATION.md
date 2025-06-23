# Memento Design Pattern Implementation for Anime Form

## Overview
This implementation uses the Memento design pattern to provide draft functionality for the anime creation form. Users can save their progress as drafts and retrieve old data when changing pages or returning to the form later.

## Design Pattern Components

### 1. Memento (`AnimeFormMemento`)
- **Purpose**: Stores a snapshot of the anime form state
- **Location**: `src/lib/memento/AnimeFormMemento.ts`
- **Responsibilities**:
  - Encapsulates the form state
  - Provides read-only access to the stored state
  - Maintains timestamp and metadata

### 2. Originator (`AnimeFormOriginator`)
- **Purpose**: Creates and restores from mementos
- **Location**: `src/lib/memento/AnimeFormMemento.ts`
- **Responsibilities**:
  - Manages current form state
  - Creates memento snapshots
  - Restores state from mementos
  - Detects significant changes

### 3. Caretaker (`AnimeFormCaretaker`)
- **Purpose**: Manages multiple mementos and provides persistence
- **Location**: `src/lib/memento/AnimeFormMemento.ts`
- **Responsibilities**:
  - Stores and retrieves mementos
  - Provides draft management operations
  - Handles localStorage persistence
  - Manages draft lifecycle (cleanup, limits)

## Features Implemented

### Core Draft Functionality
1. **Save Draft**: Users can manually save their current form state
2. **Load Draft**: Users can restore previously saved drafts
3. **Auto-save**: Automatic draft saving every 30 seconds
4. **Draft Management**: View, load, and delete multiple drafts

### User Experience Enhancements
1. **Unsaved Changes Warning**: Alerts users before leaving with unsaved changes
2. **Visual Indicators**: Shows when there are unsaved changes
3. **Draft Preview**: Displays draft metadata (title, episodes, genres, etc.)
4. **Timestamp Display**: Shows when each draft was created

### Data Persistence
1. **localStorage**: Drafts persist between browser sessions
2. **Cleanup**: Automatic cleanup of old drafts (max 10 drafts)
3. **Error Handling**: Graceful handling of storage errors

## Files Structure

```
src/
├── lib/
│   └── memento/
│       └── AnimeFormMemento.ts          # Core pattern implementation
├── hooks/
│   └── useDraftManager.ts               # React hook for draft management
├── components/
│   └── DraftManager.tsx                 # UI component for draft management
└── app/(authenticated)/animes/addNewAnime/
    └── AddNewAnime.tsx                  # Updated form with draft functionality
```

## Usage Example

```typescript
// In a React component
const draftManager = useDraftManager();

// Save current form state as draft
const draftKey = draftManager.saveDraft("My Anime Draft");

// Load a specific draft
draftManager.loadDraft(draftKey);

// Check for unsaved changes
if (draftManager.hasUnsavedChanges()) {
  // Show warning
}

// Get all saved drafts
const drafts = draftManager.getAllDrafts();
```

## Benefits of This Implementation

1. **Separation of Concerns**: Clear separation between state management, persistence, and UI
2. **Extensibility**: Easy to extend for other forms in the application
3. **Performance**: Efficient state management with minimal re-renders
4. **User Experience**: Prevents data loss and improves workflow
5. **Maintainability**: Clean, well-structured code following design patterns

## Configuration Options

### Auto-save Settings
```typescript
// Enable auto-save with custom interval
draftManager.enableAutoSave(60000); // Save every minute

// Disable auto-save
draftManager.disableAutoSave();
```

### Storage Limits
- Maximum drafts: 10 (configurable in `AnimeFormCaretaker`)
- Storage key: 'anime_form_drafts' (configurable)
- Auto-cleanup: Oldest drafts are removed when limit is exceeded

## Error Handling

The implementation includes robust error handling for:
- localStorage quota exceeded
- Invalid draft data
- Missing dependencies
- Browser compatibility issues

## Future Enhancements

1. **Cloud Storage**: Sync drafts across devices
2. **Collaborative Drafts**: Share drafts with team members
3. **Version History**: Track changes over time
4. **Export/Import**: Backup and restore drafts
5. **Templates**: Create reusable form templates
