/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/lib/db'
import { jobsTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { formJobSchema } from '@/types/form-schema'
import { eq } from 'drizzle-orm'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const getByIdJob = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, params.id))

    if (!getByIdJob.length) {
      return errorResponse({ message: 'Detail job not found', status: 404 })
    }
    return jsonResponse({ data: getByIdJob[0] })
  } catch (error) {
    return errorResponse({ message: 'Failed to get detail job' })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json()
  const parse = formJobSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: parse.error.flatten().fieldErrors,
    })
  }

  try {
    const existing = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, params.id))
    if (!existing.length) {
      return errorResponse({ message: 'Detail job not found', status: 404 })
    }

    const updateJob = await db
      .update(jobsTable)
      .set({
        title: parse.data.title,
        description: parse.data.description,
        min_salary_offered: Number(parse.data.min_salary_offered),
        max_salary_offered: Number(parse.data.max_salary_offered),
        is_open: parse.data.is_open,
        updated_at: new Date(),
      })
      .where(eq(jobsTable.id, params.id))
      .returning()
    return jsonResponse({ data: updateJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to update job' })
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    const deleteJob = await db
      .update(jobsTable)
      .set({ deleted_at: new Date() })
      .where(eq(jobsTable.id, params.id))
      .returning()
    return jsonResponse({ data: deleteJob })
  } catch (error) {
    return errorResponse({ message: 'Failed to delete job' })
  }
}
