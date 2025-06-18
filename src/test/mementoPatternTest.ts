/**
 * Simple test script for Memento pattern implementation
 * Run this in the browser console to test the pattern
 */

// Test the Memento pattern classes
import { AnimeFormOriginator, AnimeFormCaretaker, AnimeFormState } from '../lib/memento/AnimeFormMemento';

export function testMementoPattern() {
  console.log('🧪 Testing Memento Pattern Implementation');
  
  // Create instances
  const originator = new AnimeFormOriginator();
  const caretaker = new AnimeFormCaretaker();
  
  console.log('✅ Created Originator and Caretaker');
  
  // Test 1: Initial state
  const initialState = originator.getState();
  console.log('📋 Initial state:', initialState);
  
  // Test 2: Update state
  originator.setState({
    movieName: 'Test Anime',
    description: 'A test anime description',
    publisher: 'Test Studio',
    genreSelected: ['Action', 'Adventure']
  });
  
  console.log('📝 Updated state:', originator.getState());
  
  // Test 3: Create and save memento
  const memento1 = originator.createMemento();
  caretaker.saveMemento('test_draft_1', memento1);
  console.log('💾 Saved first memento');
  
  // Test 4: Update state again
  originator.setState({
    movieName: 'Updated Anime',
    description: 'Updated description',
    episodeList: [{ episodeName: 'Episode 1', coverImage: '', content: '', adLink: '', views: 0, totalTime: 1200 }]
  });
  
  console.log('📝 Updated state again:', originator.getState());
  
  // Test 5: Create and save another memento
  const memento2 = originator.createMemento();
  caretaker.saveMemento('test_draft_2', memento2);
  console.log('💾 Saved second memento');
  
  // Test 6: Restore from first memento
  const retrievedMemento = caretaker.getMemento('test_draft_1');
  if (retrievedMemento) {
    originator.restoreFromMemento(retrievedMemento);
    console.log('🔄 Restored from first memento:', originator.getState());
  }
  
  // Test 7: List all drafts
  const allDrafts = caretaker.getAllDrafts();
  console.log('📑 All drafts:', allDrafts.map(d => ({ 
    key: d.key, 
    movieName: d.memento.getState().movieName,
    timestamp: new Date(d.memento.getTimestamp()).toLocaleString()
  })));
  
  // Test 8: Check for significant changes
  console.log('🔍 Has significant changes:', originator.hasSignificantChanges());
  
  // Test 9: Clear all drafts
  caretaker.clearAllDrafts();
  console.log('🗑️ Cleared all drafts. Remaining:', caretaker.getAllDrafts().length);
  
  console.log('✅ All tests completed successfully!');
  
  return {
    originator,
    caretaker,
    success: true
  };
}

// Usage example in browser console:
// import { testMementoPattern } from './path/to/this/file';
// testMementoPattern();

export default testMementoPattern;
