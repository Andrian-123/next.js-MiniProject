'use client'

import ListTable from '@/components/section/data-table'
import { columnsApplications } from '@/constants/columns'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, ApplicationsType } from '@/types/common'

export default function JobSeekerApplicationsTable() {
  const { data: myApplications, isLoading } = useFetcher<
    ApiResponse<ApplicationsType[]>
  >({
    path: '/job-applications/me',
  })

  console.log('my apps ->', myApplications)

  return (
    <div className="w-full flex flex-col">
      <div className="pb-4 flex justify-between items-center">
        <p className="text-xl font-semibold">My Applications</p>
      </div>
      <ListTable
        columns={columnsApplications}
        data={myApplications?.data || []}
        isLoading={isLoading}
      />
    </div>
  )
}
