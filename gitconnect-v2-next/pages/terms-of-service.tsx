import React from 'react';
import Head from 'next/head';
import { Container, Space, Text, Title } from '@mantine/core';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | GitConnect</title>
      </Head>
      <Container mt={120} size="sm">
        <Title order={1} className="mb-4">
          GitConnect Terms of Service
        </Title>
        <Title order={2}>Introduction</Title>
        <Space h="xs" />
        <Text className="mb-4">
          Welcome to GitConnect! These Terms of Service ("Terms") govern your use of our
          services, which includes our website and any applications, both mobile and
          desktop (collectively, "GitConnect"). By accessing and using GitConnect, you
          agree to these Terms.
        </Text>
        <Space h="xs" />

        <Title order={2}>Eligibility</Title>
        <Space h="xs" />

        <Text className="mb-4">
          You must be at least 18 years old to use GitConnect. By agreeing to these Terms,
          you represent and warrant that you meet this eligibility requirement.
        </Text>
        <Space h="xs" />

        <Title order={2}>Registration and Accounts</Title>
        <Space h="xs" />

        <Text className="mb-4">
          You may register for an account using GitHub OAuth. You must provide accurate
          and complete information and keep your account information updated.
        </Text>
        <Space h="xs" />

        <Title order={2}>Content</Title>
        <Space h="xs" />

        <Text className="mb-4">
          All content you submit to GitConnect is owned by you. However, by posting or
          sharing content, you grant us a license to use, display, and distribute your
          content.
        </Text>
        <Space h="xs" />

        <Title order={2}>Payments</Title>
        <Space h="xs" />

        <Text className="mb-4">
          We process payments through Stripe. By using our service, you agree to be bound
          by Stripe's terms and conditions.
        </Text>
        <Space h="xs" />

        <Title order={2}>Termination</Title>
        <Space h="xs" />

        <Text className="mb-4">
          We reserve the right to suspend or terminate your account if you breach any of
          the terms.
        </Text>
        <Space h="xs" />
        <Title order={2}>Limitation of Liability</Title>
        <Space h="xs" />

        <Text className="mb-4">
          GitConnect, its services, and its content are provided "as is" without
          warranties of any kind, either express or implied.
        </Text>
        <Space h="xs" />
      </Container>
    </>
  );
};

export default PrivacyPolicy;

{
  /* <Text className="mb-4">
          At GitConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, and share your personal information.
        </Text>
        <Text className="mb-4">
          We collect information about you when you use our website and services. This information may include your name, email address, and other contact information. We use this information to provide and improve our services, and to communicate with you about our services.
        </Text>
        <Text className="mb-4">
          We may share your information with third-party service providers who help us provide our services. We require these service providers to protect your information and use it only for the purposes for which we disclose it to them.
        </Text>
        <Text className="mb-4">
          We may also share your information with law enforcement or other government agencies if we are required to do so by law or if we believe in good faith that such action is necessary to comply with the law or to protect the rights, property, or safety of GitConnect, our users, or others.
        </Text>
        <Text className="mb-4">
          If you have any questions or concerns about our Privacy Policy, please contact us at privacy@gitconnect.com.
        </Text> */
}
