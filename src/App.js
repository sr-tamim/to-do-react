import { Button, Input, Typography } from "@material-tailwind/react";
import useTasks from './hooks/useTasks';
import ToDoBody from './components/ToDoBody/ToDoBody';
import useModal from "./hooks/useModal";
import { Dialog } from "@material-tailwind/react";
import { createContext } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import { getAuth } from "firebase/auth";

const firebaseApp = initializeApp(firebaseConfig)

export const ModalContext = createContext()

function App() {
  const firebaseAuth = getAuth(firebaseApp)
  
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

            <div className="flex relative grow">
              <Input label='write new task'
                onChange={e => setTaskInputValue(e.target.value)}
                className='grow rounded-b-none md:rounded-l-lg md:rounded-r-none'
                labelProps={{ className: 'md:after:rounded-none' }} />

              <div className="absolute right-1 top-1 bottom-1 w-max max-w-[7.4rem] flex justify-center items-center mx-2">
                <input type="date" title="Add due date"
                onChange={e=>{
                  (e.target.value) ? e.target.setAttribute('hasValue', true) :
                  e.target.removeAttribute('hasValue')
                }} className="bg-transparent outline outline-0 focus:outline-0"/>
              </div>
            </div>

            <Button type="submit" className='rounded-t-none md:rounded-r-lg md:rounded-l-none'
              disabled={!taskInputValue} variant="gradient">Add</Button>

          </form>
        </div>
        <ToDoBody taskState={{ tasks, deleteTask, changeTaskState }} />
      </div>

      {modalBody && <Dialog open={modalOpen} handler={closeModal} size="xl" className={`w-11/12 min-w-min max-w-max`}>
        {modalBody}
      </Dialog>}
    </ModalContext.Provider>
  );
}

export default App;