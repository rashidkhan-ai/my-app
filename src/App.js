import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Read from "./components/read"; // Import the Read component

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Read />} />  {/* Component for reading data */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
