import { supabase } from '../../../common/services/supabase-client';
import { INote, INotePayload, INotesService } from './i-notes-service';

export class NotesSupabaseService implements INotesService {
  private readonly TABLE_NAME = 'notes';

  async fetch(folderId?: string | null): Promise<INote[]> {
    let query = supabase
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    // If a folder ID is provided, filter by that folder
    if (folderId) {
      query = query.eq('folder_id', folderId);
    } else {
      // If viewing "All Notes", get all notes
      // This change ensures all notes are shown when no folder is selected
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }

    // Convert from Supabase format to app format
    return (data || []).map(note => ({
      id: note.id,
      title: note.title || '',
      content: note.content || '',
      color: note.color,
      isPinned: note.is_pinned,
      isUrgent: note.is_urgent,
      date: note.created_at,
      folderId: note.folder_id
    }));
  }

  async add(color: string, folderId?: string | null): Promise<string> {
    const newNote = {
      title: '',
      content: '',
      color,
      is_pinned: false,
      is_urgent: false,
      folder_id: folderId || null
    };

    const { error } = await supabase
      .from(this.TABLE_NAME)
      .insert([newNote]);

    if (error) {
      console.error('Error adding note:', error);
      throw error;
    }

    return 'A new Note was just added.';
  }

  async remove(id: string): Promise<string> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing note:', error);
      throw error;
    }

    return 'Note deleted with success.';
  }

  async edit(payload: INotePayload): Promise<string> {
    // Convert camelCase to snake_case for Supabase
    const updateData: any = {};
    
    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.content !== undefined) updateData.content = payload.content;
    if (payload.color !== undefined) updateData.color = payload.color;
    if (payload.isPinned !== undefined) updateData.is_pinned = payload.isPinned;
    if (payload.isUrgent !== undefined) updateData.is_urgent = payload.isUrgent;
    if (payload.folderId !== undefined) updateData.folder_id = payload.folderId;
    
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq('id', payload.id);

    if (error) {
      console.error('Error editing note:', error);
      throw error;
    }

    return 'Note edited with success.';
  }

  async favorite(): Promise<any> {
    // This method appears to be unused in the code
    return Promise.resolve();
  }

  // Move a note to a different folder
  async moveToFolder(noteId: string, folderId: string | null): Promise<string> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update({ folder_id: folderId })
      .eq('id', noteId);

    if (error) {
      console.error('Error moving note to folder:', error);
      throw error;
    }

    return 'Note moved successfully.';
  }
}