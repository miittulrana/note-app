import { useState, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../common/components/button';

interface PinLockProps {
  onUnlock: () => void;
}

const PIN_CODE = '9115';

export function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Focus on the document to catch keyboard input
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pin]);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === PIN_CODE) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, onUnlock]);

  const handleKeyDown = (e: KeyboardEvent | any) => {
    const key = e.key;
    
    // Only allow numbers
    if (/^[0-9]$/.test(key) && pin.length < 4) {
      setPin(prev => prev + key);
    } else if (key === 'Backspace') {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleNumberClick = (number: number) => {
    if (pin.length < 4) {
      setPin(prev => prev + number);
    }
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
      tabIndex={0}
    >
      <div className="flex flex-col items-center mb-10">
        <img 
          src="/public/logo.png" 
          alt="SaltScript Logo" 
          className="h-24 w-auto mb-4"
        />
        <p className="text-gray-500 text-sm mt-1">CODE, PERFECTLY SEASONED!</p>
      </div>

      
      
      <div className="flex gap-4 mb-10">
        {[0, 1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`w-5 h-5 rounded-full border-2 ${i < pin.length ? 'bg-amber-400 border-amber-400' : 'border-gray-300'}`}
          />
        ))}
      </div>

      <motion.div 
        animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        className="grid grid-cols-3 gap-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(number => (
          <Button
            key={number}
            onClick={() => handleNumberClick(number)}
            className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-semibold"
          >
            {number}
          </Button>
        ))}
        <Button
          onClick={handleClear}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-lg font-semibold"
        >
          Clear
        </Button>
        <Button
          onClick={() => handleNumberClick(0)}
          className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-2xl font-semibold"
        >
          0
        </Button>
      </motion.div>
    </motion.div>
  );
}