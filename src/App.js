import { Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} exact />
      </Routes>
    </div>
  );
}

export default App;
