import { Plus } from 'phosphor-react';
import { Button } from '../../../common/components/button';
import { useAddNote } from '../../mutations/use-add-note';
import { COLORS } from '../../constants/colors';

export function AddNote() {
  const addNote = useAddNote();

  // Function to get a random color from the COLORS array
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex].color;
  };

  const handleClick = () => {
    // Add a note with a random color
    addNote(getRandomColor());
  };

  return (
    <article className="mt-5 sm:mt-20 flex flex-col items-center">
      <Button
        onClick={handleClick}
        id="add-note"
        variants={{ type: 'icon' }}
        className="z-[1] w-fit bg-amber-400 hover:bg-amber-300"
      >
        <Plus className="text-2xl" weight="bold" />
      </Button>
    </article>
  );
}