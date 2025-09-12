import useRoutesElements from "./hooks/useRoutesElements";
import Modal from "react-modal";

// Gắn element chính của app cho modal
Modal.setAppElement("#root"); // "#root" là id của div gốc trong index.html
function App() {
  const routerDom = useRoutesElements();
  return <>{routerDom}</>;
}

export default App;
