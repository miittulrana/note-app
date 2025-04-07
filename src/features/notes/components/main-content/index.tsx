import { SearchNotesFormProvider } from '../../context/search-notes-context';
import { NotesGrid } from '../notes-grid';
import { SearchNotesForm } from '../search-notes-form';
import { useFolderContext } from '../../context/folder-context';

export function MainContent() {
  const { selectedFolderId } = useFolderContext();
  
  return (
    <section className="py-8 px-4 sm:p-8 flex-1 main-content">
      <SearchNotesFormProvider>
        <SearchNotesForm />
        
        {/* Only render the NotesGrid if a folder is selected */}
        {selectedFolderId ? (
          <NotesGrid />
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
            <div className="text-5xl mb-4 sm:text-6xl">📁</div>
            <h2 className="text-xl font-semibold mb-2 text-center sm:text-2xl">Select a folder to view notes</h2>
            <p className="text-center max-w-md px-4">
              Choose a folder from the sidebar to see your notes or create a new folder to get started.
            </p>
          </div>
        )}
      </SearchNotesFormProvider>
    </section>
  );
}