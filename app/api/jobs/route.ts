/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobsTable, jobApplicationsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { formJobSchema } from '@/types/form-schema'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const result = await db.execute(sql`
      SELECT 
        ${jobsTable.id} as id,
        ${jobsTable.title} as title,
        ${jobsTable.description} as description,
        ${jobsTable.min_salary_offered} as min_salary_offered,
        ${jobsTable.max_salary_offered} as max_salary_offered,
        ${jobsTable.is_open} as is_open,
        ${jobsTable.created_at} as created_at,
        ${jobsTable.updated_at} as updated_at,
        ${jobsTable.deleted_at} as deleted_at,
        (
          SELECT COUNT(*) FROM ${jobApplicationsTable}
          WHERE ${jobApplicationsTable.job_id} = ${jobsTable.id}
        ) AS applicants_total
      FROM ${jobsTable}
      WHERE ${jobsTable.deleted_at} IS NULL
      ORDER BY ${jobsTable.updated_at} DESC
    `)
    return jsonResponse({ data: result.rows })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch jobs' })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const parse = formJobSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  try {
    const newJob = await db
      .insert(jobsTable)
      .values({
        title: parse.data.title,
        description: parse.data.description,
        min_salary_offered: Number(parse.data.min_salary_offered),
        max_salary_offered: Number(parse.data.max_salary_offered),
        is_open: true,
      })
      .returning()
    return jsonResponse({ data: newJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to create job' })
  }
}
