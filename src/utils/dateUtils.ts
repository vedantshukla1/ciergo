export const isDateInRange = (
  dateStr: string,
  range: { from?: Date | undefined; to?: Date | undefined }
): boolean => {
  if (!dateStr) return false;
  
  // Basic implementation to avoid crashing
  // Real implementation would parse the specific date format
  try {
    // Attempt to normalize "05 Mar '26" to "05 Mar 2026" for parsing if needed
    const normalizedStr = dateStr.replace(/'(\d{2})$/, '20$1');
    const date = new Date(normalizedStr);
    
    if (isNaN(date.getTime())) {
      return true; // If we can't parse it, don't filter it out
    }
    
    if (range.from && date < range.from) return false;
    if (range.to) {
      // Set to end of day
      const toDate = new Date(range.to);
      toDate.setHours(23, 59, 59, 999);
      if (date > toDate) return false;
    }
    
    return true;
  } catch (e) {
    return true;
  }
};
