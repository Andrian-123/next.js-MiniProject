import CardReports from '@/components/section/card-reports'
import { Separator } from '@/components/ui/separator'
import AdminDashboardJobTable from './job-table'
import { db } from '@/lib/db'
import { jobsTable } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
export default async function AdminDashboardContainer() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobsTable)
    .execute()
  const jobCount = result[0]?.count || 0
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4">
        <CardReports
          items={[
            { title: 'Job', value: jobCount, description: 'Jobs Opening' },
          ]}
        />
        <Separator />
        <AdminDashboardJobTable />
      </div>
    </div>
  )
}
