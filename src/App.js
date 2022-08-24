import { Button, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import useTasks from './hooks/useTasks';
import ToDoBody from './components/ToDoBody/ToDoBody';
import useModal from "./hooks/useModal";
import { Dialog } from "@material-tailwind/react";
import { createContext, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { FacebookIcon, GoogleIcon, LoadingSpinner, TwitterIcon } from "./icons";

const firebaseApp = initializeApp(firebaseConfig)

export const ModalContext = createContext()

function App() {
  const firebaseAuth = getAuth(firebaseApp)

  const { tasks, taskInputValue, setTaskInputValue,
    addNewTask, deleteTask, changeTaskState } = useTasks()

  const modalStates = useModal()
  const { modalOpen, modalBody, closeModal } = modalStates


  const [user, setUser] = useState(null)
  const [loginProcessing, setLoginProcessing] = useState(false)
  const [authLoadingOnRender, setAuthLoadingOnRender] = useState(true)
  onAuthStateChanged(firebaseAuth, newUser => {
    (newUser && !user) && setUser(newUser.providerData[0]);
    (!newUser && user) && setUser(null)
    authLoadingOnRender && setAuthLoadingOnRender(false)
  })

  function googleLogin() {
    setLoginProcessing(true)
    const provider = new GoogleAuthProvider()
    signInWithPopup(firebaseAuth, provider)
      .catch((error) => console.dir(error))
      .finally(() => setLoginProcessing(false))
  }
  function logOut() {
    signOut(firebaseAuth).catch((error) => console.dir(error))
      .finally(() => setLoginProcessing(false))
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

        {loginProcessing ? <IconButton variant="text"
          className="block mx-auto w-14 h-14 max-w-full max-h-full">
          <LoadingSpinner />
        </IconButton>
          : !authLoadingOnRender && <div className="text-center">
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
                <Menu>
                  <MenuHandler>
                    <Button variant="text" size="lg">{user.displayName}</Button>
                  </MenuHandler>
                  <MenuList className="font-bold">
                    <MenuItem onClick={logOut}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            }
          </div>}
        <ToDoBody taskState={{ tasks, deleteTask, changeTaskState }} />
      </div>

      {modalBody && <Dialog open={modalOpen} handler={closeModal} size="xl" className={`w-11/12 min-w-min max-w-max`}>
        {modalBody}
      </Dialog>}

      {authLoadingOnRender && <Dialog open={authLoadingOnRender} size="sm"
        className="bg-transparent outline-0 shadow-none">
        <IconButton variant="text" className="block mx-auto text-white w-36 h-36 max-w-full max-h-full focus:outline-0">
          <LoadingSpinner />
        </IconButton>
      </Dialog>
      }
    </ModalContext.Provider>
  );
}

export default App;