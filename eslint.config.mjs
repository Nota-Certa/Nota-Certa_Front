import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import { Quote } from "lucide-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "prefer-arrow-callback": "error",
      "no-multi-spaces": "error",
      "no-trailing-spaces": "error",
      "indent": ["error", 2],
      "@typescript-eslint/no-unused-vars": ["warn"],
      "object-curly-spacing": ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }]
    }
  })
];

export default eslintConfig;
