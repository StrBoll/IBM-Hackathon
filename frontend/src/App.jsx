import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
