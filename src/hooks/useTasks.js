import { useEffect, useState } from "react";

const defaultTask = {
    taskAddedTime: 1660971431388,
    toDo: "welcome to your task manager",
    taskDone: false,
    taskDoneTime: null
}

const useTasks = () => {
    // const isLoggedIn = () => localStorage.getItem('isLoggedIn')

    const [tasks, setTasks] = useState([defaultTask])
    const [taskInputValue, setTaskInputValue] = useState("")


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
            taskDone: false,
            taskDoneTime: null,
            dueDate: (e.target.querySelector('input[type="date"]').value)
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
            changedTask
        ]
        saveTasks(newData)
        loadTasks()
    }
    return {
        tasks, taskInputValue, setTaskInputValue, loadTasks,
        addNewTask, deleteTask, changeTaskState
    }
};

export default useTasks;