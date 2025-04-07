import { MainContent } from './components/main-content';
import { MobileNav } from './components/mobile-nav';
import { Plus } from 'phosphor-react';
import { Button } from '../common/components/button';
import { useAddNote } from './mutations/use-add-note';
import { COLORS } from './constants/colors';
import { useFolderContext } from './context/folder-context';

export function Notes() {
  const { selectedFolderId } = useFolderContext();
  const addNote = useAddNote();
  
  // Function to get a random color from the COLORS array
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex].color;
  };

  const handleAddNote = () => {
    if (selectedFolderId) {
      addNote(getRandomColor());
    }
  };

  return (
    <main className="h-full flex sm:gap-10">
      <MobileNav />
      <MainContent />
      
      {/* Mobile Add Button (only shown on mobile if a folder is selected) */}
      {selectedFolderId && (
        <div className="mobile-add-button md:hidden">
          <Button
            onClick={handleAddNote}
            variants={{ type: 'icon' }}
            className="w-full h-full rounded-full bg-amber-400 hover:bg-amber-300 shadow-lg"
          >
            <Plus className="text-xl" weight="bold" />
          </Button>
        </div>
      )}
    </main>
  );
}