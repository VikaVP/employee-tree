import { useState } from 'react';

/**
 * React Hook to random color.
 * @hook
 */
export const useColorRandom = () => {
  const [color, setColor] = useState('');
  const colors = [
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-violet-500',
  ];
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    setColor(colors[randomIndex] || '');
    return colors[randomIndex];
  };

  return { getRandomColor, color };
};
