// pages/index.tsx

import React from 'react';
import { GetStaticProps } from 'next';
// import HeroSection from '../components/HeroSection';
// import FeatureSection from '../components/FeatureSection';
// import TestimonialSection from '../components/TestimonialSection';
// import FAQSection from '../components/FAQSection';
// import Footer from '../components/Footer';
import { Container, Paper, Text, Col, Grid, Button, Space } from '@mantine/core';
import { LandingPageFeatures } from '../components/LandingPageOld/LandingPageFeatures';
import { LandingPageHero } from '../components/LandingPageOld/LandingPageHero';
import { LandingHero } from '../components/LandingPageOld/LandingHero';
import { LandingFeatures } from '../components/LandingPageOld/LandingFeatures';

interface HomePageProps {
  // Define the shape of your data here
}

const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <>
      {/* <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <FAQSection />
      <Footer /> */}
      <Container>
        <LandingHero />
        <LandingFeatures />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch data here

  return {
    props: {
      // Pass data to your component props
    },
  };
};

export default HomePage;
