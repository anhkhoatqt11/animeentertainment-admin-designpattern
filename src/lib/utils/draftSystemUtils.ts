/**
 * Utility functions to handle draft system issues and recovery
 */

export const draftSystemUtils = {
  /**
   * Clear all draft data from localStorage
   */
  clearAllDraftData(): void {
    try {
      localStorage.removeItem('anime_form_drafts');
      console.log('✅ Cleared all draft data from localStorage');
    } catch (error) {
      console.error('❌ Failed to clear draft data:', error);
    }
  },

  /**
   * Validate localStorage draft data structure
   */
  validateDraftData(): boolean {
    try {
      const data = localStorage.getItem('anime_form_drafts');
      if (!data) return true; // No data is valid
      
      const parsed = JSON.parse(data);
      
      // Check if it's an array
      if (!Array.isArray(parsed)) {
        console.warn('⚠️ Draft data is not an array');
        return false;
      }
      
      // Check each item structure
      for (const item of parsed) {
        if (!item.key || !item.state) {
          console.warn('⚠️ Invalid draft item structure:', item);
          return false;
        }
      }
      
      console.log('✅ Draft data validation passed');
      return true;
    } catch (error) {
      console.error('❌ Draft data validation failed:', error);
      return false;
    }
  },

  /**
   * Repair or reset draft system
   */
  repairDraftSystem(): void {
    console.log('🔧 Attempting to repair draft system...');
    
    if (!this.validateDraftData()) {
      console.log('🗑️ Clearing corrupted draft data...');
      this.clearAllDraftData();
    }
    
    // Test basic functionality
    try {
      const testMap = new Map();
      testMap.set('test', 'value');
      Array.from(testMap.entries());
      console.log('✅ Map functionality test passed');
    } catch (error) {
      console.error('❌ Map functionality test failed:', error);
    }
  },

  /**
   * Get debug information about the draft system
   */
  getDraftSystemInfo(): object {
    try {
      const data = localStorage.getItem('anime_form_drafts');
      const parsed = data ? JSON.parse(data) : null;
      
      return {
        hasData: !!data,
        dataType: Array.isArray(parsed) ? 'array' : typeof parsed,
        itemCount: Array.isArray(parsed) ? parsed.length : 0,
        dataSize: data ? data.length : 0,
        isValid: this.validateDraftData(),
        storageAvailable: typeof Storage !== 'undefined',
        rawData: parsed
      };
    } catch (error) {
      return {
        error: error.message,
        hasData: false,
        isValid: false
      };
    }
  },
  /**
   * Emergency reset - use only when all else fails
   */
  emergencyReset(): void {
    console.log('🚨 Performing emergency reset of draft system...');
    
    // Clear all draft-related localStorage items
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('draft') || key.includes('anime_form'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed: ${key}`);
      } catch (error) {
        console.error(`❌ Failed to remove ${key}:`, error);
      }
    });
    
    console.log('✅ Emergency reset completed');
  }
};

// Export for browser console debugging
if (typeof window !== 'undefined') {
  (window as any).draftSystemUtils = draftSystemUtils;
}

export default draftSystemUtils;
