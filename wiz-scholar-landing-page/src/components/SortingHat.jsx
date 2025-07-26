import React, { useState, useEffect } from 'react';
import { Sparkles, Home, RotateCcw, Crown, Heart, BookOpen, Zap, Shield, Flame, Star, Sword, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

const API_BASE = 'http://localhost:8001';

// Enhanced house data with complete descriptions and colors
const houseData = {
  'Gryffindor': {
    colors: 'from-red-800 to-yellow-600',
    bgClass: 'gryffindor-bg',
    themeClass: 'gryffindor-theme',
    primaryColor: '#8B0000', // Maroon
    secondaryColor: '#FFD700', // Gold
    icon: Sword,
    crest: '🦁',
    description: "Gryffindor values courage, bravery, nerve, and chivalry. Its emblematic animal is the lion, and its colors are scarlet and gold. Members are known for their daring and noble hearts.",
    traits: ["Courage", "Bravery", "Nerve", "Chivalry", "Daring"],
    founder: "Godric Gryffindor",
    element: "Fire",
    motto: "Their daring, nerve and chivalry set Gryffindors apart"
  },
  'Hufflepuff': {
    colors: 'from-yellow-500 to-black',
    bgClass: 'hufflepuff-bg',
    themeClass: 'hufflepuff-theme',
    primaryColor: '#FFD700', // Yellow
    secondaryColor: '#000000', // Black
    icon: Heart,
    crest: '🦡',
    description: "Hufflepuff values hard work, patience, loyalty, and fair play. Its emblematic animal is the badger, and its colors are yellow and black. Members are known for their dedication and kindness.",
    traits: ["Loyalty", "Patience", "Hard Work", "Dedication", "Fair Play"],
    founder: "Helga Hufflepuff",
    element: "Earth",
    motto: "You might belong in Hufflepuff, where they are just and loyal"
  },
  'Ravenclaw': {
    colors: 'from-blue-800 to-amber-600',
    bgClass: 'ravenclaw-bg',
    themeClass: 'ravenclaw-theme',
    primaryColor: '#003f7f', // Blue
    secondaryColor: '#CD7F32', // Bronze
    icon: BookOpen,
    crest: '🦅',
    description: "Ravenclaw values intelligence, learning, wisdom and wit. Its emblematic animal is the eagle, and its colors are blue and bronze. Members are known for their cleverness and love of learning.",
    traits: ["Intelligence", "Wisdom", "Learning", "Wit", "Creativity"],
    founder: "Rowena Ravenclaw",
    element: "Air",
    motto: "Wit beyond measure is man's greatest treasure"
  },
  'Slytherin': {
    colors: 'from-green-800 to-gray-400',
    bgClass: 'slytherin-bg',
    themeClass: 'slytherin-theme',
    primaryColor: '#1B4D3E', // Green
    secondaryColor: '#C0C0C0', // Silver
    icon: Shield,
    crest: '🐍',
    description: "Slytherin values ambition, cunning, leadership, and resourcefulness. Its emblematic animal is the serpent, and its colors are emerald green and silver. Members are known for their determination and cleverness.",
    traits: ["Ambition", "Cunning", "Leadership", "Resourcefulness", "Determination"],
    founder: "Salazar Slytherin",
    element: "Water",
    motto: "Slytherin will help you on your way to greatness"
  }
};

// Audio component for background music
const AudioController = ({ isPlaying, onToggle, audioError }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 hover:scale-110 shadow-2xl text-white"
      title={audioError ? "Audio error - click to retry" : (isPlaying ? "Pause Hogwarts theme music" : "Play Hogwarts theme music")}
    >
      {audioError ? (
        <div className="relative">
          <VolumeX className="w-6 h-6 text-red-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      ) : isPlaying ? (
        <div className="relative">
          <Volume2 className="w-6 h-6 text-yellow-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      ) : (
        <VolumeX className="w-6 h-6 text-white/70" />
      )}
    </button>
  );
};

