import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Hero from './landing/Hero'
import Navbar from './landing/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      < Navbar/>
      < Hero/>
    </>
  )
}

export default App
