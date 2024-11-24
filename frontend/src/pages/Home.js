import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="Home">
    <header className="Home-header">
        <p>Please select how you want to validate you document</p>
        <div className='Validation-Choices'>
            <Link className='Validation-Choice bg-green' to="/with-instructions">With own instructions</Link>
            <Link className='Validation-Choice bg-blue' to="/predefined-instructions">Predefined instructions</Link>
        </div>
    </header>
  </div>
  );
}

export default Home;

document.title = 'Jožo - Home';