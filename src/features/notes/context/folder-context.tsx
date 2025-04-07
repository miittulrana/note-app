import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type IFolderContext = {
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
};

const FolderContext = createContext<IFolderContext | undefined>(undefined);

interface IFolderProvider {
  children: ReactNode;
}

export const FolderProvider = ({ children }: IFolderProvider) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      selectedFolderId,
      setSelectedFolderId,
    }),
    [selectedFolderId]
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