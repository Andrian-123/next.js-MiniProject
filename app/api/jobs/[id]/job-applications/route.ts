/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobApplicationsTable, applicantsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { sql } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    const getJobApplicationsByJobId = await db.execute(sql`
      SELECT
        ja.id,
        ja.status,
        ja.created_at,
        ja.updated_at,
        json_build_object(
          'id', a.id,
          'full_name', a.full_name,
          'phone', a.phone,
          'min_salary_expectation', a.min_salary_expectation,
          'max_salary_expectation', a.max_salary_expectation,
          'summary', a.summary
        ) AS applicant
      FROM ${jobApplicationsTable} ja
      JOIN ${applicantsTable} a
        ON a.id = ja.applicant_id
      WHERE ja.job_id = ${id}
    `)
    return jsonResponse({ data: getJobApplicationsByJobId.rows })
  } catch (error) {
    return errorResponse({ message: 'Failed to get detail job applications' })
  }
}
