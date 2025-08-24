'use client'
import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import ApplicationsTable from './applications-table'

import { NextRequest } from 'next/server'
import { ApiResponse, ApplicationsType } from '@/types/common'
import useFetcher from '@/hooks/useFetcher'

export default  function ApplicantDashboardContainer(req: NextRequest) {
  const { data: myApplications, isLoading } = useFetcher<
    ApiResponse<ApplicationsType[]>
  >({
    path: '/job-applications/me',
  })
  const applicationsCount = myApplications?.data?.length || 0
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports
          items={[
            {
              title: 'Job',
              value: applicationsCount,
              description: 'Jobs Opening',
            },
          ]}
        />
        <Separator />
        <ApplicationsTable />
      </div>
    </div>
  )
}
