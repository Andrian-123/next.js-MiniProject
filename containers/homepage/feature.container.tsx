import { Card } from '@/components/ui/card'
import { ThumbsUp, MonitorCheck, ChartNoAxesCombined } from 'lucide-react'

export default function HomepageFeatureContainer() {
  return (
    <div className="container mx-auto flex justify-around items-center flex-col py-14">
      <h1 className="text-4xl font-semibold tracking-wider uppercase">
        Features
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-10">
        <Card>
          <div className="flex justify-center items-center flex-col p-6">
            <ThumbsUp size={48} strokeWidth={1.5} />
            <p className="text-md md:text-xl mt-2 font-semibold text-center">
              Simplicity
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex justify-center items-center flex-col p-6">
            <MonitorCheck size={48} strokeWidth={1.5} />
            <p className="text-md md:text-xl mt-2 font-semibold text-center">
              Dashboard Management
            </p>
          </div>
        </Card>
        <Card>
          <div className="flex justify-center items-center flex-col p-6">
            <ChartNoAxesCombined size={48} strokeWidth={1.5} />
            <p className="text-md md:text-xl mt-2 font-semibold text-center">
              Easy Tracking
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
