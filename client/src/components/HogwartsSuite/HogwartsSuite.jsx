import React, { useState } from 'react';
import HogwartsSuiteNavbar from './Navbar';
import CGPACalculator from './CGPACalculator';
import ToolsLibrary from './ToolsLibrary';
import AcademicLibrary from './AcademicLibrary';
import './HogwartsSuite.css';

const HogwartsSuite = () => {
  const [activeSection, setActiveSection] = useState('cgpa');

  const renderActiveSection = () => {
    switch(activeSection) {
      case 'cgpa':
        return <CGPACalculator />;
      case 'tools':
        return <ToolsLibrary />;
      case 'academic':
        return <AcademicLibrary />;
      default:
        return <CGPACalculator />;
    }
  };

  return (
    <div className="hogwarts-suite">
      <HogwartsSuiteNavbar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="suite-content">
        {renderActiveSection()}
      </main>
    </div>
  );
};

export default HogwartsSuite;
