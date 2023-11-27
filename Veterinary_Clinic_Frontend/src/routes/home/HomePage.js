import React from 'react';
import './HomePage.css';
import Cards from './Cards';
import HeroSection from "./Hero";
import Footer from '../../components/footer/Footer';
import About from './About';
import MakeApp from './MakeApp';

function HomePage() {
  return (
    <>
      <HeroSection />
      <About />
      <Cards />
      <MakeApp />
      <Footer/>
    </>
  );
}

export default HomePage;