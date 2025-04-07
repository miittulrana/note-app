import { supabase } from '../../../common/services/supabase-client';

export interface IFolder {
  id: string;
  name: string;
  created_at: string;
  parent_id: string | null;
  level: number;
  children?: IFolder[];
}

export interface IFoldersService {
  fetchAll(): Promise<IFolder[]>;
  create(name: string, parentId?: string | null): Promise<IFolder>;
  update(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
  moveFolder(id: string, newParentId: string | null): Promise<void>;
}

export class FoldersSupabaseService implements IFoldersService {
  private readonly TABLE_NAME = 'folders';

  async fetchAll(): Promise<IFolder[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('*')
      .order('level', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching folders:', error);
      throw error;
    }

    // Process the flat list into a hierarchical structure
    const folders = data || [];
    
    // First, identify root folders (parent_id is null)
    const rootFolders = folders.filter(folder => folder.parent_id === null);
    
    // Then recursively add children to each folder
    const buildFolderTree = (parentFolders: IFolder[], allFolders: IFolder[]): IFolder[] => {
      return parentFolders.map(parentFolder => {
        const children = allFolders.filter(folder => folder.parent_id === parentFolder.id);
        
        if (children.length > 0) {
          return {
            ...parentFolder,
            children: buildFolderTree(children, allFolders)
          };
        } else {
          return {
            ...parentFolder,
            children: []
          };
        }
      });
    };

    return buildFolderTree(rootFolders, folders);
  }

  async create(name: string, parentId: string | null = null): Promise<IFolder> {
    // Determine the level of the new folder
    let level = 0;
    
    if (parentId) {
      // Get the parent folder to determine its level
      const { data: parentFolder, error: parentError } = await supabase
        .from(this.TABLE_NAME)
        .select('level')
        .eq('id', parentId)
        .single();
      
      if (parentError) {
        console.error('Error fetching parent folder:', parentError);
        throw parentError;
      }
      
      // The new folder's level is the parent's level + 1
      level = parentFolder.level + 1;
    }

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .insert([{ name, parent_id: parentId, level }])
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
    // First, recursively get all child folder IDs
    const childFolderIds = await this.getAllChildFolderIds(id);
    
    // Include the current folder ID
    const allFolderIds = [id, ...childFolderIds];
    
    // Delete all notes associated with any of these folders
    const { error: notesError } = await supabase
      .from('notes')
      .delete()
      .in('folder_id', allFolderIds);
      
    if (notesError) {
      console.error('Error removing notes from folders:', notesError);
      throw notesError;
    }
    
    // Then delete all folders
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .delete()
      .in('id', allFolderIds);

    if (error) {
      console.error('Error removing folders:', error);
      throw error;
    }
  }
  
  async moveFolder(id: string, newParentId: string | null): Promise<void> {
    // Prevent moving a folder to be its own descendant
    if (newParentId) {
      const descendants = await this.getAllChildFolderIds(id);
      if (descendants.includes(newParentId)) {
        throw new Error('Cannot move a folder to be its own descendant');
      }
    }
    
    // Determine the new level
    let newLevel = 0;
    if (newParentId) {
      const { data: parentFolder, error: parentError } = await supabase
        .from(this.TABLE_NAME)
        .select('level')
        .eq('id', newParentId)
        .single();
        
      if (parentError) {
        console.error('Error fetching parent folder level:', parentError);
        throw parentError;
      }
      
      newLevel = parentFolder.level + 1;
    }
    
    // Update the folder's parent_id and level
    const { error } = await supabase
      .from(this.TABLE_NAME)
      .update({ parent_id: newParentId, level: newLevel })
      .eq('id', id);
      
    if (error) {
      console.error('Error moving folder:', error);
      throw error;
    }
    
    // Now update all descendant folders' levels
    await this.updateDescendantLevels(id, newLevel);
  }
  
  // Helper method to get all descendant folder IDs
  private async getAllChildFolderIds(folderId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('id')
      .eq('parent_id', folderId);
      
    if (error) {
      console.error('Error fetching child folders:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const directChildIds = data.map(folder => folder.id);
    
    // Recursively get descendants of each child
    const nestedChildPromises = directChildIds.map(childId => 
      this.getAllChildFolderIds(childId)
    );
    
    const nestedChildIds = await Promise.all(nestedChildPromises);
    
    // Flatten the nested arrays and combine with direct children
    return [...directChildIds, ...nestedChildIds.flat()];
  }
  
  // Helper method to update levels of all descendant folders
  private async updateDescendantLevels(folderId: string, parentLevel: number): Promise<void> {
    // Get direct children
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select('id')
      .eq('parent_id', folderId);
      
    if (error) {
      console.error('Error fetching children for level update:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return;
    }
    
    const childLevel = parentLevel + 1;
    
    // Update all direct children to the new level
    const { error: updateError } = await supabase
      .from(this.TABLE_NAME)
      .update({ level: childLevel })
      .eq('parent_id', folderId);
      
    if (updateError) {
      console.error('Error updating child folder levels:', updateError);
      throw updateError;
    }
    
    // Recursively update each child's descendants
    const childUpdatePromises = data.map(child => 
      this.updateDescendantLevels(child.id, childLevel)
    );
    
    await Promise.all(childUpdatePromises);
  }
}