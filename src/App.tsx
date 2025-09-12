import useRoutesElements from "./hooks/useRoutesElements";

function App() {
  const routerDom = useRoutesElements();
  return <>{routerDom}</>;
}

export default App;
