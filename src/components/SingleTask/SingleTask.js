import React from 'react';

const SingleTask = ({ sl, task, functions }) => {
    const { deleteTask, changeTaskState } = functions

    const taskAddedTime = new Date(task.timeStamp)
    return (
        <div className='tw-my-6'>
            <i>{sl}</i>
            <h4 className={`tw-font-bold tw-text-xl ${task.taskStatus === 'done' && 'tw-line-through'}`}>{task.toDo}</h4>
            <h6 className='tw-text-md'>{task.taskStatus}</h6>
            <time className='tw-text-gray-500 tw-text-xs'>
                Added at {taskAddedTime.toLocaleString()}
            </time> <br />
            <button
                className='tw-text-primary tw-border-primary hover_tw-bg-red-100 tw-border-2 tw-px-4 tw-my-2 tw-rounded-md'
                onClick={() => changeTaskState({ ...task, taskStatus: 'done' })}>
                Done
            </button>

            <button
                className='tw-text-primary tw-border-primary hover_tw-bg-red-100 tw-border-2 tw-px-4 tw-m-2 tw-rounded-md'
                onClick={() => deleteTask(task.timeStamp)}>
                Delete
            </button>
        </div>
    );
};

export default SingleTask;