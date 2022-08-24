import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import SingleTask from "../SingleTask/SingleTask";


export default function ToDoBody({ taskState }) {
    const { tasks, deleteTask, changeTaskState } = taskState

    const tabs = ["todo", "done"]
    const data = [
        { label: "todo", tasks: tasks.filter(task => !task.taskDone) },
        { label: "done", tasks: tasks.filter(task => task.taskDone) }
    ]

    return (
        <Tabs value="todo" className="my-12">
            <TabsHeader className="max-w-xs mx-auto">
                {tabs.map((value, i) => (
                    <Tab key={i} value={value} className="uppercase">
                        {value}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {data.map(({ label, tasks }, i) => (
                    <TabPanel key={i} value={label}
                        id={`${label}-tab`}
                        className="flex flex-col gap-4">
                        {tasks.map((task, i) => <SingleTask task={task}
                            functions={{ deleteTask, changeTaskState }}
                            key={i} />
                        )}
                        <img src={`${label}.png`} alt={label}
                            className="fixed left-0 bottom-0 max-w-full z-[-1] opacity-40" />
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}