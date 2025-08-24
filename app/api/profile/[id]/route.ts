// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { noteByStatus } from '@/constants'
// import { db } from '@/lib/db'
// import { applicantsTable, usersTable } from '@/lib/db/schema'
// import { errorResponse, jsonResponse } from '@/utils'
// import { eq, and, sql } from 'drizzle-orm'
// import { getToken } from 'next-auth/jwt'
// import { NextRequest } from 'next/server'
// import { formProfileSchema } from '@/types/form-schema'
// import { hashPassword } from '@/helpers'
// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   const session = await getToken({
//     req: req as NextRequest,
//     secret: process.env.NEXTAUTH_SECRET!,
//   })

//   if (!session) {
//     return errorResponse({ message: 'Unauthorized', status: 401 })
//   }

//   const body = await req.json()
//   const parse = formProfileSchema.safeParse(body)

//   if (!parse.success) {
//     return errorResponse({
//       message: 'Validation error',
//       errors: 'parse.error.flatten().fieldErrors',
//       status: 400,
//     })
//   }

//   const applicantId = session?.applicant_id || ''
//   if (!applicantId) {
//     return errorResponse({
//       message: 'User ID is missing from session.',
//       status: 400,
//     })
//   }
//   try {
//     const [existing] = await db
//       .select()
//       .from(applicantsTable)
//       .where(eq(applicantsTable.user_id, applicantId))

//     const updateProfile = await db.transaction(async (tx) => {
//       const [updateemail] = await tx
//         .update(usersTable)
//         .set({
//           email: parse.data.email,
//           password: await hashPassword(parse.data.password),
//         })
//         .where(eq(usersTable.id, applicantId))
//         .returning()
//       if (!updateemail) {
//         throw new Error('Failed to update')
//       }

//       const [updateprof] = await tx
//         .update(applicantsTable)
//         .set({
//           full_name: parse.data.full_name,
//           phone: parse.data.phone,
//           summary: parse.data.summary,
//           min_salary_expectation: Number(parse.data.min_salary_expectation),
//           max_salary_expectation: Number(parse.data.max_salary_expectation),
//         })
//         .where(eq(applicantsTable.id, applicantId))
//         .returning()

//       return { user: updateemail, applicant: updateprof }
//     })
//     return jsonResponse({ data: updateProfile })
//   } catch (error) {
//     console.log('err => ', error)
//     return errorResponse({ message: 'Failed update profile' })
//   }
// }
import { db } from '@/lib/db'
import { applicantsTable, usersTable } from '@/lib/db/schema'
import { errorResponse, jsonResponse } from '@/utils'
import { eq, and } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'
import { formProfileSchema } from '@/types/form-schema'
import { hashPassword } from '@/helpers'

/**
 * Handles the PATCH request to update a user's profile and applicant information.
 * @param req The incoming request object.
 * @returns A JSON response indicating success or failure.
 */
export async function PATCH(req: NextRequest) {
  // Get the session token to authenticate the user.
  const session = await getToken({
    req: req as NextRequest,
    secret: process.env.NEXTAUTH_SECRET!,
  })

  // If no session, return unauthorized.
  if (!session) {
    return errorResponse({ message: 'Unauthorized', status: 401 })
  }

  // Parse and validate the request body.
  const body = await req.json()
  const parse = formProfileSchema.safeParse(body)

  // Handle validation errors.
  if (!parse.success) {
    return errorResponse({
      message: 'Validation error',
      // Correctly return the field errors object, not a string literal.
      errors: parse.error.flatten().fieldErrors,
      status: 400,
    })
  }

  // Extract the user ID from the session. This is the correct ID to use for updates.
  const userId = session?.applicant_id || ''
  if (!userId) {
    return errorResponse({
      message: 'User ID is missing from session.',
      status: 400,
    })
  }

  try {
    // Perform the database update operation within a transaction for safety.
    const updateProfile = await db.transaction(async (tx) => {
      // Find the existing applicant record to get the applicant's unique ID.
      // This ID is different from the user ID.
      const [existingApplicant] = await tx
        .select({ id: applicantsTable.id })
        .from(applicantsTable)
        .where(eq(applicantsTable.user_id, userId))

      if (!existingApplicant) {
        throw new Error('Applicant profile not found.')
      }

      // Prepare the user data for update.
      const userUpdateData = {
        email: parse.data.email,
        // Only update the password if a new one is provided.
        ...(parse.data.password && {
          password: await hashPassword(parse.data.password),
        }),
      }

      // Update the user's email and password.
      const [updatedUser] = await tx
        .update(usersTable)
        .set(userUpdateData)
        .where(eq(usersTable.id, userId))
        .returning()

      if (!updatedUser) {
        throw new Error('Failed to update user record.')
      }

      // Update the applicant's profile details using the unique applicant ID.
      const [updatedApplicant] = await tx
        .update(applicantsTable)
        .set({
          full_name: parse.data.full_name,
          phone: parse.data.phone,
          summary: parse.data.summary,
          min_salary_expectation: Number(parse.data.min_salary_expectation),
          max_salary_expectation: Number(parse.data.max_salary_expectation),
        })
        .where(eq(applicantsTable.id, existingApplicant.id)) // Use the correct applicant ID here
        .returning()

      return { user: updatedUser, applicant: updatedApplicant }
    })

    // Return a successful response with the updated data.
    return jsonResponse({ data: updateProfile })
  } catch (error) {
    console.error('Error updating profile:', error) // Log the detailed error for debugging
    return errorResponse({ message: 'Failed to update profile', status: 500 })
  }
}
