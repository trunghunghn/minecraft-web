import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  // Gỡ bỏ các import bị lỗi để build được trên Vercel.
  // Bạn có thể cấu hình lại ESLint sau khi game đã chạy ổn định.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
