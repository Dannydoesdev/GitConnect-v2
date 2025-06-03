import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import { useTheme } from "next-themes";
import { Sun, Moon } from "tabler-icons-react";

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { theme, setTheme } = useTheme();

  function setThemes() {
    if (theme !== colorScheme) {
      setTheme(colorScheme);
    }
    toggleColorScheme();
    dark ? setTheme("light") : setTheme("dark");
  }
  useHotkeys([["mod+J", () => setThemes()]]);

  return (
    <Group mt={5} position="center">
      <ActionIcon
        aria-label="light or dark mode toggle"
        onClick={() => setThemes()}
        size="sm"
        sx={(theme) => ({
          backgroundColor: "#FFFFFF00",

          color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],

          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[0],
          },
        })}
      >
        {dark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
      </ActionIcon>
    </Group>
  );
}
