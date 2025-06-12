/* eslint-disable @typescript-eslint/no-unused-vars */
import { noteByStatus } from '@/constants'
import { db } from '@/lib/db'
import { jobApplicationsTable, applicantsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, and, param } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const userId = session?.id || ''

  try {
    const [existing] = await db
      .select()
      .from(applicantsTable)
      .where(eq(applicantsTable.user_id, userId))

    if (!existing.id) {
      return errorResponse({ message: 'Applicant data not found', status: 404 })
    }

    const myApplications = await db
      .select()
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.applicant_id, existing.id))

    return jsonResponse({ data: myApplications })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch job application' })
  }
}
