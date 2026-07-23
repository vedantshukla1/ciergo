export const isDateInRange = (
  dateStr: string,
  range: { from?: Date | undefined; to?: Date | undefined }
): boolean => {
  if (!range.from && !range.to) return true;
  if (!dateStr) return false;
  
  try {
    let date: Date | null = null;
    if (dateStr.includes('-')) {
      const parts = dateStr.split('T')[0].split('-');
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      } else if (parts[2].length === 4) {
        // DD-MM-YYYY
        date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    
    if (!date || isNaN(date.getTime())) {
      date = new Date(dateStr);
    }
    
    if (isNaN(date.getTime())) {
      return true; // If unparseable, don't filter out
    }

    date.setHours(0, 0, 0, 0);

    if (range.from) {
      const fromDate = new Date(range.from);
      fromDate.setHours(0, 0, 0, 0);
      if (date < fromDate) return false;
    }

    if (range.to) {
      const toDate = new Date(range.to);
      toDate.setHours(23, 59, 59, 999);
      if (date > toDate) return false;
    }

    return true;
  } catch (e) {
    return true;
  }
};
