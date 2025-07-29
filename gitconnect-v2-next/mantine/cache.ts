import { createEmotionCache } from '@mantine/core';

// Append mantine to the end of the style import

export const mantineCache = createEmotionCache({
  key: 'mantine',
  prepend: false,
});
