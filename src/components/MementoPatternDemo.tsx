import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useDraftManager } from '@/hooks/useDraftManager';
import { Save, FileText, RotateCcw } from 'lucide-react';

/**
 * Demo component showing Memento pattern usage
 * This demonstrates the core concepts without the full form complexity
 */
export const MementoPatternDemo: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const draftManager = useDraftManager();

  // Simulate form state updates for the demo
  React.useEffect(() => {
    draftManager.updateFormState({
      movieName: name,
      description,
      genreSelected: tags,
      landspaceImage: [],
      coverImage: [],
      publisher: '',
      weeklyTime: '',
      ageFor: new Set([]),
      episodeList: [],
      timestamp: Date.now(),
      pageName: 'demo'
    });
  }, [name, description, tags]);

  const handleSaveDraft = () => {
    const key = draftManager.saveDraft(name || 'Demo Draft');
    console.log('Draft saved with key:', key);
  };

  const handleLoadLastDraft = () => {
    const drafts = draftManager.getAllDrafts();
    if (drafts.length > 0) {
      const lastDraft = drafts[0];
      draftManager.loadDraft(lastDraft.key);
      
      // Restore form state
      const state = draftManager.getCurrentState();
      setName(state.movieName);
      setDescription(state.description);
      setTags(state.genreSelected);
    }
  };

  const handleClearForm = () => {
    setName('');
    setDescription('');
    setTags([]);
  };

  const drafts = draftManager.getAllDrafts();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Memento Pattern Demo</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter name..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              placeholder="Enter description..."
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              startContent={<Save className="w-4 h-4" />}
              onClick={handleSaveDraft}
              color="primary"
            >
              Save Draft
            </Button>
            
            <Button
              startContent={<FileText className="w-4 h-4" />}
              onClick={handleLoadLastDraft}
              color="secondary"
              disabled={drafts.length === 0}
            >
              Load Last Draft
            </Button>
            
            <Button
              startContent={<RotateCcw className="w-4 h-4" />}
              onClick={handleClearForm}
              variant="flat"
            >
              Clear Form
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Status</h3>
            <div className="space-y-1 text-sm">
              <p>Saved Drafts: {drafts.length}</p>
              <p>Has Unsaved Changes: {draftManager.hasUnsavedChanges() ? 'Yes' : 'No'}</p>
              <p>Current State: {name || description ? 'Has Data' : 'Empty'}</p>
            </div>
          </div>

          {drafts.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Recent Drafts</h3>
              <div className="space-y-2">
                {drafts.slice(0, 3).map(({ key, memento }) => {
                  const state = memento.getState();
                  return (
                    <div key={key} className="p-2 bg-gray-50 rounded text-sm">
                      <div className="font-medium">{state.movieName || 'Untitled'}</div>
                      <div className="text-gray-600">
                        {new Date(memento.getTimestamp()).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
