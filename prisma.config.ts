import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  // @ts-expect-error missing type
  earlyAccess: true,
  datasource: {
    url: process.env["DATABASE_URL"] as string,
  },
});
