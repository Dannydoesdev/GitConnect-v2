import React from 'react';
import Head from 'next/head';
import { Container, Space, Text, Title } from '@mantine/core';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | GitConnect</title>
      </Head>
      <Container mt={120} size='sm'>
        <Title order={1} className='mb-4'>
          GitConnect Privacy Policy
        </Title>
        <Title order={2}>Information We Collect</Title>
        <Space h='xs' />
        <Text className='mb-4'>
          We collect information about you when you use our website and
          services. This information may include your name, email address, and
          other contact information. We use this information to provide and
          improve our services, and to communicate with you about our services.
          We also use Google Analytics and Vercel Insights to collect data on
          website usage.
        </Text>
        <Space h='xs' />

        <Title order={2}>How We Use Information</Title>
        <Space h='xs' />

        <Text className='mb-4'>
          We use the information we collect to provide, maintain, and improve
          our services.
        </Text>
        <Space h='xs' />

        <Title order={2}>Sharing of Information</Title>
        <Space h='xs' />

        <Text className='mb-4'>
          We do not sell or share your personal information with third-party
          companies without your consent, except to comply with laws or
          regulations.
        </Text>
        <Space h='xs' />

        <Title order={2}>Cookies</Title>
        <Space h='xs' />

        <Text className='mb-4'>
          We use cookies to store your light/dark theme preference and to
          provide a better user experience.
        </Text>
        <Space h='xs' />

        <Title order={2}>Security</Title>
        <Space h='xs' />

        <Text className='mb-4'>
          We take reasonable measures to protect your personal information.
          However, no online service is entirely secure, and we cannot guarantee
          absolute security.
        </Text>
        <Space h='xs' />

        <Title order={2}>Contact Us</Title>
        <Space h='xs' />

        <Text className='mb-4'>
          For any questions regarding this privacy policy, please contact us at
          danny@gitconnect.dev.
        </Text>
        <Space h='xs' />
      </Container>
    </>
  );
};

export default PrivacyPolicy;
