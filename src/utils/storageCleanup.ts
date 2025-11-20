/**
 * Storage cleanup utilities for fixing floating-point precision issues
 * in existing localStorage data
 */

import { sanitizeMonetaryData } from './currency';

/**
 * Clean all FairSplit data in localStorage
 * This function can be called to fix precision issues in existing data
 */
export const cleanAllStorageData = (): void => {
  const keys = ['fairsplit-data', 'fairsplit-backup', 'fairsplit-settings'];
  
  keys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        const sanitized = sanitizeMonetaryData(parsed);
        localStorage.setItem(key, JSON.stringify(sanitized));
        console.log(`Cleaned storage data for key: ${key}`);
      }
    } catch (error) {
      console.warn(`Failed to clean storage data for key ${key}:`, error);
    }
  });
};

/**
 * Migrate old data format to new precision-safe format
 * This handles backward compatibility for users with existing data
 */
export const migrateStorageData = (): void => {
  try {
    const data = localStorage.getItem('fairsplit-data');
    if (data) {
      const parsed = JSON.parse(data);
      
      // Check if migration is needed
      if (parsed.version !== '2.0') {
        console.log('Migrating storage data to precision-safe format...');
        
        // Sanitize all monetary values
        const migrated = {
          ...sanitizeMonetaryData(parsed),
          version: '2.0',
          migratedAt: new Date().toISOString()
        };
        
        // Save migrated data
        localStorage.setItem('fairsplit-data', JSON.stringify(migrated));
        
        // Create backup of original data
        localStorage.setItem('fairsplit-data-backup', data);
        
        console.log('Storage data migration completed successfully');
      }
    }
  } catch (error) {
    console.error('Failed to migrate storage data:', error);
  }
};

/**
 * Validate monetary data for precision issues
 * Returns true if data has precision issues that need fixing
 */
export const hasFloatingPointIssues = (data: any): boolean => {
  const checkValue = (value: any): boolean => {
    if (typeof value === 'number') {
      // Check if the number has more than 2 decimal places with precision issues
      const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
      return Math.abs(value - rounded) > 0.001;
    }
    
    if (Array.isArray(value)) {
      return value.some(checkValue);
    }
    
    if (value && typeof value === 'object') {
      return Object.values(value).some(checkValue);
    }
    
    return false;
  };
  
  return checkValue(data);
};

/**
 * Generate a report of precision issues found in storage
 */
export const generatePrecisionReport = (): string => {
  const report: string[] = [];
  
  try {
    const data = localStorage.getItem('fairsplit-data');
    if (data) {
      const parsed = JSON.parse(data);
      
      if (hasFloatingPointIssues(parsed)) {
        report.push('❌ Floating-point precision issues detected in stored data');
        
        // Check items specifically
        if (parsed.items && Array.isArray(parsed.items)) {
          const problematicItems = parsed.items.filter((item: any) => 
            hasFloatingPointIssues(item.price)
          );
          
          if (problematicItems.length > 0) {
            report.push(`   - ${problematicItems.length} items with price precision issues`);
          }
        }
      } else {
        report.push('✅ No precision issues detected in stored data');
      }
    } else {
      report.push('ℹ️  No stored data found');
    }
  } catch (error) {
    report.push(`❌ Error analyzing stored data: ${error}`);
  }
  
  return report.join('\n');
};

// Auto-run migration on import (can be disabled if needed)
if (typeof window !== 'undefined') {
  // Only run in browser environment
  migrateStorageData();
}