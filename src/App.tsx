import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/Login"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/log-in" replace />} />

        <Route path="/log-in" element={<LoginPage />} />

      </Routes>
    </Router>
  );
}

export default App;
