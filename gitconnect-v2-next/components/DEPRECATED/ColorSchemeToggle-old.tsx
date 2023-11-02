// import { useTheme } from '@emotion/react';
import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';
// import { useTheme } from 'next-themes';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // const dark = colorScheme === 'dark';
  // const { theme, setTheme } = useTheme();

  // Testing from https://github.com/ongkay/mantine-tailwind/blob/main/src/components/ColorSchemeToggle/ColorSchemeToggle.tsx

  // function setThemes() {
  //   if (theme !== colorScheme) {
  //     setTheme(colorScheme);
  //   }
  //   toggleColorScheme();
  //   dark ? setTheme('light') : setTheme('dark');
  // }

  return (
    <Group position='center' mt='xl'>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        // onClick={() => setThemes()}
        size='xl'
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],
        })}
      >
        {colorScheme === 'dark' ? (
          <IconSun size={20} stroke={1.5} />
        ) : (
          <IconMoonStars size={20} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}
