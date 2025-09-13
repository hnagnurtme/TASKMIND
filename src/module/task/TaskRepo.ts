// TaskRepo.ts
import { db } from "@/configurations/firebase.config";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { Task } from "@/interface/task";

export class TaskRepo {
  private static tasksCache: Record<string, Task[]> = {};
  private static unsubscribers: Record<string, () => void> = {};

  /** Lấy tất cả tasks */
  static async getAllTasks(uid: string): Promise<Task[]> {
    if (this.tasksCache[uid]) return this.tasksCache[uid];

    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      const data = snap.data();
      this.tasksCache[uid] = (data.tasks as Task[]) || [];
      return this.tasksCache[uid];
    }

    this.tasksCache[uid] = [];
    return [];
  }

  /** Ngừng lắng nghe realtime */
  static unsubscribe(uid: string) {
    if (this.unsubscribers[uid]) {
      this.unsubscribers[uid]();
      delete this.unsubscribers[uid];
    }
  }

  /** Thêm hoặc cập nhật task */
  static async upsertTask(uid: string, task: Task): Promise<boolean> {
    try {
      const tasks = this.tasksCache[uid] || [];
      const exists = tasks.some(t => t.id === task.id);
      const updatedTasks = exists ? tasks.map(t => t.id === task.id ? task : t) : [...tasks, task];

      this.tasksCache[uid] = updatedTasks;
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { tasks: updatedTasks });
      return true;
    } catch (error) {
      console.error("Error upserting task:", error);
      return false;
    }
  }

  /** Xóa task */
  static async deleteTask(uid: string, taskId: string): Promise<boolean> {
    try {
      const tasks = this.tasksCache[uid] || [];
      const updatedTasks = tasks.filter(t => t.id !== taskId);

      this.tasksCache[uid] = updatedTasks;
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { tasks: updatedTasks });
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  }

  /** Lắng nghe realtime tasks */
  static listenTasks(uid: string, callback: (tasks: Task[]) => void): () => void {
    if (this.unsubscribers[uid]) return this.unsubscribers[uid]; // đã có listener

    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const tasks: Task[] = (data.tasks as Task[]) || [];
      this.tasksCache[uid] = tasks;
      callback(tasks);
    });

    this.unsubscribers[uid] = unsubscribe;
    return unsubscribe;
  }
}
