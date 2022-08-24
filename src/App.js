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
import { FacebookIcon, GoogleIcon, TwitterIcon } from "./icons";

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
        </div>

        <div className='max-w-lg mx-auto mt-8 mb-6'>
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

        <div className="text-center">
          {!user ? <div>
            <Typography className="font-bold text-xs">Login to sync through devices</Typography>
            <div>
              {/* google button */}
              <IconButton variant="text" onClick={googleLogin}>
                <GoogleIcon />
              </IconButton>
              <IconButton variant="text">
                <FacebookIcon />
              </IconButton>
              <IconButton variant="text">
                <TwitterIcon />
              </IconButton>
            </div>
          </div>
            : <div>
              <Typography variant="h3">{user.displayName}</Typography>
            </div>}
        </div>
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