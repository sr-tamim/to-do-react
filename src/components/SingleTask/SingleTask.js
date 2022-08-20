import React from 'react';
import './SingleTask.css'

const SingleTask = ({ task, functions }) => {
    const { deleteTask, changeTaskState } = functions

    const taskAddedTime = new Date(task.taskAddedTime)
    const taskDoneTime = new Date(task.taskDoneTime)
    return (
        <div className='my-6'>
            <div>
                <input type="checkbox" />
            </div>
            <h4 className={`font-bold text-xl ${task.taskStatus === 'done' && 'line-through'}`}>{task.toDo}</h4>

            <div className="taskInformations">
                <h6 className='text-md'>{task.taskStatus}</h6>
                <time className="text-gray-500 text-xs after:content-['*'] after:ml-0.5 after:text-red-500">
                    Created at {taskAddedTime.toLocaleString()}
                </time>
                {task.taskDoneTime &&
                    <time className='text-gray-500 text-xs'>
                        Done at {taskDoneTime.toLocaleString()}
                    </time>}
            </div>
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
    );
};

export default SingleTask;