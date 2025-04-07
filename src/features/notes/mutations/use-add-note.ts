import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../common/lib/react-query';
import { useAppServices } from '../../common/services/app-services';
import { useFolderContext } from '../context/folder-context';

export const useAddNote = () => {
  const { notesService } = useAppServices();
  const { selectedFolderId } = useFolderContext();

  const { mutate } = useMutation({
    mutationFn: (color: string) => notesService.add(color, selectedFolderId),
    onMutate: () => {},
    onError: () => {},
    onSettled: () => {
      queryClient.invalidateQueries(['NOTES']);
    },
  });

  return mutate;
};