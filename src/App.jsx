import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Hero from './landing/hero'
import Sidebar from './landing/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      < Sidebar/>
      < Hero/>
    </>
  )
}

export default App
