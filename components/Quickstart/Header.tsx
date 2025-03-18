import React from 'react';
import { Group, Image, Space, Stack, Title, useMantineColorScheme } from '@mantine/core';

const Header: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();

  // Check for dark mode - logos are updated based on color scheme
  const dark = colorScheme === 'dark';

  return (
    <Group position="center" align="center">
      <Stack spacing="xl" align="center">
        <Image
          src={dark ? '/img/gitconnect.webp' : '/img/gitconnect-white.png'}
          alt="GitConnect Logo"
          fit="contain"
          height={125}
        />
        {/* <Space h='xs' /> */}
        <Title order={2}>Quickstart Portfolio Creator</Title>
        {/* <Title order={3}>Portfolio Quickstart</Title> */}
      </Stack>
    </Group>
  );
};

export default Header;
