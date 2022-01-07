import { useEffect, useRef, useState } from 'react';
import './App.css';
import SingleTask from './components/SingleTask/SingleTask';



function App() {
  const taskInput = useRef(null);
  const [tasks, setTasks] = useState(null)
  const [tasksLoading, setTasksLoading] = useState(true)

  useEffect(() => {
    fetch('https://to-do-srt.herokuapp.com/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .finally(() => setTasksLoading(false))
  }, [tasksLoading])


  function addNewTask(e) {
    e.preventDefault()
    if (taskInput.current.value.length === 0) {
      console.error('Input empty')
      return
    }

    const newTask = {
      timeStamp: Date.now(),
      toDo: taskInput.current.value,
      taskStatus: 'pending'
    }

    fetch('https://to-do-srt.herokuapp.com/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(data => {
        if (data.insertedId) {
          e.target.reset()
          setTasksLoading(true)
        }
      })
  }

  function deleteTask(timeStamp) {
    fetch('https://to-do-srt.herokuapp.com/tasks', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ timeStamp })
    })
      .then(res => res.json())
      .then(data => data.deletedCount === 1 && setTasksLoading(true))
  }

  return (
    <div className="App tw-px-3 tw-max-w-screen-md tw-mx-auto">
      <div className='tw-text-center'>
        <h1 className='tw-text-4xl tw-text-primary tw-font-extrabold tw-mt-6'>To do app</h1>
        <h2 className='tw-text-xs tw-text-zinc-500 tw-font-medium tw-my-2'>
          Made by <a href="http://linkedin.com/in/srtamim" target='_blank' rel='noreferrer' className='tw-underline hover_tw-text-primary hover_tw-no-underline'>SR TAMIM</a>
        </h2>
      </div>

      <div className='tw-max-w-lg tw-mx-auto tw-my-8'>
        <form onSubmit={addNewTask} className='tw-flex tw-flex-col'>
          <textarea ref={taskInput} placeholder='write new task'
            className='tw-resize-y tw-p-2 tw-mb-4 tw-caret-primary tw-border-2 tw-border-primary tw-rounded-md tw-border-dashed tw-drop-shadow-md focus_tw-outline-0'
            required></textarea>
          <input type="submit" value="Add task"
            className='tw-font-bold tw-text-primary tw-cursor-pointer tw-py-1 tw-border-primary tw-border-4 tw-border-double hover_tw-bg-red-50' />
        </form>
      </div>
      {tasksLoading ? <p className='tw-text-4xl tw-text-center tw-my-24'>Loading...</p> :
        <div id="allTasks">
          {tasks &&
            tasks.map((task, i) => <SingleTask sl={i + 1} task={task}
              functions={{ deleteTask }} key={i} />)
          }
        </div>
      }
    </div>
  );
}

export default App;
