import { ActionIcon, Group, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "tabler-icons-react";

export function ColorModeSwitcher() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  console.log(colorScheme)
  return (
    <Group position="center">
      <ActionIcon
        aria-label="light or dark mode toggle"
        onClick={() => toggleColorScheme()}
        size="md"
        // sx allows accessing the themes etc - pass in a function as props
        // if dark = dark else gray bg
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          color: theme.colorScheme === "dark" ? theme.colors.yellow[4] : theme.colors.blue[6],
        })}
      >
        {colorScheme === "dark" ? (
          <Sun size={16} />) : (
          <Moon size={16} />
        )}
      </ActionIcon>
    </Group>
  )
}