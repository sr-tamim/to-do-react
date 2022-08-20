import { useEffect, useState } from 'react';
import './App.css';
import SingleTask from './components/SingleTask/SingleTask';
import { Button, Input } from "@material-tailwind/react";



function App() {
  const [taskInputValue, setTaskInputValue] = useState("")
  const [tasks, setTasks] = useState([])


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
    if (taskInputValue.length === 0) {
      console.error('Input empty')
      return
    }

    const newTask = {
      taskAddedTime: Date.now(),
      toDo: taskInputValue,
      taskStatus: 'pending'
    }

    // save task in localstorage
    saveTasks([...tasks, newTask])
    e.target.reset()
    setTaskInputValue('')
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
    <div className="px-3 max-w-screen-md mx-auto">
      <div className='text-center'>
        <h1 className='text-4xl text-primary font-extrabold mt-6'>To do app</h1>
        <h2 className='text-xs text-zinc-500 font-medium my-2'>
          Made by <a href="https://sr-tamim.vercel.app" target='_blank' rel='noreferrer' className='underline hover_text-primary hover_no-underline'>SR TAMIM</a>
        </h2>
      </div>

      <div className='max-w-lg mx-auto my-8'>
        <form onSubmit={addNewTask} className='flex flex-col'>
          <Input label='write new task'
            onChange={e => setTaskInputValue(e.target.value)}
            className='rounded-b-none' />
          <Button type="submit" className='rounded-t-none'
            disabled={!taskInputValue}>Add</Button>
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