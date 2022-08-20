import './App.css';
import SingleTask from './components/SingleTask/SingleTask';
import { Button, Input, Typography } from "@material-tailwind/react";
import useTasks from './hooks/useTasks';



function App() {
  const { tasks, taskInputValue, setTaskInputValue,
    addNewTask, deleteTask, changeTaskState } = useTasks()

  return (
    <div className="px-3 max-w-screen-md mx-auto">
      <div className='text-center'>
        <Typography variant="h1">To do app</Typography>
        <Typography variant="h6">
          Made by <a href="https://sr-tamim.vercel.app" target='_blank' rel='noreferrer' className='underline hover_text-primary hover_no-underline'>SR TAMIM</a>
        </Typography>
      </div>

      <div className='max-w-lg mx-auto my-8'>
        <form onSubmit={addNewTask} className='flex flex-col'>
          <Input label='write new task'
            onChange={e => setTaskInputValue(e.target.value)}
            className='rounded-b-none' />
          <Button type="submit" className='rounded-t-none'
            disabled={!taskInputValue} variant="gradient">Add</Button>
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