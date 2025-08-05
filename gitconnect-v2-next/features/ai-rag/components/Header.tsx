import React from 'react';
import { Group, Image, Stack, Title, useMantineColorScheme } from '@mantine/core';

const Header: React.FC = () => {
  const { colorScheme } = useMantineColorScheme();

  // Check for dark mode - logos are updated based on color scheme
  const dark = colorScheme === 'dark';

  return (
    <Group position="center" spacing="md" align="center">
      <Stack spacing="xs" align="center">
        <Image src="/img/weaviate/weaviate-logo.png" alt="Weaviate Logo" height={130} />
        <Title order={3} weight="bolder">
          Weaviate
        </Title>
      </Stack>
      <Title order={3} weight="bolder">
        X
      </Title>
      <Stack spacing="xxs" align="center">
        <Image
          src={dark ? '/img/gc-sml.webp' : '/img/gitconnect-white.png'}
          alt="GitConnect Logo"
          height={130}
        />
        <Title order={3}>GitConnect;</Title>
      </Stack>
    </Group>
  );
};

export default Header;
