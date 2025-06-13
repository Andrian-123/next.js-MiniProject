'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Banknote } from 'lucide-react'
import { formatRangeRupiah } from '@/utils'
import { Button } from '@/components/ui/button'
import useFetcher from '@/hooks/useFetcher'
import { ApiResponse, JobType } from '@/types/common'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

export default function HomepageJobContainer() {
  const { data } = useSession()
  const { data: jobs, mutate } = useFetcher<ApiResponse<JobType[]>>({
    path: '/jobs',
  })

  const handleApplyJob = async (id: string) => {
    try {
      const response = await fetch(`/api/job-applications/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        mutate()
        toast.success('Apply job successful')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log('error => ', error)
    }
  }

  return (
    <div
      className="container mx-auto flex justify-around items-center flex-col py-14"
      id="jobs"
    >
      <h1 className="text-4xl font-semibold tracking-wider uppercase">Jobs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 w-full">
        {jobs?.data?.map((job, index) => (
          <Card key={String(index)} className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>
                <Badge variant={job.is_open ? 'default' : 'outline'}>
                  {job.is_open ? 'Open' : 'Close'}
                </Badge>
              </CardDescription>
              <CardDescription className="flex justify-start items-center">
                <Banknote />{' '}
                {formatRangeRupiah(
                  job.min_salary_offered,
                  job.max_salary_offered,
                )}
              </CardDescription>
              <CardDescription>{job.description}</CardDescription>
            </CardHeader>
            <CardFooter hidden={data?.user.role === 'admin' || !job.is_open}>
              <Button
                disabled={!!job.is_applied}
                onClick={() => handleApplyJob(job.id)}
              >
                {!!job.is_applied ? 'Applied' : 'Apply'}
                {/* Apply */}
              </Button>
            </CardFooter>
          </Card>
        )) || null}
      </div>
    </div>
  )
}
