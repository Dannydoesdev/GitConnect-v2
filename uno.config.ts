// uno.config.ts
// import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'
import { defineConfig, presetAttributify, presetIcons, presetUno, presetWebFonts } from 'unocss'


export default defineConfig({
  presets: [
      presetIcons({
        extraProperties: {
          display: "inline-block",
          "vertical-align": "middle",
        },
        // autoInstall: true,
        // warn: true,
        // collections: {
        //   // ic: () => import('@iconify-json/ic/icons.json').then(i => i.default),
        //   mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        //   ri: () => import('@iconify-json/ri/icons.json').then(i => i.default),
        // }
      }),
    // presetUno(),
    // ...
  ],
})