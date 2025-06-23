# Memento Design Pattern - Draft Functionality

## 🎯 Overview

The Memento design pattern has been implemented to provide draft functionality for the anime creation form. This allows users to:

- Save their progress as drafts
- Retrieve old data when changing pages
- Auto-save their work periodically
- Manage multiple drafts with timestamps

## 🚀 Features

### ✨ Core Features
- **Manual Draft Saving**: Save current form state with custom names
- **Auto-save**: Automatic draft saving every 30 seconds
- **Draft Loading**: Restore previously saved drafts
- **Draft Management**: View, delete, and organize drafts
- **Unsaved Changes Warning**: Alerts before losing work
- **Persistent Storage**: Drafts survive browser sessions

### 🎨 User Interface
- **Draft Toolbar**: Quick access to save and manage drafts
- **Visual Indicators**: Shows unsaved changes status
- **Draft Manager Modal**: Full draft management interface
- **Draft Preview**: Shows draft metadata and content preview

## 📁 File Structure

```
src/
├── lib/memento/
│   └── AnimeFormMemento.ts          # Core Memento pattern classes
├── hooks/
│   └── useDraftManager.ts           # React hook for draft management
├── components/
│   ├── DraftManager.tsx             # Draft management UI
│   └── MementoPatternDemo.tsx       # Demo component
├── test/
│   └── mementoPatternTest.ts        # Test utilities
└── app/(authenticated)/animes/addNewAnime/
    └── AddNewAnime.tsx              # Updated form with drafts
```

## 🔧 How to Use

### For Users

1. **Creating Drafts**:
   - Fill out the anime form
   - Click "Lưu bản thảo" (Save Draft) button
   - Optionally provide a custom name

2. **Loading Drafts**:
   - Click "Quản lý bản thảo" (Manage Drafts) button
   - Select a draft from the list
   - Click "Tải" (Load) to restore the draft

3. **Auto-save**:
   - Work is automatically saved every 30 seconds
   - Auto-saved drafts appear in the draft list

4. **Managing Drafts**:
   - View all saved drafts with timestamps
   - Delete unwanted drafts
   - Clear all drafts at once

### For Developers

```typescript
// Import the hook
import { useDraftManager } from '@/hooks/useDraftManager';

// Use in component
const MyComponent = () => {
  const draftManager = useDraftManager();
  
  // Save current state
  const draftKey = draftManager.saveDraft('My Draft');
  
  // Load a specific draft
  draftManager.loadDraft(draftKey);
  
  // Check for changes
  if (draftManager.hasUnsavedChanges()) {
    // Handle unsaved changes
  }
  
  // Get all drafts
  const drafts = draftManager.getAllDrafts();
  
  return (
    // Your component JSX
  );
};
```

## 🏗️ Architecture

### Design Pattern Components

1. **Memento** (`AnimeFormMemento`):
   - Stores immutable snapshot of form state
   - Provides access to timestamp and metadata

2. **Originator** (`AnimeFormOriginator`):
   - Creates and restores from mementos
   - Manages current form state
   - Detects significant changes

3. **Caretaker** (`AnimeFormCaretaker`):
   - Manages collection of mementos
   - Handles persistence to localStorage
   - Provides draft lifecycle management

### Data Flow

```
Form State → useDraftManager → Originator → Memento → Caretaker → localStorage
     ↓                                                                    ↑
  UI Updates ←─────────────── State Restoration ←───────────────────────┘
```

## ⚙️ Configuration

### Auto-save Settings
```typescript
// Default: 30 seconds
draftManager.enableAutoSave(30000);

// Custom interval: 1 minute
draftManager.enableAutoSave(60000);

// Disable auto-save
draftManager.disableAutoSave();
```

### Storage Limits
- **Maximum drafts**: 10 (automatically cleaned up)
- **Storage location**: localStorage
- **Storage key**: 'anime_form_drafts'

## 🧪 Testing

Run the test utility to verify the implementation:

```typescript
import { testMementoPattern } from '@/test/mementoPatternTest';
testMementoPattern();
```

## 🔄 State Management

The form state includes:
- Basic information (name, description, publisher, etc.)
- Image uploads (landscape and cover images)
- Genre selections
- Episode list
- Age restrictions
- Timestamps and metadata

## 🛡️ Error Handling

The implementation handles:
- localStorage quota exceeded
- Invalid draft data
- Missing dependencies
- Browser compatibility issues
- Network failures during auto-save

## 🚀 Future Enhancements

1. **Cloud Sync**: Sync drafts across devices
2. **Collaboration**: Share drafts with team members
3. **Version History**: Track changes over time
4. **Export/Import**: Backup and restore functionality
5. **Templates**: Create reusable form templates
6. **Conflict Resolution**: Handle concurrent edits

## 📝 Examples

### Demo Component
Use the `MementoPatternDemo` component to see the pattern in action:

```typescript
import { MementoPatternDemo } from '@/components/MementoPatternDemo';

// Include in your page
<MementoPatternDemo />
```

### Manual Integration
```typescript
// In any form component
const [formData, setFormData] = useState(initialData);
const draftManager = useDraftManager();

// Update draft state when form changes
useEffect(() => {
  draftManager.updateFormState(formData);
}, [formData]);

// Save draft manually
const handleSave = () => {
  const key = draftManager.saveDraft(formData.name);
  toast.success(`Draft saved: ${key}`);
};
```

## 🤝 Contributing

When extending this functionality:

1. Follow the existing pattern structure
2. Update type definitions in `AnimeFormState`
3. Add appropriate error handling
4. Include tests for new features
5. Update documentation

## 📞 Support

For questions or issues:
1. Check the implementation documentation
2. Review the test cases
3. Examine the demo component
4. Check browser console for errors

## 📜 License

This implementation follows the project's existing license terms.

## 🔧 Troubleshooting

### Common Issues

#### "object is not iterable (cannot read property Symbol(Symbol.iterator))" Error

This error typically occurs when localStorage contains corrupted draft data. Here's how to fix it:

#### Quick Fix:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run: `localStorage.removeItem('anime_form_drafts')`
4. Refresh the page

#### Advanced Debugging:
1. Copy and paste the debug script from `src/debug/mementoDebug.js` into the console
2. Run: `debugMementoPattern()`
3. Follow the recommendations in the output

#### Using Debug Utilities:
```typescript
import draftSystemUtils from '@/lib/utils/draftSystemUtils';

// Check system status
console.log(draftSystemUtils.getDraftSystemInfo());

// Validate data
if (!draftSystemUtils.validateDraftData()) {
  draftSystemUtils.repairDraftSystem();
}

// Emergency reset (last resort)
draftSystemUtils.emergencyReset();
```

#### Browser Console Commands:
- `clearDrafts()` - Remove all draft data
- `showDrafts()` - Display current draft data
- `debugMementoPattern()` - Full system diagnosis

### Prevention

The updated implementation includes:
- ✅ Automatic data validation on load
- ✅ Error recovery mechanisms
- ✅ Corrupted data detection and cleanup
- ✅ Graceful fallback handling

### If Issues Persist

1. **Check Browser Compatibility**: Ensure your browser supports Map, localStorage, and ES6 features
2. **Disable Extensions**: Some browser extensions can interfere with localStorage
3. **Clear All Site Data**: Go to browser settings and clear all data for the site
4. **Check Network Tab**: Look for any import/module loading errors
