// Validation utilities for production safety

export const validateParticipantName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Name cannot be empty' };
  }
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (trimmedName.length > 20) {
    return { isValid: false, error: 'Name must be less than 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
    return { isValid: false, error: 'Name can only contain letters, numbers, spaces, hyphens, and underscores' };
  }
  
  return { isValid: true };
};

export const validateItemName = (name: string): { isValid: boolean; error?: string } => {
  const trimmedName = name.trim();
  
  if (!trimmedName) {
    return { isValid: false, error: 'Item name cannot be empty' };
  }
  
  if (trimmedName.length < 1) {
    return { isValid: false, error: 'Item name is required' };
  }
  
  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Item name must be less than 50 characters' };
  }
  
  return { isValid: true };
};

export const validatePrice = (price: string): { isValid: boolean; error?: string; value?: number } => {
  const numericPrice = parseFloat(price);
  
  if (isNaN(numericPrice)) {
    return { isValid: false, error: 'Price must be a valid number' };
  }
  
  if (numericPrice <= 0) {
    return { isValid: false, error: 'Price must be greater than 0' };
  }
  
  if (numericPrice > 999999) {
    return { isValid: false, error: 'Price cannot exceed ₹999,999' };
  }
  
  // Check for reasonable decimal places (max 2)
  if (price.includes('.') && price.split('.')[1]?.length > 2) {
    return { isValid: false, error: 'Price can have maximum 2 decimal places' };
  }
  
  return { isValid: true, value: numericPrice };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};