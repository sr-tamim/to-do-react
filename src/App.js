import { useEffect, useRef, useState } from 'react';
import './App.css';
import SingleTask from './components/SingleTask/SingleTask';



function App() {
  const taskInput = useRef(null);
  const [tasks, setTasks] = useState([])
  console.log(tasks)


  useEffect(loadTasks, [])
  // load all tasks function
  function loadTasks() {
    const savedTasksJson = localStorage.getItem('myTasks')
    if (!savedTasksJson) return

    const savedTasks = JSON.parse(savedTasksJson)
    // sort tasks to show new task on top
    savedTasks.sort((a, b) => b.taskAddedTime - a.taskAddedTime)

    setTasks(savedTasks)
  }
  function saveTasks(newData) {
    localStorage.setItem('myTasks', JSON.stringify(newData))
  }

  // add new task function
  function addNewTask(e) {
    e.preventDefault()
    // check the input is empty or not
    if (taskInput.current.value.length === 0) {
      console.error('Input empty')
      return
    }

    const newTask = {
      taskAddedTime: Date.now(),
      toDo: taskInput.current.value,
      taskStatus: 'pending'
    }

    // save task in localstorage
    saveTasks([...tasks, newTask])
    e.target.reset()
    loadTasks()
  }

  // delete any task fron task list
  function deleteTask(taskAddedTime) {
    saveTasks(tasks.filter(task => task.taskAddedTime !== taskAddedTime))
    loadTasks()
  }

  // change any state of any task
  function changeTaskState(changedTask) {
    const newData = [
      ...tasks.filter(task => task.taskAddedTime !== changedTask.taskAddedTime),
      { ...changedTask, taskDoneTime: Date.now() }
    ]
    saveTasks(newData)
    loadTasks()
  }

  return (
    <div className="tw-px-3 tw-max-w-screen-md tw-mx-auto">
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
      <div id="allTasks">
        {tasks.map((task, i) => <SingleTask task={task}
          functions={{ deleteTask, changeTaskState }} key={i} />)}
      </div>
    </div>
  );
}

export default App;