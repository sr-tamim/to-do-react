import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Typography,
} from "@material-tailwind/react";
import { LoadingSpinner } from "../../icons";
import SingleTask from "../SingleTask/SingleTask";


export default function ToDoBody({ taskState }) {
    const { tasks, tasksLoading, authLoadingOnRender, deleteTask, changeTaskState } = taskState

    const tabs = ["tasks", "done"]
    const data = [
        { label: "tasks", tasks: tasks.filter(task => !task.taskDone) },
        { label: "done", tasks: tasks.filter(task => task.taskDone) }
    ]

    return (
        <Tabs value="tasks" className="my-12">
            <TabsHeader className="max-w-xs mx-auto">
                {tabs.map((value, i) => (
                    <Tab key={i} value={value} className="uppercase">
                        {value}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {tasksLoading && !authLoadingOnRender && <div
                className="absolute left-0 top-0 w-full h-full z-10 backdrop-blur-sm">
                    <Typography color="blue"
                        className="block mx-auto w-10 h-10 md:w-16 md:h-16 max-w-full max-h-full my-12">
                        <LoadingSpinner />
                    </Typography>
                </div>
                }
                {data.map(({ label, tasks }, i) => (
                    <TabPanel key={i} value={label}
                        id={`${label}-tab`}
                        className="flex flex-col gap-4">
                        {tasks.map((task, i) => <SingleTask task={task}
                            functions={{ deleteTask, changeTaskState }}
                            key={i} />
                        )}
                        <img src={`${label}.png`} alt={label}
                            className="fixed left-0 bottom-0 max-w-full z-[-1] opacity-20" />
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}