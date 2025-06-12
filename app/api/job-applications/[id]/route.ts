/* eslint-disable @typescript-eslint/no-unused-vars */
import { noteByStatus } from '@/constants'
import { db } from '@/lib/db'
import {
  jobApplicationsTable,
  jobsTable,
  jobApplicationLogsTable,
} from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, and, param } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id
  try {
    const [getByIdJobApplication] = await db
      .select()
      .from(jobApplicationsTable)
      .where(eq(jobApplicationsTable.id, id))

    const jobApplicationLogs = await db
      .select()
      .from(jobApplicationLogsTable)
      .where(eq(jobApplicationLogsTable.job_application_id, id))

    const result = {
      ...getByIdJobApplication,
      status_logs: jobApplicationLogs,
    }

    return jsonResponse({ data: result })
  } catch (error) {
    return errorResponse({ message: 'Failed to fetch job application' })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getToken({
    req: req as NextRequest,
    secret: process.env.NEXTAUTH_SECRET!,
  })

  if (!session) {
    return errorResponse({ message: 'Unauthorized', status: 401 })
  }

  const id = (await params).id

  // const session = {
  //   id: '88b12c71-dc7e-4709-be76-3365f5f66569',
  // }

  try {
    const existing = await db
      .select()
      .from(jobsTable)
      .where(and(eq(jobsTable.id, id), eq(jobsTable.is_open, true)))
    if (!existing.length) {
      return errorResponse({ message: 'Job not found', status: 404 })
    }

    const [applyJob] = await db
      .insert(jobApplicationsTable)
      .values({
        applicant_id: session.id,
        job_id: id,
      })
      .returning()

    if (!!applyJob.id) {
      await db.insert(jobApplicationLogsTable).values({
        job_application_id: applyJob.id,
        status: applyJob.status,
        note: noteByStatus[applyJob.status],
      })
    }

    return jsonResponse({ data: applyJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to apply job' })
  }
}
