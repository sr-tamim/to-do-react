import { useEffect, useState } from "react";

const defaultTask = {
    taskAddedTime: 1660971431388,
    toDo: "welcome to your task manager",
    taskDone: false,
    taskDoneTime: null
}

const useTasks = () => {
    const [tasks, setTasks] = useState([defaultTask])
    const [taskInputValue, setTaskInputValue] = useState("")


    useEffect(loadTasks, [])
    // load all tasks function
    function loadTasks(email) {
        const savedTasksJson = localStorage.getItem('myTasks')
        if (!savedTasksJson) return

        const savedTasks = JSON.parse(savedTasksJson)
        // sort tasks to show new task on top
        savedTasks.sort((a, b) => b.taskAddedTime - a.taskAddedTime)

        setTasks(savedTasks)
        console.log('loading tasks', email)
    }
    async function loadTasksFromServer(email) {
        if (!email) return

        const res = await fetch(`http://localhost:5000/.netlify/functions/server/tasks/${email}`)
        const data = await res.json()

        const notSynced = tasks.filter(task => !task._id)
        saveTasks(data)
        notSynced.length && addManyTaskToServer(notSynced)
        console.log(data, notSynced)
    }

    function saveTasks(newData) {
        localStorage.setItem('myTasks', JSON.stringify(newData))
        loadTasks()
    }

    // add new task function
    function addNewTask(e, email) {
        e.preventDefault()
        // check the input is empty or not
        if (taskInputValue.length === 0) {
            console.error('Input empty')
            return
        }

        const newTask = {
            taskAddedTime: Date.now(),
            toDo: taskInputValue,
            taskDone: false,
            taskDoneTime: null,
            dueDate: (e.target.querySelector('input[type="date"]').value)
        }

        // save task in localstorage
        e.target.reset()
        setTaskInputValue('')
        email ? addTaskToServer(email, newTask)
            : saveTasks([...tasks, newTask])
    }
    function addTaskToServer(email, newTask) {
        if (!email) return;
        fetch(`http://localhost:5000/.netlify/functions/server/tasks/${email}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(res => res.json())
            .then(data => data?.insertedId && loadTasksFromServer(email))
    }
    function addManyTaskToServer(email, newTask) {
        if (!email) return;
        fetch(`http://localhost:5000/.netlify/functions/server/tasks/${email}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }

    // delete any task fron task list
    function deleteTask(taskAddedTime, email) {
        email ? deleteFromServer(email, taskAddedTime)
            : saveTasks(tasks.filter(task => task.taskAddedTime !== taskAddedTime))
    }
    function deleteFromServer(email, taskAddedTime) {
        if (!email) return
        const deleteTask = tasks.find(task => task.taskAddedTime === taskAddedTime)
        fetch(`http://localhost:5000/.netlify/functions/server/tasks/${email}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(deleteTask)
        })
            .then(res => res.json())
            .then(data => data?.deletedCount && loadTasksFromServer(email))
    }

    // change any state of any task
    function changeTaskState(changedTask) {
        const newData = [
            ...tasks.filter(task => task.taskAddedTime !== changedTask.taskAddedTime),
            changedTask
        ]
        saveTasks(newData)
    }
    return {
        tasks, taskInputValue, setTaskInputValue, saveTasks, loadTasksFromServer,
        addNewTask, deleteTask, changeTaskState
    }
};

export default useTasks;