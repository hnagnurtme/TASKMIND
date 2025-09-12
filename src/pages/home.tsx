import TaskList from "@/components/TaskListItem";

export default function Home() {
  return (
    <div className="main-content">
      <h1 className="home-title">Welcome to Todo App</h1>
      < TaskList />
    </div>
  );
}