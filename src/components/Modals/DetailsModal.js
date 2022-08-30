import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Checkbox
} from "@material-tailwind/react";
import { useContext, useState } from "react";
import { ModalContext } from "../../App";
import { isSameObjects } from "../../others/someFunctions";

const DetailsModal = ({ task, functions }) => {
    const { closeModal } = useContext(ModalContext)
    const [editContents, setEditContents] = useState(false)
    const [editedValues, setEditedValues] = useState(null)

    const handleChanges = (key, value) => {
        setEditContents(true)
        const newValues = editedValues || {}
        newValues[key] = value
        setEditedValues(newValues)
    }

    const today = new Date()
    const taskAddedTime = new Date(task.taskAddedTime)
    const taskDoneTime = new Date(task.taskDoneTime)
    const taskDueDate = new Date(task.dueDate)

    const { user } = useContext(ModalContext)
    const { changeTaskState } = functions
    function updateTask() {
        if (!editContents) return
        const updatedTask = { ...task }
        for (const key in editedValues) {
            updatedTask[key] = editedValues[key]
        }
        updatedTask.taskDoneTime = updatedTask.taskDone ? Date.now() : null
        if (isSameObjects(updatedTask, task)) return
        changeTaskState(updatedTask, user?.email)
        closeModal()
    }

    return (
        <div onSubmit={updateTask} className="w-[30rem] 2xl:w-[40rem] max-w-[90vw]">
            <DialogHeader>Task Details</DialogHeader>
            <DialogBody divider className="text-lg 2xl:text-xl grid gap-x-2.5 gap-y-1.5 grid-cols-[max-content_1fr]">
                <>
                    <span className="font-bold">Task:</span>
                    {!editContents ? <span className="first-letter:uppercase">{task.toDo}</span>
                        : <input className="px-1.5 border border-gray-400 rounded text-base 2xl:text-lg focus:outline-blue-500"
                            defaultValue={task.toDo} required
                            onChange={e => handleChanges('toDo', e.target.value)} />}
                </>
                <>
                    <span className="font-bold">Date Created:</span>
                    <span className="first-letter:uppercase">{taskAddedTime.toLocaleString()}</span>
                </>
                <>
                    <span className="font-bold">Due Date:</span>
                    {!editContents ? <span className="first-letter:uppercase">{task.dueDate ? taskDueDate.toLocaleDateString() : 'Not configured'}</span>
                        : <input type="date" className="px-1.5 border border-gray-400 rounded text-base 2xl:text-lg focus:outline-blue-500"
                            onChange={e => handleChanges('dueDate', e.target.value)}
                            defaultValue={task.dueDate}
                            min={today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0")}
                        />}
                </>
                {task.taskDoneTime && <>
                    <span className="font-bold">Completed on:</span>
                    <span className="first-letter:uppercase">{taskDoneTime.toLocaleString()}</span>
                </>}
                <div className="col-span-2 text-center text-base">
                    <Checkbox defaultChecked={task.taskDone} label="Completed" className="focus:outline-0"
                    onChange={e=>handleChanges('taskDone', e.target.checked)} />
                </div>
            </DialogBody>
            <DialogFooter className="gap-4">
                {!editContents ?  <Button variant="gradient"
                    onClick={() => setEditContents(true)}>Edit</Button>
                    :  <Button variant="outlined"
                        onClick={updateTask}>Update</Button>}
                <Button onClick={closeModal} variant="gradient" color="red" >Close</Button>
            </DialogFooter>
        </div>
    );
};

export default DetailsModal;