import React, { useState, useEffect } from 'react';
import './HogwartsSuite.css';

// Placeholder for Cross Icon - in real implementation would be imported
const CrossIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGxpbmUgeDE9IjE4IiB5MT0iNiIgeDI9IjYiIHkyPSIxOCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxsaW5lIHgxPSI2IiB5MT0iNiIgeDI9IjE4IiB5Mj0iMTgiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';

const CGPACalculator = () => {
  const [subjects, setSubjects] = useState([{
    name: '',
    credits: '',
    grade: ''
  }]);
  
  const [semesterResults, setSemesterResults] = useState([]);
  const [overallCGPA, setOverallCGPA] = useState('0.000');
  const [viewingSemester, setViewingSemester] = useState(null);
  const [editingSemester, setEditingSemester] = useState(null);

  // Grade mapping
  const gradeMapping = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'D': 4,
    'F': 0
  };

  const getGradePoints = (grade) => gradeMapping[grade] || 0;

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('cgpaCalculatorData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setSemesterResults(data.semesterResults || []);
    }
  }, []);

  // Save data to localStorage whenever semesterResults change
  useEffect(() => {
    if (semesterResults.length > 0) {
      localStorage.setItem('cgpaCalculatorData', JSON.stringify({
        semesterResults
      }));
    }
  }, [semesterResults]);

  // Calculate overall CGPA whenever semesterResults change
  useEffect(() => {
    if (semesterResults.length > 0) {
      const totalGradePoints = semesterResults.reduce((sum, semester) => {
        return sum + (semester.sgpa * semester.credits);
      }, 0);
      
      const totalCredits = semesterResults.reduce((sum, semester) => {
        return sum + semester.credits;
      }, 0);

      const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
      setOverallCGPA(cgpa.toFixed(3));
    } else {
      setOverallCGPA('0.000');
    }
  }, [semesterResults]);

  // Calculate current SGPA
  const currentSGPA = subjects.reduce((sgpa, subject) => {
    if (subject.credits && subject.grade) {
      const credits = parseFloat(subject.credits);
      const gradePoints = getGradePoints(subject.grade);
      return sgpa + (gradePoints * credits);
    }
    return sgpa;
  }, 0) / subjects.reduce((totalCredits, subject) => {
    return totalCredits + (parseFloat(subject.credits) || 0);
  }, 0) || 0;

  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: '', grade: '' }]);
  };

  const removeSubject = (indexToRemove) => {
    setSubjects(subjects.filter((_, index) => index !== indexToRemove));
  };

  const addSemester = () => {
    if (currentSGPA > 0) {
      const newSemester = {
        semester: semesterResults.length + 1,
        sgpa: currentSGPA.toFixed(3),
        credits: subjects.reduce((sum, subject) => sum + (parseFloat(subject.credits) || 0), 0),
        subjects: subjects.filter(s => s.name && s.credits && s.grade)
      };
      
      setSemesterResults([...semesterResults, newSemester]);
      // Reset subjects for next semester
      setSubjects([{ name: '', credits: '', grade: '' }]);
    }
  };

  const removeSemester = (indexToRemove) => {
    if (window.confirm('Are you sure you want to delete this semester?')) {
      const updatedResults = semesterResults
        .filter((_, index) => index !== indexToRemove)
        .map((semester, index) => ({
          ...semester,
          semester: index + 1
        }));
      
      setSemesterResults(updatedResults);
      
      // Clear localStorage if no semesters left
      if (updatedResults.length === 0) {
        localStorage.removeItem('cgpaCalculatorData');
      }
    }
  };

  const viewSemesterDetails = (semesterIndex) => {
    setViewingSemester(semesterIndex);
  };

  const closeViewModal = () => {
    setViewingSemester(null);
  };

  const startEditingSemester = (semesterIndex) => {
    const semesterToEdit = semesterResults[semesterIndex];
    setSubjects(semesterToEdit.subjects);
    setEditingSemester(semesterIndex);
  };

  const saveEditedSemester = () => {
    if (currentSGPA > 0) {
      const updatedResults = [...semesterResults];
      updatedResults[editingSemester] = {
        ...updatedResults[editingSemester],
        sgpa: currentSGPA.toFixed(3),
        credits: subjects.reduce((sum, subject) => sum + (parseFloat(subject.credits) || 0), 0),
        subjects: subjects.filter(s => s.name && s.credits && s.grade)
      };
      
      setSemesterResults(updatedResults);
      setEditingSemester(null);
      setSubjects([{ name: '', credits: '', grade: '' }]);
    }
  };

  const cancelEditing = () => {
    setEditingSemester(null);
    setSubjects([{ name: '', credits: '', grade: '' }]);
  };

  return (
    <div className="cgpa-calculator">
      <h2>🎓 CGPA Calculator</h2>
      
      {/* Current Semester Input */}
      <div className="current-semester">
        <h3>{editingSemester !== null ? 
          `✏️ Editing Semester ${semesterResults[editingSemester].semester}` : 
          `📚 Semester ${semesterResults.length + 1}`
        }</h3>
        
        <div className="subjects-container">
          <div className="subject-header">
            <span>Subject Name</span>
            <span>Credits</span>
            <span>Grade</span>
            <span>Grade Points</span>
            <span>Action</span>
          </div>
          
          {subjects.map((subject, index) => (
            <div key={index} className="subject-row">
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => {
                  const newSubjects = [...subjects];
                  newSubjects[index].name = e.target.value;
                  setSubjects(newSubjects);
                }}
              />
              <input
                type="number"
                placeholder="Credits"
                min="0"
                max="10"
                step="0.5"
                value={subject.credits}
                onChange={(e) => {
                  const newSubjects = [...subjects];
                  newSubjects[index].credits = e.target.value;
                  setSubjects(newSubjects);
                }}
              />
              <select
                value={subject.grade}
                onChange={(e) => {
                  const newSubjects = [...subjects];
                  newSubjects[index].grade = e.target.value;
                  setSubjects(newSubjects);
                }}
              >
                <option value="">Select Grade</option>
                <option value="O">O (10)</option>
                <option value="A+">A+ (9)</option>
                <option value="A">A (8)</option>
                <option value="B+">B+ (7)</option>
                <option value="B">B (6)</option>
                <option value="C">C (5)</option>
                <option value="D">D (4)</option>
                <option value="F">F (0)</option>
              </select>
              <span className="grade-points">
                {subject.credits && subject.grade ? 
                  (getGradePoints(subject.grade) * parseFloat(subject.credits)).toFixed(1) : 
                  '0.0'
                }
              </span>
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(index)} className="remove-btn">
                  <img src={CrossIcon} alt="Remove" className="cross-icon" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Current SGPA Display */}
        <div className="current-sgpa">
          <h4>Current SGPA: <span className="sgpa-value">{currentSGPA.toFixed(3)}</span></h4>
          <p>Total Credits: {subjects.reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0)}</p>
        </div>

        <div className="action-buttons">
          <button onClick={addSubject} className="add-subject-btn">
            ➕ Add Subject
          </button>
          
          {editingSemester !== null ? (
            <>
              <button 
                onClick={saveEditedSemester} 
                className="save-edit-btn"
                disabled={currentSGPA === 0}
              >
                💾 Save Changes
              </button>
              <button onClick={cancelEditing} className="cancel-edit-btn">
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={addSemester} 
              className="add-semester-btn"
              disabled={currentSGPA === 0}
            >
              📚 Complete Semester
            </button>
          )}
        </div>
      </div>

      {/* Semester Results */}
      {semesterResults.length > 0 && (
        <div className="semester-results">
          <h3>📈 Academic Progress</h3>
          <div className="results-table">
            <table>
              <thead>
                <tr>
                  <th>Semester</th>
                  <th>SGPA</th>
                  <th>Credits</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {semesterResults.map((semester, index) => (
                  <tr key={index}>
                    <td>Semester {semester.semester}</td>
                    <td>{semester.sgpa}</td>
                    <td>{semester.credits}</td>
                    <td>
                      <span className={`performance ${getPerformanceClass(semester.sgpa)}`}>
                        {getPerformanceLabel(semester.sgpa)}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          onClick={() => viewSemesterDetails(index)}
                          className="view-btn"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => startEditingSemester(index)}
                          className="edit-btn"
                          title="Edit Semester"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => removeSemester(index)}
                          className="delete-semester-btn"
                          title="Delete Semester"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall CGPA Display */}
          <div className="cgpa-result">
            <h2>🎯 Overall CGPA: <span className="cgpa-score">{overallCGPA}</span></h2>
            <div className="cgpa-details">
              <p>Based on {semesterResults.length} semester(s)</p>
              <p>Total Credits: {semesterResults.reduce((sum, s) => sum + s.credits, 0)}</p>
              <p className={`overall-performance ${getPerformanceClass(overallCGPA)}`}>
                Performance: {getPerformanceLabel(overallCGPA)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* View Semester Modal */}
      {viewingSemester !== null && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Semester {semesterResults[viewingSemester].semester} Details</h3>
              <button onClick={closeViewModal} className="close-modal-btn"><img src={CrossIcon} alt="Close" className="cross-icon" /></button>
            </div>
            
            <div className="modal-body">
              <div className="semester-summary">
                <div className="summary-item">
                  <span className="label">SGPA:</span>
                  <span className="value">{semesterResults[viewingSemester].sgpa}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Total Credits:</span>
                  <span className="value">{semesterResults[viewingSemester].credits}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Performance:</span>
                  <span className={`value performance ${getPerformanceClass(semesterResults[viewingSemester].sgpa)}`}>
                    {getPerformanceLabel(semesterResults[viewingSemester].sgpa)}
                  </span>
                </div>
              </div>

              <h4>Subjects:</h4>
              <div className="subjects-list">
                {semesterResults[viewingSemester].subjects.map((subject, index) => (
                  <div key={index} className="subject-item">
                    <div className="subject-name">{subject.name}</div>
                    <div className="subject-details">
                      <span>Credits: {subject.credits}</span>
                      <span>Grade: {subject.grade}</span>
                      <span>Points: {(getGradePoints(subject.grade) * parseFloat(subject.credits)).toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for performance labels
const getPerformanceClass = (gpa) => {
  if (gpa >= 9.0) return 'excellent';
  if (gpa >= 8.0) return 'good';
  if (gpa >= 7.0) return 'average';
  if (gpa >= 6.0) return 'below average';
  return 'below-average';
};

const getPerformanceLabel = (gpa) => {
  if (gpa >= 9.0) return 'Outstanding';
  if (gpa >= 8.0) return 'Good';
  if (gpa >= 7.0) return 'Average';
  if (gpa >= 6.0) return 'Below Average';
  if (gpa >= 5.0) return 'Pass';
  return 'Fail/Backlog';
};

export default CGPACalculator;
