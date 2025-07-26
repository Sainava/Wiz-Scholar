import React from 'react';
import './HogwartsSuite.css';

const HogwartsSuiteNavbar = ({ activeSection, setActiveSection }) => {
  return (
    <nav className="hogwarts-navbar">
      <div className="nav-container">
        <h1 className="suite-title">🏰 Hogwarts Suite</h1>
        <ul className="nav-menu">
          <li>
            <button 
              className={`nav-link ${activeSection === 'cgpa' ? 'active' : ''}`}
              onClick={() => setActiveSection('cgpa')}
            >
              📊 CGPA Calculator
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeSection === 'tools' ? 'active' : ''}`}
              onClick={() => setActiveSection('tools')}
            >
              🛠️ Tools
            </button>
          </li>
          <li>
            <button 
              className={`nav-link ${activeSection === 'academic' ? 'active' : ''}`}
              onClick={() => setActiveSection('academic')}
            >
              📚 Academic Library
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default HogwartsSuiteNavbar;
