import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import JobSeekerApplicationsTable from './applications-table'

export default function JobSeekerDashboardContainer() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports
          items={[{ title: 'Job', value: 5, description: 'Jobs Opening' }]}
        />
        <Separator />
        <JobSeekerApplicationsTable />
      </div>
    </div>
  )
}
