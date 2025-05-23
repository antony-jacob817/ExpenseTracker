import { CategoryTotal } from '../types';

export function calculatePieSegments(
  categoryTotals: CategoryTotal[],
  radius: number = 100
) {
  const segments: Array<{
    category: string;
    startAngle: number;
    endAngle: number;
    color: string;
    path: string;
  }> = [];
  
  let startAngle = 0;
  
  categoryTotals.forEach((category, index) => {
    const angle = (category.percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Calculate SVG path for arc
    const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const path = [
      `M ${radius},${radius}`,
      `L ${x1},${y1}`,
      `A ${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2}`,
      'Z'
    ].join(' ');
    
    segments.push({
      category: category.category,
      startAngle,
      endAngle,
      color: getCategoryColor(category.category, index),
      path
    });
    
    startAngle = endAngle;
  });
  
  return segments;
}

export function getCategoryColor(category: string, fallbackIndex: number = 0): string {
  const colorMap: Record<string, string> = {
    'Food': '#3B82F6', // Blue
    'Transport': '#F97316', // Orange
    'Entertainment': '#8B5CF6', // Purple
    'Shopping': '#EC4899', // Pink
    'Housing': '#10B981', // Green
    'Utilities': '#6366F1', // Indigo
    'Healthcare': '#EF4444', // Red
    'Travel': '#F59E0B', // Amber
    'Education': '#14B8A6', // Teal
    'Other': '#6B7280', // Gray
  };

  return colorMap[category] || getFallbackColor(fallbackIndex);
}

function getFallbackColor(index: number): string {
  const colors = [
    '#3B82F6', '#F97316', '#8B5CF6', '#EC4899', 
    '#10B981', '#6366F1', '#EF4444', '#F59E0B', 
    '#14B8A6', '#6B7280'
  ];
  
  return colors[index % colors.length];
}

export function getCategoryEmoji(category: string): string {
  const emojiMap: Record<string, string> = {
    'Food': '🍔',
    'Transport': '🚗',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Housing': '🏠',
    'Utilities': '💡',
    'Healthcare': '🏥',
    'Travel': '✈️',
    'Education': '📚',
    'Other': '📋'
  };

  return emojiMap[category] || '📋';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}