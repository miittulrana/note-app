import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type IFolderContext = {
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  expandedFolders: Set<string>;
  toggleFolderExpanded: (folderId: string) => void;
  isExpanded: (folderId: string) => boolean;
};

const FolderContext = createContext<IFolderContext | undefined>(undefined);

interface IFolderProvider {
  children: ReactNode;
}

export const FolderProvider = ({ children }: IFolderProvider) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolderExpanded = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const isExpanded = (folderId: string) => {
    return expandedFolders.has(folderId);
  };

  const value = useMemo(
    () => ({
      selectedFolderId,
      setSelectedFolderId,
      expandedFolders,
      toggleFolderExpanded,
      isExpanded,
    }),
    [selectedFolderId, expandedFolders]
  );

  return (
    <FolderContext.Provider value={value}>{children}</FolderContext.Provider>
  );
};

export const useFolderContext = () => {
  const ctx = useContext(FolderContext);

  if (!ctx)
    throw new Error('You must use useFolderContext inside <FolderProvider/> ');

  return ctx;
};