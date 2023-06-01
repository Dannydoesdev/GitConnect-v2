// pages/index.tsx

import React from 'react';
import { Container, Paper, Text, Col, Grid, Button, Space } from '@mantine/core';
import { LandingPageFeatures } from './components/LandingPageOld/LandingPageFeatures';
import { LandingPageHero } from './components/LandingPageOld/LandingPageHero';



const LandingPage: React.FC = () => (
  <Container>
    <LandingPageHero />
    <LandingPageFeatures />
    {/* <Space h={70} />
    <HeroSection />
    <FeaturesSection />
    <CTASection />
    <Footer /> */}
  </Container>
);

export default LandingPage;


// const HeroSection: React.FC = () => (
//   <Paper p="xl" shadow="xs">
//     <Text align="center" size="xl">
//       GitConnect - Showcase Your Projects, Get Inspired, and Connect with Fellow Developers
//     </Text>
//   </Paper>
// );

// const Feature: React.FC<{ title: string; description: string }> = ({ title, description }) => (
//   <Col span={6}>
//     <Text size="lg" weight={500}>
//       {title}
//     </Text>
//     <Text>{description}</Text>
//   </Col>
// );

// const FeaturesSection: React.FC = () => (
//   <Container>
//     <Grid gutter="lg">
//       <Feature
//         title="Easy Signup and Project Import"
//         description="Sign up with your Github account in just two clicks and import your projects from Github with ease."
//       />
//       <Feature
//         title="Customizable Project Presentations"
//         description="Use our rich text editor to craft your project's story, add images to make your projects visually appealing, and access templates for project presentation coming soon."
//       />
//       <Feature
//         title="Connect and Collaborate"
//         description="Discover projects from developers at various skill levels, meet potential collaborators and even co-founders, and be a part of an early, supportive community of developers."
//       />
//       <Feature
//         title="For Developers, By Developers"
//         description="GitConnect is built with developers in mind. Request features or even contribute to our project."
//       />
//     </Grid>
//   </Container>
// );

// const CTASection: React.FC = () => (
//   <Container>
//     <Paper p="xl" shadow="xs" style={{ marginTop: '2rem', textAlign: 'center' }}>
//       <Text size="lg">Don't wait! Join GitConnect now and become a part of an innovative, supportive, and gGridth-oriented community of developers.</Text>
//       <Button size="lg" color="blue" style={{ marginTop: '1rem' }}>
//         Sign up for free today
//       </Button>
//     </Paper>
//   </Container>
// );

// const Footer: React.FC = () => (
//   <Paper p="md" shadow="xs" style={{ marginTop: '2rem', textAlign: 'center' }}>
//     <Text>GitConnect © 2023. All rights reserved. | Privacy Policy | Terms of Service</Text>
//   </Paper>
// );
