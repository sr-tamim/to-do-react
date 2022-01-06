import { useRef, useState } from 'react';
import './App.css';
import SingleTask from './components/SingleTask/SingleTask';



function App() {
  const taskInput = useRef(null);
  const [tasks, setTasks] = useState([
    {
      timeStamp: Date.now(),
      toDo: 'the quick brown fox jumps over a lazy dog',
      taskStatus: 'pending'
    }
  ])


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
    setTasks([...tasks, newTask])
  }

  function deleteTask(timeStamp) {
    setTasks(tasks.filter(task => task.timeStamp !== timeStamp))
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
            className='tw-resize-y tw-p-2 tw-mb-4 tw-caret-primary tw-border-2 tw-border-primary tw-rounded-md tw-border-dashed tw-drop-shadow-md'
            required></textarea>
          <input type="submit" value="Add task"
            className='tw-font-bold tw-text-primary tw-cursor-pointer tw-py-1 tw-border-primary tw-border-4 tw-border-double hover_tw-bg-red-50' />
        </form>
      </div>
      <div id="allTasks">
        {tasks.map((task, i) => <SingleTask sl={i + 1} task={task} functions={{ deleteTask }} key={i} />)}
      </div>
    </div>
  );
}

export default App;
