import { type Config } from "prettier";

const config: Config = {
   endOfLine: 'lf',
   semi: true,
   singleQuote: true,
   tabWidth: 2,
   trailingComma: 'es5',
   printWidth: 120,
   importOrder: [
     '^(react/(.*)$)|^(react$)',
     '^(next/(.*)$)|^(next$)',
     '<THIRD_PARTY_MODULES>',
     '^types$',
     '^@/types/(.*)$',
     '^@/config/(.*)$',
     '^@/lib/(.*)$',
     '^@/components/(.*)$',
     '^@/styles/(.*)$',
     '.css$',
     '.scss$',
     '^[./]',
   ],
   importOrderParserPlugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy'],
   plugins: ['@ianvs/prettier-plugin-sort-imports'],
   // overrides: [{ files: ['*.ts'], options: { parser: 'babel-ts' } }],
};

export default config;
