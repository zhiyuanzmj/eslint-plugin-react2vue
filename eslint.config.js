// @ts-check
import { sxzz } from "@sxzz/eslint-config";

export default sxzz().removeRules(
  "import/no-default-export",
  "unicorn/filename-case",
);
