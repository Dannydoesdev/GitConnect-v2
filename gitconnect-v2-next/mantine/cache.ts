import { MantineProvider, createEmotionCache } from '@mantine/core';

// append mantine to the end of the style import

export const mantineCache = createEmotionCache({ key: 'mantine', prepend: false });

// usage:

// function Demo() {
//   return (
//     <MantineProvider emotionCache={appendCache} withGlobalStyles withNormalizeCSS>
//       <App />
//     </MantineProvider>
//   );
// }


// Create new cache

// import { MantineProvider, createEmotionCache } from '@mantine/core';

// const myCache = createEmotionCache({ key: 'mantine' });

// function Demo() {
//   return (
//     <MantineProvider emotionCache={myCache} withGlobalStyles withNormalizeCSS>
//       <App />
//     </MantineProvider>
//   );
// }

// To change classes prefix create cache with key:


// import { MantineProvider, createEmotionCache } from '@mantine/core';

// const myCache = createEmotionCache({ key: 'my-prefix' });