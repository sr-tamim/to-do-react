import React from 'react';

const SingleTask = ({ sl, task, functions }) => {
    const { deleteTask } = functions

    return (
        <div className='tw-my-6'>
            <i>{sl} {task.timeStamp}</i>
            <h4 className='tw-font-bold tw-text-xl'>{task.toDo}</h4>
            <h6 className='tw-text-md'>{task.taskStatus}</h6>
            <button
                className='tw-text-primary tw-border-primary tw-border-2 tw-px-4 tw-my-2'
                onClick={() => deleteTask(task.timeStamp)}>Delete</button>
        </div>
    );
};

export default SingleTask;