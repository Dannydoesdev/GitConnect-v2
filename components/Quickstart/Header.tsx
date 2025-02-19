import React from 'react';
import { Group, Image, Stack, Title, useMantineColorScheme } from '@mantine/core';

const Header: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();

  // Check for dark mode - logos are updated based on color scheme
  const dark = colorScheme === 'dark';

  return (
    <Group position="center" spacing="md" align="center">
      <Stack spacing="lg" align='center'>
        <Image
          src={dark ? '/img/gc-sml.webp' : '/img/gitconnect-white.png'}
          alt="GitConnect Logo"
          fit='contain'
          height={150}
       
        />
        <Title order={2}>GitConnect Portfolio Creator</Title>
        {/* <Title order={3}>Portfolio Quickstart</Title> */}
      </Stack>
</Group>
  );
};

export default Header;
