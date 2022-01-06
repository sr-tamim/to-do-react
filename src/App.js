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
      <h1 className='tw-text-4xl tw-text-primary'>To do app</h1>
      <div className='tw-max-w-lg tw-mx-auto tw-my-8'>
        <form onSubmit={addNewTask} className='tw-flex tw-flex-col'>
          <textarea ref={taskInput} placeholder='write new task' className='tw-resize-y'></textarea>
          <input type="submit" value="Add task"
            className='tw-bg-primary tw-text-slate-50 tw-cursor-pointer' />
        </form>
      </div>
      <div id="allTasks">
        {tasks.map((task, i) => <SingleTask sl={i + 1} task={task} functions={{ deleteTask }} key={i} />)}
      </div>
    </div>
  );
}

export default App;
