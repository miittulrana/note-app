export interface INotesService {
  fetch(folderId?: string | null): Promise<INote[]>;
  add(color: string, folderId?: string | null): Promise<any>;
  edit(payload: INotePayload): Promise<any>;
  remove(id: string): Promise<any>;
  favorite(): Promise<any>;
  moveToFolder?(noteId: string, folderId: string | null): Promise<any>;
}

export type INote = {
  id: string;
  date: string;
  title: string;
  content: string;
  color: string;
  isPinned: boolean;
  isUrgent?: boolean;
  isResolved?: boolean;
  folderId?: string | null;
};

export type INotePayload = { id: string } & Partial<Omit<INote, 'date' | 'id'>>;