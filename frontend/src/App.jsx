import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './components/Navbar'

const App = () => {
  return (
    < Router >
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={<div>Home</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
