import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HogwartsSuite from './components/HogwartsSuite/HogwartsSuite';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        {/* Your existing components */}
        
        {/* Add Hogwarts Suite */}
        <HogwartsSuite />
        
        {/* Rest of your app */}
      </div>
    </>
  )
}

export default App;