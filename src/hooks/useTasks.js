import { useEffect, useState } from "react";

const defaultTask = {
    taskAddedTime: 1660971431388,
    toDo: "welcome to your task manager",
    taskDone: false,
    taskDoneTime: null
}

const useTasks = () => {
    const [tasks, setTasks] = useState([defaultTask])
    const [tasksLoading, setTasksLoading] = useState(true)
    const [taskInputValue, setTaskInputValue] = useState("")

    const startLoading = () => setTasksLoading(true)
    const stopLoading = () => setTasksLoading(false)

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
    // save task list in local storage
    function saveTasks(newData) {
        localStorage.setItem('myTasks', JSON.stringify(newData))
        loadTasks() // load task list after saving
    }
    // add new task function
    function addNewTask(e, email) {
        e.preventDefault()
        // check the input is empty or not
        if (taskInputValue.length === 0) return

        const newTask = {
            taskAddedTime: Date.now(),
            toDo: taskInputValue,
            taskDone: false,
            taskDoneTime: null,
            dueDate: (e.target.querySelector('input[type="date"]').value)
        }
        e.target.reset() // reset the form
        setTaskInputValue('') // reset task input value state

        email ? addTaskToServer(email, newTask)
            : saveTasks([...tasks, newTask])
    }
    // delete any task from task list
    function deleteTask(taskAddedTime, email) {
        email ? deleteFromServer(email, taskAddedTime)
            : saveTasks(tasks.filter(task => task.taskAddedTime !== taskAddedTime))
    }
    // change any state of any task
    function changeTaskState(changedTask, email) {
        email ? updateTaskInServer(email, changedTask)
            : saveTasks([
                ...tasks.filter(task => task.taskAddedTime !== changedTask.taskAddedTime),
                changedTask
            ])
    }

    // sync to server functions
    function loadTasksFromServer(email) {
        if (!email) return
        startLoading()
        // find out tasks which are not synced with server
        const notSynced = tasks.filter(task => !task._id && task.taskAddedTime !== defaultTask.taskAddedTime)

        notSynced.length ? addManyTaskToServer(email, notSynced)
            : fetch(`https://to-do-server.netlify.app/.netlify/functions/server/tasks/${email}`)
                .then(res => res.json())
                .then(data => data.length && saveTasks(data))
                .catch(err => console.dir(err))
                .finally(stopLoading)
    }
    // add single task to server
    function addTaskToServer(email, newTask) {
        if (!email) return;
        startLoading()
        fetch(`https://to-do-server.netlify.app/.netlify/functions/server/tasks/${email}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newTask)
        }).then(res => res.json())
            .then(data => data?.insertedId && saveTasks(data.allTasks))
            .catch(err => console.dir(err))
            .finally(stopLoading)
    }
    // add an array of tasks to server
    function addManyTaskToServer(email, newTasks) {
        if (!email) return;
        startLoading()
        fetch(`https://to-do-server.netlify.app/.netlify/functions/server/tasks/addMultipleTasks/${email}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newTasks)
        }).then(res => res.json())
            .then(data => data?.insertedCount && saveTasks(data.allTasks))
            .catch(err => console.dir(err))
            .finally(stopLoading)
    }
    // delete single task from server
    function deleteFromServer(email, taskAddedTime) {
        if (!email) return
        startLoading()
        const deleteTask = tasks.find(task => task.taskAddedTime === taskAddedTime)
        fetch(`https://to-do-server.netlify.app/.netlify/functions/server/tasks/${email}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(deleteTask)
        }).then(res => res.json())
            .then(data => data?.deletedCount && saveTasks(data.allTasks))
            .catch(err => console.dir(err))
            .finally(stopLoading)
    }
    // update single task in server
    function updateTaskInServer(email, changedTask) {
        if (!email) return
        startLoading()
        fetch(`https://to-do-server.netlify.app/.netlify/functions/server/tasks/${email}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(changedTask)
        }).then(res => res.json())
            .then(data => data?.modifiedCount && saveTasks(data.allTasks))
            .catch(err => console.dir(err))
            .finally(stopLoading)
    }
    return {
        tasks, taskInputValue, setTaskInputValue, loadTasksFromServer,
        addNewTask, deleteTask, changeTaskState, tasksLoading
    }
};

export default useTasks;