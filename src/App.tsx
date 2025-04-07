import { useState, useEffect } from 'react';
import { Notes } from './features/notes/notes';
import { PinLock } from './features/notes/components/pin-lock';
import { FolderProvider } from './features/notes/context/folder-context';

function App() {
  const [isLocked, setIsLocked] = useState(true);
  
  // Re-lock the app when the page is refreshed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setIsLocked(true);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <FolderProvider>
      {isLocked ? (
        <PinLock onUnlock={() => setIsLocked(false)} />
      ) : (
        <Notes />
      )}
    </FolderProvider>
  );
}

export default App;