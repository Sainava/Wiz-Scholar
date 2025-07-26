import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calculator, Wrench, BookOpen } from "lucide-react";
import CGPACalculator from './HogwartsSuite/CGPACalculator';
import ToolsLibrary from './HogwartsSuite/ToolsLibrary';
import AcademicLibrary from './HogwartsSuite/AcademicLibrary';
import './HogwartsSuite/HogwartsSuite.css';

const HogwartsSuite = ({ onBack }) => {
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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-4xl font-bold text-foreground">
          🏰 Hogwarts Suite
        </h1>
        
        <div className="w-32"></div> {/* Spacer for centering */}
      </div>

      {/* Navigation */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => setActiveSection('cgpa')}
            variant={activeSection === 'cgpa' ? 'default' : 'outline'}
            className={`${
              activeSection === 'cgpa' 
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300' 
                : 'hover:bg-gradient-to-r hover:from-yellow-50 hover:to-amber-50 hover:border-yellow-400 hover:text-yellow-700 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300'
            }`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            📊 CGPA Calculator
          </Button>
          <Button
            onClick={() => setActiveSection('tools')}
            variant={activeSection === 'tools' ? 'default' : 'outline'}
            className={`${
              activeSection === 'tools' 
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300' 
                : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:border-purple-400 hover:text-purple-700 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300'
            }`}
          >
            <Wrench className="w-4 h-4 mr-2" />
            🛠️ Tools Library
          </Button>
          <Button
            onClick={() => setActiveSection('academic')}
            variant={activeSection === 'academic' ? 'default' : 'outline'}
            className={`${
              activeSection === 'academic' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform hover:scale-105 transition-all duration-300' 
                : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:border-green-400 hover:text-green-700 hover:shadow-lg hover:transform hover:scale-105 transition-all duration-300'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            📚 Academic Library
          </Button>
        </div>
      </Card>

      {/* Main Content */}
      <div className="min-h-[600px]">
        {renderActiveSection()}
      </div>
    </div>
  );
};

export default HogwartsSuite;
