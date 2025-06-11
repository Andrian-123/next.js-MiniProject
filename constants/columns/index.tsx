import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { JobType } from '@/types/common'
import { formatRangeRupiah } from '@/utils'
import { ValueJobType } from '@/types/common'
import { Badge } from '@/components/ui/badge'

export const columnsJobs = (
  onClickAction: ({ data, type }: ValueJobType) => void,
): ColumnDef<JobType>[] => [
  {
    header: 'Open',
    cell: ({ row }) => (
      <Badge variant={row.original.is_open ? 'default' : 'outline'}>
        {row.original.is_open ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <p>{row.getValue('title')}</p>,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => <p>{row.getValue('description')}</p>,
  },
  {
    header: 'Salary Offered',
    cell: ({ row }) => (
      <p>{`${formatRangeRupiah(
        row.original.min_salary_offered,
        row.original.max_salary_offered,
      )}`}</p>
    ),
  },
  {
    accessorKey: 'applicants_total',
    header: 'Applicants',
    cell: ({ row }) => <p>{row.getValue('applicants_total')}</p>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                onClickAction({
                  data: {
                    ...row.original,
                    min_salary_offered: String(row.original.min_salary_offered),
                    max_salary_offered: String(row.original.max_salary_offered),
                  },
                  type: 'edit',
                })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                const confirm = window.confirm(
                  'Are you sure want delete this data ?',
                )
                if (confirm) {
                  onClickAction({
                    data: {
                      ...row.original,
                      min_salary_offered: String(
                        row.original.min_salary_offered,
                      ),
                      max_salary_offered: String(
                        row.original.max_salary_offered,
                      ),
                    },
                    type: 'delete',
                  })
                }
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
