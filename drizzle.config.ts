import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://jobs-seeker_owner:npg_Bhn13RZIuOlt@ep-floral-lake-a1kk9y2d-pooler.ap-southeast-1.aws.neon.tech/jobs-seeker?sslmode=require',
  },
})
