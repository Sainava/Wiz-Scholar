import React, { useState } from 'react';
import CrossIcon from '../../assets/cross.svg';

const CGPACalculator = () => {
  const [subjects, setSubjects] = useState([
    { name: '', credits: '', grade: '' }
  ]);
  const [semesterResults, setSemesterResults] = useState([]);
  const [overallCGPA, setOverallCGPA] = useState(0);
  const [editingSemester, setEditingSemester] = useState(null);
  const [viewingSemester, setViewingSemester] = useState(null);
  const [targetCGPA, setTargetCGPA] = useState('');
  const [targetSemesters, setTargetSemesters] = useState('');
  const [showTargetCalculator, setShowTargetCalculator] = useState(false);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: '', grade: '' }]);
  };

  const removeSubject = (index) => {
    if (subjects.length > 1) {
      const newSubjects = subjects.filter((_, i) => i !== index);
      setSubjects(newSubjects);
    }
  };

  // Calculate grade points based on grade
  const getGradePoints = (grade) => {
    const gradeMap = {
      'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'D': 4, 'F': 0
    };
    return gradeMap[grade] || parseFloat(grade) || 0;
  };

  // Calculate SGPA for current subjects
  const calculateCurrentSGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach(subject => {
      if (subject.credits && subject.grade) {
        const credits = parseFloat(subject.credits);
        const gradePoints = getGradePoints(subject.grade);
        totalCredits += credits;
        totalGradePoints += credits * gradePoints;
      }
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
  };

  // Add semester to results
  const addSemester = () => {
    const sgpa = calculateCurrentSGPA();
    const totalCredits = subjects.reduce((sum, subject) => {
      return sum + (parseFloat(subject.credits) || 0);
    }, 0);

    if (totalCredits === 0) {
      alert('Please add subjects with credits and grades');
      return;
    }

    const newSemester = {
      semester: semesterResults.length + 1,
      subjects: [...subjects],
      sgpa: parseFloat(sgpa.toFixed(3)),
      credits: totalCredits
    };

    const updatedResults = [...semesterResults, newSemester];
    setSemesterResults(updatedResults);
    
    // Calculate overall CGPA
    calculateOverallCGPA(updatedResults);
    
    // Reset for next semester
    setSubjects([{ name: '', credits: '', grade: '' }]);
  };

  // Calculate overall CGPA based on all semesters
  const calculateOverallCGPA = (allSemesters) => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    allSemesters.forEach(semester => {
      totalCredits += semester.credits;
      totalGradePoints += semester.sgpa * semester.credits;
    });

    const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
    setOverallCGPA(parseFloat(cgpa.toFixed(4)));
  };

  // Remove a semester
  const removeSemester = (index) => {
    const newResults = semesterResults.filter((_, i) => i !== index);
    setSemesterResults(newResults);
    calculateOverallCGPA(newResults);
  };

  // Start editing a semester
  const startEditingSemester = (index) => {
    const semesterToEdit = semesterResults[index];
    setSubjects([...semesterToEdit.subjects]);
    setEditingSemester(index);
    setViewingSemester(null);
  };

  // Save edited semester
  const saveEditedSemester = () => {
    const sgpa = calculateCurrentSGPA();
    const totalCredits = subjects.reduce((sum, subject) => {
      return sum + (parseFloat(subject.credits) || 0);
    }, 0);

    if (totalCredits === 0) {
      alert('Please add subjects with credits and grades');
      return;
    }

    const updatedSemester = {
      ...semesterResults[editingSemester],
      subjects: [...subjects],
      sgpa: parseFloat(sgpa.toFixed(3)),
      credits: totalCredits
    };

    const updatedResults = [...semesterResults];
    updatedResults[editingSemester] = updatedSemester;
    setSemesterResults(updatedResults);
    
    // Calculate overall CGPA
    calculateOverallCGPA(updatedResults);
    
    // Reset editing state
    setEditingSemester(null);
    setSubjects([{ name: '', credits: '', grade: '' }]);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSemester(null);
    setSubjects([{ name: '', credits: '', grade: '' }]);
  };

  // View semester details
  const viewSemesterDetails = (index) => {
    setViewingSemester(index);
    setEditingSemester(null);
  };

  // Close view modal
  const closeViewModal = () => {
    setViewingSemester(null);
  };

  // Calculate required SGPA to achieve target CGPA
  const calculateRequiredSGPA = () => {
    if (!targetCGPA || !targetSemesters || semesterResults.length === 0) {
      return null;
    }

    const target = parseFloat(targetCGPA);
    const futureSemesters = parseInt(targetSemesters);
    
    if (target < 0 || target > 10 || futureSemesters <= 0) {
      return null;
    }

    // Current total credits and grade points
    const currentTotalCredits = semesterResults.reduce((sum, s) => sum + s.credits, 0);
    const currentTotalGradePoints = semesterResults.reduce((sum, s) => sum + (s.sgpa * s.credits), 0);

    // Assume average credits per semester (you can make this configurable)
    const avgCreditsPerSemester = currentTotalCredits / semesterResults.length;
    const futureCredits = futureSemesters * avgCreditsPerSemester;

    // Calculate required grade points for future semesters
    const totalCreditsAfterTarget = currentTotalCredits + futureCredits;
    const requiredTotalGradePoints = target * totalCreditsAfterTarget;
    const requiredFutureGradePoints = requiredTotalGradePoints - currentTotalGradePoints;
    
    // Required SGPA for future semesters
    const requiredSGPA = futureCredits > 0 ? requiredFutureGradePoints / futureCredits : 0;

    return {
      requiredSGPA: Math.max(0, Math.min(10, requiredSGPA)),
      isAchievable: requiredSGPA >= 0 && requiredSGPA <= 10,
      currentCredits: currentTotalCredits,
      futureCredits: futureCredits,
      avgCreditsPerSemester: avgCreditsPerSemester
    };
  };

  const currentSGPA = calculateCurrentSGPA();

  return (
    <div className="cgpa-calculator">
      <h2>📊 CGPA Calculator</h2>
      
      {/* Current Semester Input */}
      <div className="current-semester">
        <h3>
          {editingSemester !== null 
            ? `✏️ Editing Semester ${semesterResults[editingSemester].semester}` 
            : `🎓 Semester ${semesterResults.length + 1}`
          }
        </h3>
        
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
                step="1.0"
                max="8"
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

          {/* Target CGPA Calculator */}
          <div className="target-cgpa-section">
            <div className="target-header">
              <h3>🎯 Target CGPA Calculator</h3>
              <button 
                onClick={() => setShowTargetCalculator(!showTargetCalculator)}
                className="toggle-target-btn"
              >
                {showTargetCalculator ? '🔼 Hide' : '🔽 Show'}
              </button>
            </div>
            
            {showTargetCalculator && (
              <div className="target-calculator">
                <div className="target-inputs">
                  <div className="input-group">
                    <label>Target CGPA:</label>
                    <input
                      type="number"
                      placeholder="e.g., 8.5"
                      min="0"
                      max="10"
                      step="0.1"
                      value={targetCGPA}
                      onChange={(e) => setTargetCGPA(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label>Remaining Semesters:</label>
                    <input
                      type="number"
                      placeholder="e.g., 4"
                      min="1"
                      max="20"
                      value={targetSemesters}
                      onChange={(e) => setTargetSemesters(e.target.value)}
                    />
                  </div>
                </div>

                {(() => {
                  const calculation = calculateRequiredSGPA();
                  if (!calculation) {
                    return (
                      <div className="target-result">
                        <p>💡 Enter your target CGPA and remaining semesters to see required SGPA</p>
                      </div>
                    );
                  }

                  return (
                    <div className="target-result">
                      <div className="calculation-summary">
                        <h4>📊 Target Analysis</h4>
                        <div className="result-grid">
                          <div className="result-item">
                            <span className="label">Required SGPA:</span>
                            <span className={`value ${calculation.isAchievable ? 'achievable' : 'difficult'}`}>
                              {calculation.requiredSGPA.toFixed(3)}
                            </span>
                          </div>
                          <div className="result-item">
                            <span className="label">Feasibility:</span>
                            <span className={`value ${calculation.isAchievable ? 'achievable' : 'difficult'}`}>
                              {calculation.isAchievable ? '✅ Achievable' : '⚠️ Very Challenging'}
                            </span>
                          </div>
                          <div className="result-item">
                            <span className="label">Current Credits:</span>
                            <span className="value">{calculation.currentCredits}</span>
                          </div>
                          <div className="result-item">
                            <span className="label">Future Credits:</span>
                            <span className="value">{calculation.futureCredits.toFixed(0)}</span>
                          </div>
                        </div>
                        
                        <div className="target-advice">
                          {calculation.isAchievable ? (
                            calculation.requiredSGPA >= 9.0 ? (
                              <p className="advice excellent">🌟 You need outstanding performance! Aim for O and A+ grades consistently.</p>
                            ) : calculation.requiredSGPA >= 8.0 ? (
                              <p className="advice good">👍 You need good performance! Focus on A and A+ grades.</p>
                            ) : calculation.requiredSGPA >= 7.0 ? (
                              <p className="advice average">📚 Maintain steady performance with B+ and A grades.</p>
                            ) : (
                              <p className="advice manageable">😊 Your target is manageable with consistent effort!</p>
                            )
                          ) : (
                            calculation.requiredSGPA > 10 ? (
                              <p className="advice impossible">🚫 This target requires SGPA above 10.0, which is impossible. Consider adjusting your target or extending the timeline.</p>
                            ) : (
                              <p className="advice difficult">⚠️ This target is very challenging. Consider extending your timeline or setting a more realistic target.</p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
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