// Enhanced House Animation Component with Crest
const HouseAnimation = ({ house }) => {
  const houseInfo = houseData[house];
  const HouseIcon = houseInfo.icon;

  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
      <div className="relative w-40 h-40 mx-auto">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${houseInfo.colors} animate-pulse shadow-2xl`}>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-white/20 to-white/5 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <div className="text-4xl mb-2">{houseInfo.crest}</div>
              <HouseIcon className="w-8 h-8 text-white animate-bounce mx-auto" />
            </div>
          </div>
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12">
          <Star className="w-12 h-12 text-yellow-300 animate-spin" />
        </div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8">
          <Sparkles className="w-8 h-8 text-yellow-300 animate-ping" />
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-4xl font-bold text-white font-magical animate-magical-float mb-2">
          {house}
        </h3>
        <p className="text-lg text-white/80 font-mystical">
          {houseInfo.founder}'s Legacy
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-white/50 to-white/20 rounded-full mx-auto mt-3"></div>
      </div>
    </div>
  );
};

// Enhanced Button component matching main landing page
const Button = ({ children, onClick, disabled, className = "", variant = "default" }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105";
  const variants = {
    default: "bg-card border border-border text-card-foreground hover:bg-muted shadow-card",
    outline: "border border-border text-foreground hover:bg-card hover:shadow-magical",
    magical: "bg-gradient-primary text-primary-foreground hover:shadow-magical font-semibold",
    mystical: "bg-gradient-mystical text-white hover:shadow-mystical"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Enhanced Card components
const Card = ({ children, className = "" }) => (
  <div className={`bg-gradient-card border border-border rounded-lg shadow-card backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-6 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 py-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-xl font-semibold text-foreground ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-muted-foreground ${className}`}>
    {children}
  </p>
);

// Enhanced Badge component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-primary text-primary-foreground shadow-magical ${className}`}>
    {children}
  </span>
);

