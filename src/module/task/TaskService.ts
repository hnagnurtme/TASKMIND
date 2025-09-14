import { Task } from "@/interface/task";
import { TaskRepo } from "./TaskRepo";
export const TaskService = {

    getAllTasksById: async (id : string ) => {
        await TaskRepo.getAllTasks(id);
    },

    upsertTask : async (id : string, task : any) => {
        await TaskRepo.upsertTask(id, task);
    },

    deleteTask : async (id : string, taskId : string) => {
        await TaskRepo.deleteTask(id, taskId);
    },
    listenTasks: async (uid: string, callback: (tasks: Task[]) => void): Promise<() => void> => {
    return TaskRepo.listenTasks(uid, callback);
  },

}