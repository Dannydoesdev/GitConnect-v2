import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { IconMoon, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'tabler-icons-react';
import tw from 'twin.macro';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { theme, setTheme } = useTheme();

  function setThemes() {
    if (theme !== colorScheme) {
      setTheme(colorScheme);
    }
    toggleColorScheme();
    dark ? setTheme('light') : setTheme('dark');
  }
  useHotkeys([['mod+J', () => setThemes()]]);

  return (
    <Group mt={5} position="center">
      <ActionIcon
        aria-label="light or dark mode toggle"
        onClick={() => setThemes()}
        size="sm"
        sx={(theme) => ({
          backgroundColor: '#FFFFFF00',
          // backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],

          '&:hover': {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[0],
          },
        })}
        // color={dark ? 'yellow' : 'blue'}
        // css={[dark ? tw`bg-gray-700/30` : tw`bg-gray-300/30`]}
      >
        {dark ? (
          // <IconSun size={15} />
          <Sun size={15} strokeWidth={2} />
        ) : (
          // <IconMoon size={15} />
          <Moon size={15} strokeWidth={2} />
        )}
      </ActionIcon>
    </Group>
  );

  // return (
  //   <Group position="center" mt="xl">
  //     <ActionIcon
  //       onClick={() => setThemes()}
  //       size="xl"
  //       color={dark ? 'yellow' : 'blue'}
  //       css={[dark ? tw`bg-gray-700/30` : tw`bg-gray-300/30`]}
  //     >
  //       {dark ? (
  //         <IconSun size={20} stroke={1.5} />
  //       ) : (
  //         <IconMoonStars size={20} stroke={1.5} />
  //       )}
  //     </ActionIcon>
  //   </Group>
  // )
}
