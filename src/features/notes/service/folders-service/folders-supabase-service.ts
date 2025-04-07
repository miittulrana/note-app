import { supabase } from '../../../common/services/supabase-client';

export interface IFolder {
  id: string;
  name: string;
  created_at: string;
}

export interface IFoldersService {
  fetchAll(): Promise<IFolder[]>;
  create(name: string): Promise<IFolder>;
  update(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
}

export class FoldersSupabaseService implements IFoldersService {
  private readonly TABLE_NAME = 'folders';

  async fetchAll(): Promise<IFolder[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }

    return data || [];
  }

  async create(name: string): Promise<IFolder> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Error creating folder:', error);
      throw error;
    }

    return data;
  }

  async update(id: string, name: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update({ name })
      .eq('id', id);

    if (error) {
      console.error('Error updating folder:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing folder:', error);
      throw error;
    }
  }
}