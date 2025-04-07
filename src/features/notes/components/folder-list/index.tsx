import { useState } from 'react';
import { Folder, Plus, FolderOpen } from 'phosphor-react';
import { Button } from '../../../common/components/button';
import { useAppServices } from '../../../common/services/app-services';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../common/lib/react-query';
import { Input } from '../../../common/components/input';
import { IFolder } from '../../service/folders-service/folders-supabase-service';

interface FolderListProps {
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export function FolderList({ selectedFolderId, onSelectFolder }: FolderListProps) {
  const { foldersService } = useAppServices();
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const { data: folders = [], isLoading } = useQuery(['FOLDERS'], {
    queryFn: () => foldersService.fetchAll(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => foldersService.create(name),
    onSuccess: () => {
      queryClient.invalidateQueries(['FOLDERS']);
      setIsCreating(false);
      setNewFolderName('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => foldersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['FOLDERS']);
      if (selectedFolderId === deleteMutation.variables) {
        onSelectFolder(null);
      }
    }
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createMutation.mutate(newFolderName);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-zinc-500 font-semibold">Folders</h2>
        <Button 
          onClick={() => setIsCreating(!isCreating)} 
          variants={{ type: 'icon' }}
          className="w-7 h-7 flex items-center justify-center"
        >
          <Plus className="text-lg" />
        </Button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateFolder} className="mb-4">
          <div className="flex gap-2">
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="text-sm"
            />
            <Button 
              type="submit"
              className="bg-amber-400 px-3 py-2 rounded font-medium hover:bg-amber-300"
            >
              Create
            </Button>
          </div>
        </form>
      )}

      <ul className="space-y-2">
        <li>
          <Button
            onClick={() => onSelectFolder(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors hover:bg-zinc-100 ${!selectedFolderId ? 'bg-zinc-100 font-semibold' : ''}`}
          >
            <FolderOpen className={`text-xl ${!selectedFolderId ? 'text-amber-400' : 'text-zinc-500'}`} />
            All Notes
          </Button>
        </li>
        
        {isLoading ? (
          <li className="text-zinc-400 text-sm py-2">Loading folders...</li>
        ) : (
          folders.map((folder: IFolder) => (
            <li key={folder.id}>
              <Button
                onClick={() => onSelectFolder(folder.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors hover:bg-zinc-100 ${selectedFolderId === folder.id ? 'bg-zinc-100 font-semibold' : ''}`}
              >
                <Folder className={`text-xl ${selectedFolderId === folder.id ? 'text-amber-400' : 'text-zinc-500'}`} />
                {folder.name}
              </Button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}