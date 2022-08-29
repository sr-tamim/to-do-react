import { IconButton, Typography } from '@material-tailwind/react';
import React, { useContext } from 'react';
import { ModalContext } from '../../App';
import DeleteModal from '../Modals/DeleteModal';
import './SingleTask.css'

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const SingleTask = ({ task, functions }) => {
    const { deleteTask, changeTaskState } = functions

    const taskAddedTime = new Date(task.taskAddedTime)
    const taskDoneTime = new Date(task.taskDoneTime)

    const timeDifference = pastTime => Math.ceil((Date.now() - pastTime) / (1000 * 60 * 60))

    const { setModalBody, setModalOpen, user } = useContext(ModalContext)
    const openDeleteModal = (taskAddedTime) => {
        setModalBody(<DeleteModal deleteTask={() => deleteTask(taskAddedTime, user?.email)} />)
        setModalOpen(true)
    }

    const openDetailsModal = (taskAddedTime) => {
        console.log(taskAddedTime)
    }

    return (
        <div className={`flex items-center bg-[#ffffff66] backdrop-blur-sm
        md:backdrop-blur-none md:hover:backdrop-blur-sm p-4 rounded-lg
        cursor-pointer shadow-md hover:shadow-lg transition duration-300`}
            onClick={() => openDetailsModal(task.taskAddedTime)}>
            <div className='grow'>
                <Typography variant="h5" className={`first-letter:uppercase mb-2 ${task.taskDone && 'line-through'}`}>{task.toDo}</Typography>

                <div className="taskInformations">
                    <time className="text-xs"
                        dateTime={taskAddedTime}
                        title={taskAddedTime.toLocaleString()}>
                        Created on {
                            timeDifference(task.taskAddedTime) < 24 ? `${taskAddedTime.getHours().toString().padStart(2, "0")}:${taskAddedTime.getMinutes().toString().padStart(2, "0")}`
                                : `${taskAddedTime.getDate().toString().padStart(2, "0")} ${months[taskAddedTime.getMonth()]}`
                        }
                    </time>
                    {task.taskDoneTime &&
                        <time className='text-xs'
                            dateTime={taskDoneTime}
                            title={taskDoneTime.toLocaleString()}>
                            Done on {
                                timeDifference(task.taskDoneTime) < 24 ? `${taskDoneTime.getHours()}:${taskDoneTime.getMinutes()}`
                                    : `${taskDoneTime.getDate()} ${months[taskDoneTime.getMonth()]}`
                            }
                        </time>}
                    {task.dueDate &&
                        <time className='text-xs'
                            dateTime={task.dueDate}>
                            Due Date: {`${task.dueDate.split('-')[2]} ${months[task.dueDate.split('-')[1] - 1]}`}
                        </time>}
                </div>
            </div>
            <div className='flex items-center gap-3'>
                <IconButton size='sm' variant={task.taskDone ? "gradient" : "outlined"}
                    className="shadow-md"
                    onClick={() => changeTaskState({
                        ...task, taskDone: !task.taskDone,
                        taskDoneTime: !task.taskDone ? Date.now() : null
                    }, user?.email)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                        className='scale-75 fill-current' viewBox="0 0 24 24"><path d="M0 11.386l1.17-1.206c1.951.522 5.313 1.731 8.33 3.597 3.175-4.177 9.582-9.398 13.456-11.777l1.044 1.073-14 18.927-10-10.614z" /></svg>
                </IconButton>

                <IconButton size="sm" variant="gradient"
                    onClick={() => openDeleteModal(task.taskAddedTime)}>
                    <svg width="24" height="24"
                        className='scale-75 fill-current'
                        xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M19 24h-14c-1.104 0-2-.896-2-2v-16h18v16c0 1.104-.896 2-2 2m-9-14c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6-5h-20v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2zm-12-2h4v-1h-4v1z" /></svg>
                </IconButton>
            </div>
        </div>
    );
};

export default SingleTask;