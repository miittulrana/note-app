import { SearchNotesFormProvider } from '../../context/search-notes-context';
import { NotesGrid } from '../notes-grid';
import { SearchNotesForm } from '../search-notes-form';
import { useFolderContext } from '../../context/folder-context';

export function MainContent() {
  const { selectedFolderId } = useFolderContext();
  
  return (
    <section className="py-8 px-4 sm:p-8 flex-1">
      <SearchNotesFormProvider>
        <SearchNotesForm />
        
        {/* Only render the NotesGrid if a folder is selected or viewing all notes */}
        <NotesGrid />
      </SearchNotesFormProvider>
    </section>
  );
}