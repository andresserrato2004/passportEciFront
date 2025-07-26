import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PassportPage from "./pages/PassportPage";
import ScanPage from "./pages/ScanPage";
import { useState, useEffect } from "react";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage />}
        />
        <Route
          path="/passport"
          element={token ? <PassportPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />
        <Route
          path="/scan"
          element={token ? <ScanPage onLogout={handleLogout} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;