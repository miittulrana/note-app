import { Plus } from 'phosphor-react';
import { NoteList } from '../note-list';
import { Button } from '../../../common/components/button';
import { useAddNote } from '../../mutations/use-add-note';
import { useFolderContext } from '../../context/folder-context';
import { COLORS } from '../../constants/colors';

export function NotesGrid() {
  const { selectedFolderId } = useFolderContext();
  const addNote = useAddNote();
  
  // Function to get a random color from the COLORS array
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex].color;
  };

  const handleAddNote = () => {
    addNote(getRandomColor());
  };

  return (
    <article className="relative mt-12 sm:mt-20 notes-grid">
      <div className="flex justify-between items-center mb-8 sm:mb-12">
        <h1 className="leading-[0.6] font-semibold tracking-[0.01px] text-3xl md:text-4xl lg:text-5xl">
          Notes to follow
        </h1>
        
        {/* Desktop Add Button (hidden on mobile) */}
        <Button
          onClick={handleAddNote}
          variants={{ type: 'icon' }}
          className="bg-amber-400 hover:bg-amber-300 hidden md:flex"
        >
          <Plus className="text-xl" weight="bold" />
        </Button>
      </div>

      <NoteList />
    </article>
  );
}