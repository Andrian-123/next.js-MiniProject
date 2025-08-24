// import CardReports from '@/components/section/card-reports'
// import { Separator } from '@/components/ui/separator'

// export default function ApplicantProfileContainer() {
//   return (
//     <div className="@container/main flex flex-1 flex-col gap-2">
//       <div className="flex flex-col gap-4">
//         <Separator />
//       </div>
//     </div>
//   )
// }

'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowUpLeft, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import useFormAction from '@/hooks/useFormAction'
import { formProfileSchema } from '@/types/form-schema'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useState } from 'react'

export default function AuthSignupContainer() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const { form } = useFormAction({
    schema: formProfileSchema,
    defaultValues: {
      full_name: '',
      phone: '',
      summary: '',
      min_salary_expectation: '0',
      max_salary_expectation: '0',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formProfileSchema>) => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile/[id]', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }).then((res) => res.json())

      if (!response.success) {
        setLoading(false)
        toast.error(`${response.message}`)
      } else {
        toast.success('Profile Updated')
      }
    } catch (error) {
      console.log('error => ', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <div>
            <Link href="/">
              <Button variant="link">
                <ArrowUpLeft />
                Home
              </Button>
            </Link>
          </div>
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update profile account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="name ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="phone ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Summary</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Summary ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_salary_expectation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Salary Expectation</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="min_salary_expectation ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max_salary_expectation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Salary Expectation</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="max_salary_expectation ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email ..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="password ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-8">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2Icon className="animate-spin" />}
                      {loading ? 'loading' : 'Update'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
