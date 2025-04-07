import { useState } from 'react';
import { Folder, Plus, FolderOpen, CaretDown, CaretRight, Trash } from 'phosphor-react';
import { Button } from '../../../common/components/button';
import { useAppServices } from '../../../common/services/app-services';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../common/lib/react-query';
import { Input } from '../../../common/components/input';
import { IFolder } from '../../service/folders-service/folders-supabase-service';
import { motion, AnimatePresence } from 'framer-motion';
import { useFolderContext } from '../../context/folder-context';

// Simplified component that doesn't use recursive rendering
export function FolderList() {
  const { 
    selectedFolderId, 
    setSelectedFolderId,
    toggleFolderExpanded,
    isExpanded
  } = useFolderContext();
  
  const { foldersService } = useAppServices();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [isDeletingFolder, setIsDeletingFolder] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<IFolder | null>(null);

  const { data: folders = [], isLoading } = useQuery(['FOLDERS'], {
    queryFn: () => foldersService.fetchAll(),
  });

  const createMutation = useMutation({
    mutationFn: ({ name, parentId }: { name: string; parentId: string | null }) => 
      foldersService.create(name, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['FOLDERS']);
      setIsCreatingFolder(false);
      setNewFolderName('');
      setParentFolderId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => foldersService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['FOLDERS']);
      if (selectedFolderId === deleteMutation.variables) {
        setSelectedFolderId(null);
      }
      setIsDeletingFolder(false);
      setFolderToDelete(null);
    }
  });

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createMutation.mutate({ 
        name: newFolderName,
        parentId: parentFolderId
      });
    }
  };

  const openCreateFolderModal = (parentId: string | null = null) => {
    setParentFolderId(parentId);
    setIsCreatingFolder(true);
  };

  const openDeleteFolderModal = (folder: IFolder) => {
    setFolderToDelete(folder);
    setIsDeletingFolder(true);
  };

  const handleDeleteFolder = () => {
    if (folderToDelete) {
      deleteMutation.mutate(folderToDelete.id);
    }
  };

  // Flatten the folders for simpler rendering
  const flattenFolders = (folderList: IFolder[]) => {
    const result: Array<{folder: IFolder, level: number}> = [];
    
    const processFolders = (folders: IFolder[], level: number) => {
      folders.forEach(folder => {
        result.push({ folder, level });
        
        if (folder.children && folder.children.length > 0 && isExpanded(folder.id)) {
          processFolders(folder.children, level + 1);
        }
      });
    };
    
    processFolders(folderList, 0);
    return result;
  };

  const flatFolders = flattenFolders(folders);

  const countSubfolders = (folder: IFolder): number => {
    if (!folder.children || folder.children.length === 0) {
      return 0;
    }
    return folder.children.length + folder.children.reduce((sum, childFolder) => sum + countSubfolders(childFolder), 0);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-zinc-500 font-semibold">Folders</h2>
        <Button 
          onClick={() => openCreateFolderModal(null)} 
          variants={{ type: 'icon' }}
          className="w-8 h-8 bg-amber-400 hover:bg-amber-300 flex items-center justify-center shadow-md"
        >
          <Plus className="text-lg" weight="bold" />
        </Button>
      </div>

      <AnimatePresence>
        {isCreatingFolder && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.form 
              onSubmit={handleCreateFolder}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">
                {parentFolderId ? 'Create Sub-folder' : 'Create New Folder'}
              </h3>
              {parentFolderId && (
                <p className="text-sm text-zinc-500 mb-4">
                  Creating a sub-folder inside: {
                    // Find the parent folder name
                    flatFolders.find(item => item.folder.id === parentFolderId)?.folder.name
                  }
                </p>
              )}
              <div className="mb-4">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="text-sm"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button"
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                    setParentFolderId(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className={`px-4 py-2 rounded font-medium ${
                    newFolderName.trim() 
                      ? 'bg-amber-400 hover:bg-amber-300' 
                      : 'bg-gray-200 cursor-not-allowed'
                  }`}
                >
                  Create
                </Button>
              </div>
            </motion.form>
          </motion.div>
        )}

        {isDeletingFolder && folderToDelete && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4 text-red-600">Delete Folder</h3>
              <p className="mb-2">
                Are you sure you want to delete <span className="font-semibold">{folderToDelete.name}</span>?
              </p>

              {folderToDelete.children && folderToDelete.children.length > 0 && (
                <div className="mb-4 bg-amber-50 p-3 rounded-md border border-amber-200">
                  <p className="text-amber-700 font-medium">Warning:</p>
                  <p className="text-amber-700">
                    This folder contains {countSubfolders(folderToDelete)} subfolder{countSubfolders(folderToDelete) !== 1 ? 's' : ''}.
                    All subfolders and notes will also be deleted.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button 
                  type="button"
                  onClick={() => {
                    setIsDeletingFolder(false);
                    setFolderToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleDeleteFolder}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="text-zinc-400 text-sm py-2">Loading folders...</div>
      ) : flatFolders.length > 0 ? (
        <div className="space-y-1">
          {flatFolders.map(({ folder, level }) => (
            <div key={folder.id} className={level === 0 ? "" : level === 1 ? "ml-3" : level === 2 ? "ml-6" : "ml-9"}>
              <div className="flex items-center group">
                {folder.children && folder.children.length > 0 ? (
                  <Button
                    onClick={() => toggleFolderExpanded(folder.id)}
                    className="w-6 h-6 flex items-center justify-center"
                  >
                    {isExpanded(folder.id) ? (
                      <CaretDown className="text-zinc-500" size={16} />
                    ) : (
                      <CaretRight className="text-zinc-500" size={16} />
                    )}
                  </Button>
                ) : (
                  <div className="w-6"></div>
                )}
                
                <Button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors hover:bg-zinc-100 ${
                    selectedFolderId === folder.id ? 'bg-zinc-100 font-semibold' : ''
                  }`}
                >
                  {isExpanded(folder.id) && folder.children && folder.children.length > 0 ? (
                    <FolderOpen 
                      className={`text-xl ${selectedFolderId === folder.id ? 'text-amber-400' : 'text-zinc-500'}`} 
                    />
                  ) : (
                    <Folder 
                      className={`text-xl ${selectedFolderId === folder.id ? 'text-amber-400' : 'text-zinc-500'}`}
                    />
                  )}
                  {folder.name}
                </Button>
                
                <div className="flex items-center">
                  <Button
                    onClick={() => openCreateFolderModal(folder.id)}
                    className="ml-1 w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-800"
                  >
                    <Plus size={14} />
                  </Button>
                  
                  <Button
                    onClick={() => openDeleteFolderModal(folder)}
                    className="ml-1 w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-zinc-400 text-sm py-2">
          No folders yet. Create one to get started!
        </div>
      )}
    </div>
  );
}