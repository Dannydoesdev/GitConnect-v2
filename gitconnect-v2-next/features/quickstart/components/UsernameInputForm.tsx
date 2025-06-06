// components/Quickstart/Steps/UsernameInputForm.tsx
import React from "react";
import Link from "next/link";
import { TextInput, Button, Group, Paper, Text, Blockquote } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react"; 

interface UsernameInputFormProps {
  initialUsername?: string;
  onSubmit: (username: string) => void;
  isLoading: boolean;
  error?: string | null;
  showExistingLink?: boolean;
  existingLinkHref?: string;
}

export const UsernameInputForm: React.FC<UsernameInputFormProps> = ({
  initialUsername,
  onSubmit,
  isLoading,
  error,
  showExistingLink,
  existingLinkHref,
}) => {
  const [username, setUsername] = React.useState(initialUsername || "");
  const [inputError, setInputError] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setInputError("Please enter a GitHub username");
      return;
    }
    setInputError("");
    onSubmit(username);
  };

  return (
    <>
      <Group position="center">
        <Blockquote cite="- GitConnect tips" color="indigo" icon={<IconInfoCircle size="1.5rem" />}>
          Use the quickstart flow to quickly test GitConnect - no signup required. <br />
          Enter a GitHub username and choose some repos to create a test portfolio.
        </Blockquote>
      </Group>
      {error && (
        <>
          {" "}
          <Text size="md" color="red" align="center" mt="md">
            {error}
          </Text>{" "}
        </>
      )}
      <Paper
        radius="md"
        withBorder
        shadow="sm"
        p="xl"
        mx="lg"
        mt="lg"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        })}
      >
        <form onSubmit={handleSubmit}>
          <Group position="center" align="center" spacing="xl">
            <TextInput
              data-autofocus
              placeholder="GitHub username"
              label="Enter a Github Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              onFocus={() => setInputError("")} // Clear local validation error
              error={inputError} // Local validation error
              disabled={isLoading}
              styles={{ label: { fontWeight: 600 } }}
              w="40%"
              size="lg"
              radius="md"
            />
            <Button
              type="submit"
              mt="xl"
              size="md"
              radius="md"
              color="teal"
              loading={isLoading}
              disabled={!username.trim()}
            >
              {isLoading ? "Fetching..." : "Fetch Repos"}
            </Button>
            {showExistingLink && existingLinkHref && (
              <Link href={existingLinkHref} passHref legacyBehavior>
                <Button component="a" mt="xl" size="md" radius="md" color="yellow">
                  Visit Existing Quickstart
                </Button>
              </Link>
            )}
          </Group>
        </form>
      </Paper>
    </>
  );
};
