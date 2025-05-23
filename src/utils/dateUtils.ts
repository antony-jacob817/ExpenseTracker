export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
}

export function getCurrentMonthYear(): string {
  const now = new Date();
  return formatMonthYear(now);
}

export function getPreviousMonthYear(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return formatMonthYear(date);
}

export function getMonthYearFromDate(dateString: string): string {
  return formatMonthYear(new Date(dateString));
}

export function getCurrentMonth(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
}

export function sortByDate(dateA: string, dateB: string): number {
  return new Date(dateB).getTime() - new Date(dateA).getTime();
}

export function getDefaultDateString(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

export function groupExpensesByMonth<T extends { date: string }>(
  expenses: T[]
): Record<string, T[]> {
  return expenses.reduce((acc, expense) => {
    const monthYear = getMonthYearFromDate(expense.date);
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(expense);
    return acc;
  }, {} as Record<string, T[]>);
}