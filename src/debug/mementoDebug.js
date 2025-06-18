/**
 * Debug script for troubleshooting the Memento pattern implementation
 * 
 * Usage in browser console:
 * 1. Copy and paste this entire code
 * 2. Run: debugMementoPattern()
 * 3. Check the output for issues
 */

function debugMementoPattern() {
  console.log('🔍 DEBUG: Starting Memento Pattern Diagnosis');
  console.log('='.repeat(50));
  
  // 1. Check localStorage
  console.log('📦 STEP 1: Checking localStorage...');
  try {
    const data = localStorage.getItem('anime_form_drafts');
    console.log('Raw data:', data);
    
    if (data) {
      const parsed = JSON.parse(data);
      console.log('Parsed data type:', Array.isArray(parsed) ? 'array' : typeof parsed);
      console.log('Parsed data:', parsed);
      
      if (Array.isArray(parsed)) {
        console.log('✅ Data is an array with', parsed.length, 'items');
        parsed.forEach((item, index) => {
          console.log(`Item ${index}:`, item);
        });
      } else {
        console.log('❌ Data is not an array! This is the problem.');
        console.log('🔧 Fixing by clearing corrupted data...');
        localStorage.removeItem('anime_form_drafts');
        console.log('✅ Cleared corrupted data');
      }
    } else {
      console.log('ℹ️ No draft data found (this is normal for first use)');
    }
  } catch (error) {
    console.log('❌ Error reading localStorage:', error);
    console.log('🔧 Clearing corrupted data...');
    localStorage.removeItem('anime_form_drafts');
  }
  
  // 2. Test Map functionality
  console.log('\n🗺️ STEP 2: Testing Map functionality...');
  try {
    const testMap = new Map();
    testMap.set('test1', { value: 'hello' });
    testMap.set('test2', { value: 'world' });
    
    console.log('Map size:', testMap.size);
    console.log('Map entries:', Array.from(testMap.entries()));
    console.log('✅ Map functionality is working');
  } catch (error) {
    console.log('❌ Map functionality failed:', error);
  }
  
  // 3. Test Memento classes
  console.log('\n🧪 STEP 3: Testing Memento classes...');
  try {
    // This will only work if the classes are available in the global scope
    // You might need to import them manually
    console.log('ℹ️ This step requires the Memento classes to be imported');
    console.log('ℹ️ If you see an error here, it\'s normal in the console');
  } catch (error) {
    console.log('ℹ️ Cannot test classes from console (expected)');
  }
  
  // 4. General browser environment check
  console.log('\n🌐 STEP 4: Checking browser environment...');
  console.log('localStorage available:', typeof Storage !== 'undefined');
  console.log('window available:', typeof window !== 'undefined');
  console.log('Array.from available:', typeof Array.from === 'function');
  console.log('Map available:', typeof Map === 'function');
  console.log('JSON available:', typeof JSON === 'object');
  
  // 5. Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('1. If localStorage had corrupted data, it has been cleared');
  console.log('2. Refresh the page to start with clean state');
  console.log('3. If the error persists, check the network tab for import errors');
  console.log('4. Check if any browser extensions are interfering');
  
  console.log('\n✅ DEBUG COMPLETE');
  console.log('='.repeat(50));
}

// Make function available globally
if (typeof window !== 'undefined') {
  window.debugMementoPattern = debugMementoPattern;
}

// Also provide individual utility functions
if (typeof window !== 'undefined') {
  window.clearDrafts = () => {
    localStorage.removeItem('anime_form_drafts');
    console.log('✅ Cleared all drafts');
  };
  
  window.showDrafts = () => {
    const data = localStorage.getItem('anime_form_drafts');
    console.log('Draft data:', data ? JSON.parse(data) : 'No data');
  };
}

console.log('🔧 Debug tools loaded! Run debugMementoPattern() to diagnose issues');
console.log('🔧 Additional commands: clearDrafts(), showDrafts()');

export { debugMementoPattern };
