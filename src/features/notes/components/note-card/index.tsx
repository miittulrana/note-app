import { motion } from 'framer-motion';
import { PushPin, Trash, Warning, CheckCircle } from 'phosphor-react';
import { ChangeEvent } from 'react';
import { Button } from '../../../common/components/button';
import { debounce } from '../../../common/utils/debounce';
import { useDeleteNote } from '../../mutations/use-delete-note';
import { useEditNote } from '../../mutations/use-edit-note';

import { INote } from '../../service/notes-service/i-notes-service';
import { NoteOptions } from '../note-options';

export function NoteCard(props: INote) {
  const editMutation = useEditNote();
  const deleteMutation = useDeleteNote();

  const onChangeContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
    editMutation({ id: props.id, content: e.target.value });
  };

  const onChangeTitle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    editMutation({ id: props.id, title: e.target.value });
  };

  const onDeleteNote = () => {
    deleteMutation(props.id);
  };

  const onPinNote = () => {
    editMutation({ id: props.id, isPinned: !props.isPinned });
  };

  const onToggleImportant = () => {
    editMutation({ id: props.id, isUrgent: !props.isUrgent });
  };

  const onToggleResolved = () => {
    editMutation({ id: props.id, isResolved: !props.isResolved });
  };

  return (
    <motion.li
      layoutId={props.id}
      initial={{ y: 10, scale: 0.8, opacity: 0.85 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      className={`note-card ${props.color} focus-within:ring ring-offset-4 flex-1 min-h-[20rem] min-w-[16rem] max-w-[20rem] flex flex-col justify-between px-6 py-7 rounded-3xl font-medium leading-[1.4] relative ${props.isResolved ? 'opacity-80' : ''}`}
    >
      {/* Status badges at the top of the card */}
      <div className="status-badges absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-2 flex-wrap justify-center">
        {props.isUrgent && (
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center"
          >
            <span className="mr-1.5 text-lg">🔥</span>
            <span>Important</span>
          </motion.div>
        )}
        
        {props.isResolved && (
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center"
          >
            <CheckCircle weight="fill" className="mr-1.5 text-white" />
            <span>Resolved</span>
          </motion.div>
        )}
      </div>

      {/* Mark as resolved indicator - subtle visual change for resolved notes */}
      {props.isResolved && (
        <div className="absolute inset-0 bg-white bg-opacity-10 rounded-3xl pointer-events-none flex items-center justify-center">
          <div className="absolute border-2 border-green-500 border-dashed rounded-3xl w-full h-full opacity-20"></div>
        </div>
      )}

      <header className="mb-3 mt-2">
        <input
          placeholder="What I need to do ?"
          onChange={debounce(onChangeTitle)}
          defaultValue={props.title}
          className="w-full bg-transparent focus:outline-none placeholder:text-zinc-800 text-lg font-bold"
        />
      </header>

      <textarea
        placeholder="Time to take some notes!"
        className="placeholder:text-zinc-800 resize-none focus:outline-none w-full h-full bg-transparent"
        defaultValue={props.content}
        onChange={debounce(onChangeContent)}
      />

      <div className="flex items-center justify-between">
        <span className="font-normal">
          {props.date && !isNaN(new Date(props.date).getTime()) 
            ? new Date(props.date).toLocaleDateString() 
            : new Date().toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          <NoteOptions>
            <Button
              onClick={onDeleteNote}
              id="option"
              variants={{ type: 'icon' }}
              className="bg-zinc-800"
            >
              <Trash className="text-xl" />
            </Button>

            <Button
              onClick={onPinNote}
              id="option"
              variants={{ type: 'icon' }}
              className={`${props.isPinned ? 'bg-amber-400' : 'bg-zinc-800'}`}
            >
              <PushPin className="text-xl" />
            </Button>

            <Button
              onClick={onToggleImportant}
              id="option"
              variants={{ type: 'icon' }}
              className={`${props.isUrgent ? 'bg-red-500' : 'bg-zinc-800'}`}
            >
              <Warning className="text-xl" />
            </Button>

            <Button
              onClick={onToggleResolved}
              id="option"
              variants={{ type: 'icon' }}
              className={`${props.isResolved ? 'bg-green-500' : 'bg-zinc-800'}`}
            >
              <CheckCircle className="text-xl" />
            </Button>
          </NoteOptions>
        </div>
      </div>
    </motion.li>
  );
}