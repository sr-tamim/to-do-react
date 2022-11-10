/* global google */
import { Avatar, Button, IconButton, Input, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import useTasks from './hooks/useTasks';
import ToDoBody from './components/ToDoBody/ToDoBody';
import useModal from "./hooks/useModal";
import { Dialog } from "@material-tailwind/react";
import { createContext, useEffect, useState } from "react";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithCredential, signInWithPopup } from "firebase/auth";
import { LoadingSpinner } from "./icons";

const firebaseApp = initializeApp(firebaseConfig)

export const ModalContext = createContext()

function App() {
  const today = new Date()
  const firebaseAuth = getAuth(firebaseApp)

  const { tasks, tasksLoading, taskInputValue, setTaskInputValue,
    loadTasksFromServer, addNewTask, deleteTask, changeTaskState } = useTasks()

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
  useEffect(() => {
    user && loadTasksFromServer(user.email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  const [GOOGLE, setGOOGLE] = useState(typeof google !== 'undefined' ? google : null)
  const defineGoogle = setInterval(() => typeof google !== 'undefined' && setGOOGLE(google), 1000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => GOOGLE && clearInterval(defineGoogle), [GOOGLE])

  function logIn() {
    setLoginProcessing(true)
    const provider = new GoogleAuthProvider()
    signInWithPopup(firebaseAuth, provider)
      .catch(error => console.dir(error))
      .finally(() => setLoginProcessing(false))
  }
  function logOut() {
    signOut(firebaseAuth)
      .then(() => GOOGLE.accounts.id.disableAutoSelect())
      .catch((error) => console.dir(error))
      .finally(() => setLoginProcessing(false))
  }
  useEffect(() => {
    if (!user && !authLoadingOnRender && GOOGLE) {
      GOOGLE.accounts.id.initialize({
        client_id: '1074914693862-4ho7v3ntlaknrphg73q4rhpo21q4ac8k.apps.googleusercontent.com',
        cancel_on_tap_outside: false,
        auto_select: true,
        callback: res => {
          setLoginProcessing(true)
          const credential = GoogleAuthProvider.credential(res.credential)
          signInWithCredential(firebaseAuth, credential)
            .catch(err => console.dir(err))
            .finally(() => setLoginProcessing(false))
        },
      })
      GOOGLE.accounts.id.renderButton(
        document.getElementById("googleOneTap"), // Ensure the element exist and it is a div to display correcctly
        { theme: "outline", size: "large", shape: 'pill' }  // Customization attributes
      );
      GOOGLE.accounts.id.prompt(noti => console.dir(noti))
    }
  }, [user, authLoadingOnRender, firebaseAuth, GOOGLE])

  return (
    <ModalContext.Provider value={{ ...modalStates, user }}>
      <div className="px-3 max-w-screen-md mx-auto">
        <div className="text-center flex flex-col items-center flex-wrap max-w-lg mx-auto">
          <div>
            <Typography variant="h1" className="uppercase">To do app</Typography>
            <a href="https://sr-tamim.vercel.app" target='_blank' rel='noreferrer' className='underline font-semibold hover_text-primary hover_no-underline'>Made by SR TAMIM</a>
          </div>
        </div>

        <div className='max-w-lg mx-auto mt-8 mb-6'>
          <form onSubmit={e => addNewTask(e, user?.email)} className='task-add-form flex flex-col md:flex-row'>

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
                  }} className="bg-transparent outline outline-0 focus:outline-0"
                  min={today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")} />
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
              <Typography className="font-bold text-xs mb-2">Login to sync through devices</Typography>
              {GOOGLE ? <button id="googleOneTap"></button>
                : <Button variant="gradient" size="sm"
                  onClick={logIn}>Sign in with Google</Button>}
            </div>
              : <div>
                <Menu>
                  <MenuHandler>
                    <Button variant="text" size="lg">
                      <Avatar src={user.photoURL} size="sm" className="mr-2" variant="circular" />
                      {user.displayName}
                    </Button>
                  </MenuHandler>
                  <MenuList className="font-bold">
                    <MenuItem onClick={logOut}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </div>
            }
          </div>}

        {/* show all tasks container */}
        <ToDoBody taskState={{ tasks, tasksLoading, authLoadingOnRender, deleteTask, changeTaskState }} />
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