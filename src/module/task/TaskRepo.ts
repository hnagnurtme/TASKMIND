import { db } from "@/configurations/firebase.config";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Task } from "@/interface/task";

export class TaskRepo {
  private static tasksCache: Record<string, Task[]> = {};
  private static unsubscribers: Record<string, () => void> = {};

  /** Lấy tất cả tasks và đồng bộ realtime */
  static async getAllTasks(userId: string, callback?: (tasks: Task[]) => void): Promise<Task[]> {
    if (!this.unsubscribers[userId]) {
      const userRef = doc(db, "users", userId);
      console.log("Setting up realtime listener for user:", userId);
      this.unsubscribers[userId] = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          this.tasksCache[userId] = (data.tasks as Task[]) || [];
          if (callback) callback(this.tasksCache[userId]);
        }
      });
    }

    if (this.tasksCache[userId]) return this.tasksCache[userId];

    const snap = await getDoc(doc(db, "users", userId));
    if (snap.exists()) {
      const data = snap.data();
      this.tasksCache[userId] = (data.tasks as Task[]) || [];
      return this.tasksCache[userId];
    }

    this.tasksCache[userId] = [];
    return [];
  }

  /** Ngừng lắng nghe realtime khi logout */
  static unsubscribe(userId: string) {
    if (this.unsubscribers[userId]) {
      this.unsubscribers[userId]();
      delete this.unsubscribers[userId];
    }
  }

  /** Thêm hoặc cập nhật task */
  static async upsertTask(userId: string, task: Task): Promise<boolean> {
    try {
      const tasks = this.tasksCache[userId] || [];
      const exists = tasks.some(t => t.id === task.id);

      const updatedTasks = exists
        ? tasks.map(t => (t.id === task.id ? task : t))
        : [...tasks, task];

      this.tasksCache[userId] = updatedTasks;

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { tasks: updatedTasks });
      return true;
    } catch (error) {
      console.error("Error upserting task:", error);
      return false;
    }
  }

  /** Xóa task */
  static async deleteTask(userId: string, taskId: string): Promise<boolean> {
    try {
      const tasks = this.tasksCache[userId] || [];
      const updatedTasks = tasks.filter(t => t.id !== taskId);

      this.tasksCache[userId] = updatedTasks;
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { tasks: updatedTasks });
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }
}
