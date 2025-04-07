import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAppServices } from '../../common/services/app-services';
import { useSearchNotesContext } from '../context/search-notes-context';
import { useFolderContext } from '../context/folder-context';

export const useFetchNotes = () => {
  const { query } = useSearchNotesContext();
  const { selectedFolderId } = useFolderContext();
  const { notesService } = useAppServices();

  const { data, isLoading, isFetching, isError } = useQuery(
    ['NOTES', selectedFolderId],
    {
      queryFn: () => notesService.fetch(selectedFolderId),
    }
  );

  const filterData = useMemo(
    () => data?.filter((d) => d.title.toLowerCase().includes(query.toLowerCase())),
    [data, query]
  );

  const pinned = filterData?.filter((d) => d.isPinned);
  const others = filterData?.filter((d) => !d.isPinned);

  return {
    data: { pinned, others },
    isLoading,
    isFetching,
    isError,
    queryInput: query,
  };
};