import { Button, Input, Typography } from "@material-tailwind/react";
import useTasks from './hooks/useTasks';
import ToDoBody from './components/ToDoBody/ToDoBody';
import useModal from "./hooks/useModal";
import { Dialog } from "@material-tailwind/react";
import { createContext } from "react";

export const ModalContext = createContext()

function App() {
  const { tasks, taskInputValue, setTaskInputValue,
    addNewTask, deleteTask, changeTaskState } = useTasks()

  const modalStates = useModal()
  const { modalOpen, modalBody, closeModal } = modalStates

  return (
    <ModalContext.Provider value={modalStates}>
      <div className="px-3 max-w-screen-md mx-auto">
        <div className='text-center'>
          <Typography variant="h1">To do app</Typography>
          <Typography variant="h6">
            Made by <a href="https://sr-tamim.vercel.app" target='_blank' rel='noreferrer' className='underline hover_text-primary hover_no-underline'>SR TAMIM</a>
          </Typography>
        </div>

        <div className='max-w-lg mx-auto my-8'>
          <form onSubmit={addNewTask} className='flex flex-col md:flex-row'>
            <Input label='write new task'
              onChange={e => setTaskInputValue(e.target.value)}
              className='grow rounded-b-none md:rounded-l-lg md:rounded-r-none'
              labelProps={{ className: 'md:after:rounded-none' }} />
            <Button type="submit" className='rounded-t-none md:rounded-r-lg md:rounded-l-none'
              disabled={!taskInputValue} variant="gradient">Add</Button>
          </form>
        </div>
        <ToDoBody taskState={{ tasks, deleteTask, changeTaskState }} />
      </div>

      {modalBody && <Dialog open={modalOpen} handler={closeModal}>
        {modalBody}
      </Dialog>}
    </ModalContext.Provider>
  );
}

export default App;