// Enhanced Progress component
const Progress = ({ value = 0, className = "" }) => (
  <div className={`w-full bg-muted rounded-full h-3 overflow-hidden ${className}`}>
    <div 
      className="h-full bg-gradient-primary rounded-full transition-all duration-500 shadow-magical"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Enhanced Alert component
const Alert = ({ children, className = "" }) => (
  <div className={`p-4 rounded-lg border border-border bg-card shadow-card ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children }) => (
  <div className="text-sm text-card-foreground">
    {children}
  </div>
);

// Magical Sparkles Background Component
const MagicalBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-primary rounded-full animate-sparkle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

const SortingHat = () => {
  const navigate = useNavigate();
  const { user, handleCompleteSorting, handleCompleteFirstTimeStep } = useAuth();
  const [gameState, setGameState] = useState('idle');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [apiStatus, setApiStatus] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [audioError, setAudioError] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    checkApiStatus();
    initializeAudio();
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Auto-start music when audio is ready
  useEffect(() => {
    if (audio && !isPlaying && !audioError) {
      // Small delay to ensure audio is fully loaded
      const timer = setTimeout(async () => {
        try {
          await audio.play();
          setIsPlaying(true);
          console.log('Auto-playing background music');
        } catch (error) {
          console.log('Auto-play prevented by browser policies:', error.message);
          // Don't set error state for auto-play prevention
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [audio, audioError]);

  // Apply theme to document body
  useEffect(() => {
    if (currentTheme !== 'default' && result) {
      document.body.className = `${houseData[result.house].themeClass} ${houseData[result.house].bgClass} hogwarts-bg transition-all duration-1000`;
    } else {
      document.body.className = 'hogwarts-bg transition-all duration-1000';
    }
    
    return () => {
      document.body.className = '';
    };
  }, [currentTheme, result]);

  const initializeAudio = () => {
    try {
      const bgAudio = new Audio('/hogwarts-theme.mp3');
      bgAudio.loop = true;
      bgAudio.volume = 0.5; // Increased from 0.3 to 0.5 for better audibility
      bgAudio.preload = 'auto';
      
      // Add error handling
      bgAudio.addEventListener('error', (e) => {
        console.error('Audio loading error:', e);
        setAudioError(true);
      });
      
      bgAudio.addEventListener('canplaythrough', () => {
        setAudioError(false);
        console.log('Audio loaded successfully - ready for autoplay');
      });
      
      // Add event listener for when audio can start playing
      bgAudio.addEventListener('loadeddata', () => {
        console.log('Audio data loaded - preparing for autoplay');
      });
      
      setAudio(bgAudio);
    } catch (error) {
      console.error('Audio initialization error:', error);
      setAudioError(true);
    }
  };

  const toggleMusic = async () => {
    if (!audio) {
      initializeAudio();
      return;
    }
    
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        setAudioError(false);
      } else {
        // Reset audio error state
        setAudioError(false);
        
        // Try to play audio
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          console.log('Audio playing successfully');
        }
      }
    } catch (error) {
      console.error('Audio play error:', error);
      setAudioError(true);
      setIsPlaying(false);
      
      // Show user-friendly message
      alert('Audio could not be played. This might be due to browser autoplay policies. Please try clicking the audio button again.');
    }
  };

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setApiStatus(true);
        setError(null);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setApiStatus(false);
      setError('AI Server is offline. Please start the server first.');
    }
  };

  const startSortingSession = async () => {
    if (!apiStatus) {
      setError('Please start the AI server first.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/sorting-hat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.current_question) {
        setCurrentQuestion(data.current_question);
        setGameState('playing');
        setQuestionsAsked(0);
      } else {
        setError('No questions available.');
      }
    } catch (error) {
      setError(`Failed to start sorting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const answerQuestion = async (questionId, answerIndex) => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE}/api/sorting-hat/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_id: questionId,
          answer_index: answerIndex,
          session_id: sessionId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setQuestionsAsked(data.questions_asked);
      
      if (data.game_complete || !data.should_continue) {
        if (data.prediction) {
          setResult(data.prediction);
          setGameState('complete');
          setShowAnimation(true);
          setCurrentTheme(data.prediction.house);
          
          // Add celebratory effect
          setTimeout(async () => {
            if (audio && !isPlaying) {
              try {
                await audio.play();
                setIsPlaying(true);
                setAudioError(false);
              } catch (error) {
                console.log('Auto-play prevented by browser, user can manually start music');
                setAudioError(false); // Don't show error for auto-play prevention
              }
            }
          }, 1000);
        } else {
          setError('The sorting ceremony is complete, but no prediction was made.');
        }
      } else if (data.current_question) {
        setCurrentQuestion(data.current_question);
      } else {
        setError('No more questions available.');
      }
    } catch (error) {
      setError(`Failed to process answer: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setCurrentQuestion(null);
    setQuestionsAsked(0);
    setResult(null);
    setError(null);
    setShowAnimation(false);
    setCurrentTheme('default');
    
    // Stop music when resetting game
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const navigateToDashboard = async () => {
    try {
      console.log('=== NAVIGATION DEBUG ===');
      console.log('Starting navigation to dashboard with Document Summarizer and Hogwarts Suite...');
      console.log('Current user:', user);
      console.log('handleCompleteSorting function:', handleCompleteSorting);
      console.log('handleCompleteFirstTimeStep function:', handleCompleteFirstTimeStep);
      
      // Stop music before navigating
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }
      
      // Mark sorting ceremony as complete FIRST and wait for it
      if (handleCompleteSorting) {
        console.log('Calling handleCompleteSorting...');
        await handleCompleteSorting();
        console.log('✅ Sorting completion saved successfully');
      } else {
        console.log('⚠️ handleCompleteSorting function not available');
      }
      
      // Mark first time interaction as complete to show Document Summarizer and Hogwarts Suite
      if (handleCompleteFirstTimeStep) {
        console.log('Calling handleCompleteFirstTimeStep to show Document Summarizer and Hogwarts Suite...');
        await handleCompleteFirstTimeStep();
        console.log('✅ First time step completed - Document Summarizer and Hogwarts Suite will be shown');
      } else {
        console.log('⚠️ handleCompleteFirstTimeStep function not available');
      }
      
      // Add a small delay to ensure Firebase has time to save both updates
      console.log('Waiting 1 second for Firebase to propagate...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate after marking both steps complete
      console.log('🚀 Navigating to /Dashboard (Document Summarizer and Hogwarts Suite)');
      navigate('/Dashboard');
      console.log('=== NAVIGATION COMPLETE ===');
      
    } catch (error) {
      console.error('❌ Error in navigation process:', error);
      console.log('Attempting fallback navigation...');
      // Still navigate even if Firebase update fails
      navigate('/Dashboard');
    }
  };

  // Simple test function to verify navigation works
  const testNavigation = () => {
    console.log('Test navigation called');
    navigate('/Dashboard');
  };

  const progressPercentage = (questionsAsked / 15) * 100;

  // Enhanced House Description Component
  const HouseDescription = ({ house }) => {
    const houseInfo = houseData[house];
    const HouseIcon = houseInfo.icon;

    return (
      <Card className="border-2 border-white/20 bg-white/10 backdrop-blur-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{houseInfo.crest}</div>
            <h2 className="text-4xl font-bold text-white font-magical mb-2">{house}</h2>
            <p className="text-xl text-white/80 font-mystical italic">"{houseInfo.motto}"</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <HouseIcon className="w-6 h-6 text-white" />
              <span className="text-white/90 font-mystical">Founded by {houseInfo.founder}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-white font-magical mb-4">House Description</h3>
              <p className="text-white/90 leading-relaxed font-mystical text-lg">{houseInfo.description}</p>
              
              <div className="mt-6">
                <h4 className="text-xl font-semibold text-white font-magical mb-3">Element & Colors</h4>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="bg-white/20 px-3 py-1 rounded-full">{houseInfo.element}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: houseInfo.primaryColor }}
                    ></div>
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white"
                      style={{ backgroundColor: houseInfo.secondaryColor }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white font-magical mb-4">House Traits</h3>
              <div className="grid grid-cols-2 gap-3">
                {houseInfo.traits.map((trait, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                    <span className="text-white font-mystical">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 relative ${
      currentTheme !== 'default' && result 
        ? `${houseData[result.house].bgClass} ${houseData[result.house].themeClass}` 
        : 'bg-gradient-hero'
    } hogwarts-bg`}>
      
      {/* Audio Controller */}
      <AudioController isPlaying={isPlaying} onToggle={toggleMusic} audioError={audioError} />
      
      <MagicalBackground />
      
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="w-16 h-16 text-yellow-400 animate-magical-float" />
            <h1 className="text-6xl font-bold text-white font-magical">
              Sorting Hat Ceremony
            </h1>
            <Sparkles className="w-16 h-16 text-yellow-400 animate-magical-float" style={{ animationDelay: '1s' }} />
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-mystical">
            Discover your true Hogwarts house through ancient magic and AI wisdom
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto mt-4"></div>
        </div>

        {/* API Status */}
        {!apiStatus && (
          <Alert className="mb-8 border-red-400/50 bg-red-900/20 backdrop-blur-sm">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span className="text-red-200">AI Server is offline. Please start the server first.</span>
                <Button 
                  onClick={checkApiStatus}
                  variant="outline"
                  className="border-red-400 text-red-200 hover:bg-red-900/30 backdrop-blur-sm"
                >
                  Retry
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert className="mb-8 border-red-400/50 bg-red-900/20 backdrop-blur-sm">
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {/* Game State: Idle */}
        {gameState === 'idle' && (
          <Card className="text-center animate-fade-in-up border-white/20 bg-white/10 backdrop-blur-md">
            <CardHeader>
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <Crown className="w-16 h-16 text-white animate-magical-float" />
                </div>
              </div>
              <CardTitle className="text-5xl text-white mb-6 font-magical">
                🎓 The Sorting Ceremony Awaits
              </CardTitle>
              <CardDescription className="text-xl leading-relaxed text-white/80 font-mystical">
                Step forward and let the ancient Sorting Hat examine your character through 15 carefully crafted questions. 
                Your destiny among the four great houses of Hogwarts awaits...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={startSortingSession}
                disabled={!apiStatus || loading}
                variant="magical"
                className="text-xl px-12 py-6 bg-gradient-to-r from-yellow-400 to-amber-600 text-black hover:from-yellow-300 hover:to-amber-500 font-magical"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                    Starting the Ceremony...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3" />
                    Begin the Ceremony
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Game State: Playing */}
        {gameState === 'playing' && currentQuestion && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Progress */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold text-lg font-magical">
                    Question {questionsAsked + 1} of 15
                  </span>
                  <span className="text-white/80 text-lg font-mystical">
                    {progressPercentage.toFixed(0)}% Complete
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-4 bg-white/20" />
                <div className="text-center mt-4 text-sm text-white/70 font-mystical">
                  The Sorting Hat is learning about your character...
                </div>
              </CardContent>
            </Card>

            {/* Current Question */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                    <BookOpen className="w-10 h-10 text-white animate-magical-float" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-center leading-relaxed text-white font-mystical">
                  {currentQuestion.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => answerQuestion(currentQuestion.id, index)}
                      disabled={loading}
                      variant="outline"
                      className="p-6 text-left justify-start h-auto min-h-[80px] text-lg leading-relaxed hover:border-white/50 hover:bg-white/10 group bg-white/5 border-white/20 text-white backdrop-blur-sm"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4 group-hover:bg-white/30 transition-colors">
                          <span className="text-white font-bold font-magical">{String.fromCharCode(65 + index)}</span>
                        </div>
                        <span className="font-mystical">{option.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {loading && (
              <Card className="border-yellow-400/50 bg-yellow-400/10 backdrop-blur-md">
                <CardContent className="text-center py-8">
                  <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-spin" />
                  <p className="text-yellow-200 text-2xl font-semibold font-magical">
                    🔮 The Sorting Hat is deliberating...
                  </p>
                  <p className="text-white/70 mt-2 font-mystical text-lg">
                    Analyzing your magical essence and character...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Game State: Complete */}
        {gameState === 'complete' && result && (
          <div className="space-y-8">
            {/* House Animation */}
            {showAnimation && (
              <Card className="border-white/20 text-center py-16 bg-white/10 backdrop-blur-md">
                <CardContent>
                  <div className="mb-12">
                    <h2 className="text-4xl font-semibold text-white mb-12 font-magical">
                      The Sorting Hat has decided...
                    </h2>
                    <HouseAnimation house={result.house} />
                  </div>
                  <Badge className="text-2xl px-8 py-4 bg-white/20 text-white border-2 border-white/30 backdrop-blur-sm">
                    Confidence: {(result.confidence * 100).toFixed(1)}%
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* House Description */}
            <HouseDescription house={result.house} />

            {/* Detailed Results */}
            <Card className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl text-white mb-4 font-magical">
                  Welcome to {result.house}!
                </CardTitle>
                <CardDescription className="text-xl text-white/80 font-mystical">
                  Your magical journey begins now! Access Document Summarizer and Hogwarts Suite to enhance your wizarding studies.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* All House Scores */}
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-white mb-6 text-center font-magical">
                    House Probabilities
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(result.all_confidences).map(([house, score]) => {
                      const houseInfo = houseData[house];
                      const HouseIcon = houseInfo.icon;
                      const isWinner = house === result.house;
                      
                      return (
                        <Card 
                          key={house}
                          className={`text-center transition-all duration-500 hover:scale-105 ${
                            isWinner 
                              ? `border-white/50 shadow-2xl bg-gradient-to-br ${houseInfo.colors} backdrop-blur-sm` 
                              : 'border-white/20 hover:border-white/40 bg-white/10 backdrop-blur-sm'
                          }`}
                        >
                          <CardContent className="py-6">
                            <div className="text-3xl mb-3">{houseInfo.crest}</div>
                            <HouseIcon className={`w-12 h-12 mx-auto mb-3 ${isWinner ? 'text-white' : 'text-white/70'}`} />
                            <div className={`font-bold text-xl mb-2 font-magical ${isWinner ? 'text-white' : 'text-white/80'}`}>
                              {house}
                            </div>
                            <div className={`text-3xl font-bold font-mystical ${isWinner ? 'text-white' : 'text-white/80'}`}>
                              {(score * 100).toFixed(1)}%
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Trait Scores */}
                {result.trait_scores && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-white mb-6 text-center font-magical">
                      Your Magical Traits
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                          <Sword className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-red-300 font-semibold mb-2 font-magical">Bravery</div>
                        <div className="text-4xl font-bold text-white font-mystical">{result.trait_scores.bravery_score}/10</div>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                          <Heart className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-yellow-300 font-semibold mb-2 font-magical">Loyalty</div>
                        <div className="text-4xl font-bold text-white font-mystical">{result.trait_scores.loyalty_score}/10</div>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                          <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-blue-300 font-semibold mb-2 font-magical">Wisdom</div>
                        <div className="text-4xl font-bold text-white font-mystical">{result.trait_scores.wisdom_score}/10</div>
                      </div>
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20">
                          <Shield className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-green-300 font-semibold mb-2 font-magical">Ambition</div>
                        <div className="text-4xl font-bold text-white font-mystical">{result.trait_scores.ambition_score}/10</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center">
                  <Button 
                    onClick={async (e) => {
                     console. log('Simple navigation test clicked');
                      navigate('/Dashboard')


                      
                      try {
                        console.log('🔵 Calling navigateToDashboard...');
                        await navigateToDashboard();
                        console.log('🔵 Navigation completed successfully');
                      } catch (error) {
                        console.error('🔴 Error in navigation:', error);
                        // Fallback navigation
                        console.log('🔵 Attempting fallback direct navigation...');
                        navigate('/Dashboard');
                      }
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-400 hover:to-blue-600 font-magical transition-all duration-300 rounded-lg shadow-xl hover:shadow-2xl"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    Explore Document Summarizer & Hogwarts Suite
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingHat;
