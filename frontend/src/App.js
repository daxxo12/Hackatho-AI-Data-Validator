import './App.css';
import {Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home'; 
import Validating from './pages/Validating'; 
import WithInstructions from './pages/WithInstructions';
import PredefinedInstructions from './pages/PredefinedInstructions';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <div id="App-header">
          <Link className="logotext" to="/">Jožo - The AI Validator</Link>
            <Routes>
              <Route path='/' element={<Home />} /> 
              <Route path="/validating" element={<Validating />} /> 
              <Route path="/with-instructions" element={<WithInstructions />} />
              <Route path="/predefined-instructions" element={<PredefinedInstructions />} />
            </Routes>
          </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

document.title = 'Jožo';