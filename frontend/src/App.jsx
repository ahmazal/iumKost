import { useState } from "react";
import { useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Hero from "./landing/Hero";
import Navbar from "./landing/Navbar";
import Fasilitas from "./landing/Fasilitas";
import About from "./landing/About";
import Penilaian from "./landing/Penilaian";
import Footer from "./landing/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

function App() {
  useEffect (() => {
    AOS.init ({
      duration: 800,
    }),
    AOS.refresh ();
  })
  return (
    <>
      <Navbar />
      <Hero />
      <Fasilitas />
      <About />
      <Penilaian />
      <Footer />
    </>
  );
}

export default App;
