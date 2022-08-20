import { Checkbox } from '@material-tailwind/react';
import React from 'react';
import './SingleTask.css'

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const SingleTask = ({ task, functions }) => {
    const { deleteTask, changeTaskState } = functions

    const taskAddedTime = new Date(task.taskAddedTime)
    const taskDoneTime = new Date(task.taskDoneTime)
    return (
        <div className='flex items-center'>
            <div>
                <Checkbox />
            </div>
            <div className='grow'>
                <h4 className={`font-bold text-xl ${task.taskStatus === 'done' && 'line-through'}`}>{task.toDo}</h4>

                <div className="taskInformations">
                    <h6 className='text-md'>{task.taskStatus}</h6>
                    <time className="text-gray-500 text-xs"
                        title={taskAddedTime.toLocaleString()}>
                        Created on {`${taskAddedTime.getDate()} ${months[taskAddedTime.getMonth()]}`}
                    </time>
                    {task.taskDoneTime &&
                        <time className='text-gray-500 text-xs'
                            title={taskDoneTime.toLocaleString()}>
                            Done on {`${taskDoneTime.getDate()} ${months[taskDoneTime.getMonth()]}`}
                        </time>}
                </div>
            </div>
            <div>
                <button
                    className='text-primary border-primary hover_bg-red-100 border-2 px-4 my-2 rounded-md'
                    onClick={() => changeTaskState({ ...task, taskStatus: 'done' })}>
                    Done
                </button>

                <button
                    className='text-primary border-primary hover_bg-red-100 border-2 px-4 m-2 rounded-md'
                    onClick={() => deleteTask(task.taskAddedTime)}>
                    Delete
                </button>
            </div>
        </div>
    );
};

export default SingleTask;