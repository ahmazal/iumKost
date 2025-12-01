import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Hero from './landing/Hero'
import Navbar from './landing/Navbar'
import Fasilitas from './landing/Fasilitas'
import About from './landing/About'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      < Navbar/>
      < Hero/>
      <Fasilitas/>
      <About/>
    </>
  )
}

export default App
