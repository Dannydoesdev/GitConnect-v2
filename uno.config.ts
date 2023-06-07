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
      }),
    // presetUno(),
    // ...
  ],
})