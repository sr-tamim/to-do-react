import { Button, IconButton, Input, Typography } from "@material-tailwind/react";
import useTasks from './hooks/useTasks';
import ToDoBody from './components/ToDoBody/ToDoBody';
import useModal from "./hooks/useModal";
import { Dialog } from "@material-tailwind/react";
import { createContext, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const firebaseApp = initializeApp(firebaseConfig)

export const ModalContext = createContext()

function App() {
  const firebaseAuth = getAuth(firebaseApp)

  const { tasks, taskInputValue, setTaskInputValue,
    addNewTask, deleteTask, changeTaskState } = useTasks()

  const modalStates = useModal()
  const { modalOpen, modalBody, closeModal } = modalStates


  const [user, setUser] = useState(null)
  const [authLoadingOnRender, setAuthLoadingOnRender] = useState(true)
  onAuthStateChanged(firebaseAuth, newUser => {
    (newUser && !user) && setUser(newUser.providerData[0]);
    (!newUser && user) && setUser(null)
    authLoadingOnRender && setAuthLoadingOnRender(false)
  })

  function googleLogin() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(firebaseAuth, provider)
    .catch((error) => console.dir(error));
  }

  return (
    <ModalContext.Provider value={modalStates}>
      <div className="px-3 max-w-screen-md mx-auto">
        <div className="text-center flex flex-col items-center flex-wrap max-w-lg mx-auto">
          <div>
            <Typography variant="h1" className="uppercase">To do app</Typography>
            <Typography variant="h6">
              Made by <a href="https://sr-tamim.vercel.app" target='_blank' rel='noreferrer' className='underline hover_text-primary hover_no-underline'>SR TAMIM</a>
            </Typography>
          </div>
          {!user && <div className="pt-4 flex items-center">
            <Typography className="font-bold">Login with:</Typography>
            <div>
              {/* google button */}
              <IconButton size="sm" variant="text" onClick={googleLogin}>
                <svg className="fill-current w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
              </IconButton>
              <IconButton size="sm" variant="text">
                <svg className="fill-current w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" /></svg>
              </IconButton>
              <IconButton size="sm" variant="text">
                <svg className="fill-current w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" /></svg>
              </IconButton>
            </div>
          </div>}
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
                  onChange={e => {
                    (e.target.value) ? e.target.setAttribute('hasValue', true) :
                      e.target.removeAttribute('hasValue')
                  }} className="bg-transparent outline outline-0 focus:outline-0" />
              </div>
            </div>

            <Button type="submit" className='rounded-t-none md:rounded-r-lg md:rounded-l-none'
              disabled={!taskInputValue} variant="gradient">Add</Button>

          </form>
        </div>
        {user && <div>
          <Typography variant="h3">{user.displayName}</Typography>
        </div>}
        <ToDoBody taskState={{ tasks, deleteTask, changeTaskState }} />
      </div>

      {modalBody && <Dialog open={modalOpen} handler={closeModal} size="xl" className={`w-11/12 min-w-min max-w-max`}>
        {modalBody}
      </Dialog>}

      {authLoadingOnRender && <Dialog open={authLoadingOnRender} size="sm"
        className="bg-transparent outline-0 shadow-none">
        <IconButton variant="text" className="block mx-auto w-24 h-24 max-w-full max-h-full focus:outline-0">
          <svg className="fill-current w-full h-full"
          xmlnsSvg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.0" viewBox="0 0 128 128" xmlSpace="preserve"><g><path d="M105.54 39.9l13.56-6.42s-9.67-26.82-47.05-30.1C31.68-.1 15.25 35.6 15.25 35.6S31.13 9.55 63.6 11.1c32.6 1.53 41.96 28.8 41.96 28.8zm-41.6 72.52l-1.2 14.97s28.15 5.04 49.67-25.7c23.3-33.2.46-65.34.46-65.34s14.7 26.8-2.86 54.13c-17.66 27.5-46.05 21.9-46.05 21.9zm-42.06-72.3L9.52 31.58S-8.96 53.4 6.9 87.42c17.12 36.73 56.38 33.03 56.38 33.03s-30.56-.68-45.46-29.55c-14.96-29 4.06-50.8 4.06-50.8z" /><animateTransform attributeName="transform" type="rotate" from="0 63.9 64.2" to="120 63.9 64.2" dur="480ms" repeatCount="indefinite"></animateTransform></g></svg>
        </IconButton>
      </Dialog>
      }
    </ModalContext.Provider>
  );
}

export default App;