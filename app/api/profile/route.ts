/* eslint-disable @typescript-eslint/no-unused-vars */
import { noteByStatus } from '@/constants'
import { db } from '@/lib/db'
import { applicantsTable, usersTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, and, sql } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { formProfileSchema } from '@/types/form-schema'
import { hashPassword } from '@/helpers'
export async function PATCH(
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

  const body = await req.json()
  const parse = formProfileSchema.safeParse(body)

  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      errors: 'parse.error.flatten().fieldErrors',
      status: 400,
    })
  }

  const applicantId = session?.applicant_id || ''
  if (!applicantId) {
    return errorResponse({
      message: 'User ID is missing from session.',
      status: 400,
    })
  }
  try {
    const [existing] = await db
      .select()
      .from(applicantsTable)
      .where(eq(applicantsTable.user_id, applicantId))

    const updateProfile = await db.transaction(async (tx) => {
      const [updateemail] = await tx
        .update(usersTable)
        .set({
          email: parse.data.email,
          password: await hashPassword(parse.data.password),
        })
        .where(eq(usersTable.id, applicantId))
        .returning()
      if (!updateemail) {
        throw new Error('Failed to update')
      }

      const [updateprof] = await tx
        .update(applicantsTable)
        .set({
          full_name: parse.data.full_name,
          phone: parse.data.phone,
          summary: parse.data.summary,
          min_salary_expectation: Number(parse.data.min_salary_expectation),
          max_salary_expectation: Number(parse.data.max_salary_expectation),
        })
        .where(eq(applicantsTable.id, applicantId))
        .returning()

      return { user: updateemail, applicant: updateprof }
    })
    return jsonResponse({ data: updateProfile })
  } catch (error) {
    return errorResponse({ message: 'Failed update profile' })
  }
}
