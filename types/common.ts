/* eslint-disable @typescript-eslint/no-explicit-any */
import { drawerArray, jobStatusArray } from '@/constants'
import { z } from 'zod'
import { formJobSchema } from './form-schema'

export type JobStatusType = (typeof jobStatusArray)[number]

export type DrawerType = (typeof drawerArray)[number]

export type ValueJobType = {
  data?: z.infer<typeof formJobSchema> | any
  type: DrawerType | string
}

export type ApiResponse<T> = {
  success: boolean
  data: T
}

export type JobType = {
  id: string
  title: string
  description: string
  min_salary_offered: number
  max_salary_offered: number
  is_open: boolean
  applicants_total: string
  created_at: string
  updated_at: string
  deleted_at: string
}
