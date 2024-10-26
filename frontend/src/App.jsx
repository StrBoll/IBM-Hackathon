import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import HospitalMap from './components/HospitalMap';

const App = () => {
  return (
    < Router >
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/map"
              element={<HospitalMap />}
            />
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
