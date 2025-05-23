import { MonthlyTotal } from '../types';

export function generateTips(
  differences: Record<string, number>,
  currentMonth: MonthlyTotal,
  previousMonth: MonthlyTotal
): string[] {
  const tips: string[] = [];

  // Check overall spending
  const overallChange = ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100;
  
  if (overallChange > 10) {
    tips.push(`💸 Your overall spending increased by ${Math.round(overallChange)}% this month. Consider reviewing your budget.`);
  } else if (overallChange < -10) {
    tips.push(`💰 Great job! You've reduced your overall spending by ${Math.round(Math.abs(overallChange))}% this month.`);
  }

  // Check category-specific changes
  Object.entries(differences)
    .filter(([_, change]) => Math.abs(change) > 20) // Only significant changes
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])) // Sort by magnitude
    .slice(0, 3) // Take top 3
    .forEach(([category, change]) => {
      const currentAmount = currentMonth.categories[category] || 0;
      
      if (change > 0 && currentAmount > 0) {
        tips.push(getCategoryIncreaseTip(category, Math.round(change)));
      } else if (change < 0) {
        tips.push(getCategoryDecreaseTip(category, Math.round(Math.abs(change))));
      }
    });

  // Add general tips if we don't have enough specific ones
  if (tips.length < 2) {
    const highestCategory = Object.entries(currentMonth.categories)
      .sort((a, b) => b[1] - a[1])[0];
    
    if (highestCategory) {
      const [category, amount] = highestCategory;
      const percentage = Math.round((amount / currentMonth.total) * 100);
      
      if (percentage > 30) {
        tips.push(`📊 ${category} makes up ${percentage}% of your monthly spending. Consider if this aligns with your priorities.`);
      }
    }
  }

  // Add a general tip if we still don't have enough
  if (tips.length === 0) {
    tips.push("💡 Track your expenses consistently for more personalized insights!");
  }

  return tips;
}

function getCategoryIncreaseTip(category: string, percentChange: number): string {
  const tips = {
    'Food': `🍔 Your Food spending increased by ${percentChange}%. Consider meal prepping or cooking at home more often.`,
    'Transport': `🚗 Your Transport expenses went up ${percentChange}%. Try carpooling or public transportation when possible.`,
    'Entertainment': `🎬 Entertainment spending rose by ${percentChange}%. Look for free or low-cost activities in your area.`,
    'Shopping': `🛍️ Shopping expenses increased by ${percentChange}%. Make a shopping list and stick to it to avoid impulse buys.`,
    'Housing': `🏠 Housing costs went up ${percentChange}%. Review your utilities usage or consider negotiating some services.`,
    'Utilities': `💡 Utility expenses rose by ${percentChange}%. Check for energy-efficient options or usage patterns to reduce costs.`,
    'Healthcare': `🏥 Healthcare spending increased by ${percentChange}%. Consider preventive care options or review insurance coverage.`,
    'Travel': `✈️ Travel expenses went up ${percentChange}%. Look for deals, travel off-season, or explore local destinations.`,
    'Education': `📚 Education spending rose by ${percentChange}%. Check for scholarships, grants, or free online resources.`,
  };
  
  return tips[category as keyof typeof tips] || 
    `📈 Your ${category} spending increased by ${percentChange}%. Consider ways to reduce these expenses.`;
}

function getCategoryDecreaseTip(category: string, percentChange: number): string {
  const tips = {
    'Food': `🥗 Great job! You reduced Food spending by ${percentChange}%. Keep up those healthy home cooking habits.`,
    'Transport': `🚲 You decreased Transport costs by ${percentChange}%. Your wallet (and the environment) thanks you!`,
    'Entertainment': `🎮 Entertainment expenses dropped by ${percentChange}%. It's good to find balance between fun and saving.`,
    'Shopping': `👛 Well done! Shopping expenses decreased by ${percentChange}%. Your future self will thank you for saving.`,
    'Housing': `🏡 You reduced Housing costs by ${percentChange}%. Smart moves on managing your biggest expense category.`,
    'Utilities': `💧 Utilities spending dropped by ${percentChange}%. Your conservation efforts are paying off!`,
    'Healthcare': `❤️ Healthcare costs decreased by ${percentChange}%. Preventive care often leads to long-term savings.`,
    'Travel': `🧳 Travel expenses reduced by ${percentChange}%. Finding those deals really paid off!`,
    'Education': `📝 Education spending decreased by ${percentChange}%. Finding value while investing in yourself is key.`,
  };
  
  return tips[category as keyof typeof tips] || 
    `📉 Well done! Your ${category} spending decreased by ${percentChange}%. Keep up the good work.`;
}