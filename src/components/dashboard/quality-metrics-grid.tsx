import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, BarChart3, TrendingUp } from "lucide-react"

interface QualityMetricsGridProps {
  departmentQuality: any[]
}

export function QualityMetricsGrid({ departmentQuality }: QualityMetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Performers</p>
              <p className="text-2xl font-bold text-green-600">
                {departmentQuality.filter((d) => d.qualityScore >= 85).length}
              </p>
              <p className="text-xs text-gray-500">Departments with Grade A</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {departmentQuality.filter((d) => d.riskLevel === "High").length}
              </p>
              <p className="text-xs text-gray-500">Departments needing attention</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(departmentQuality.reduce((sum, d) => sum + d.qualityScore, 0) / departmentQuality.length)}
              </p>
              <p className="text-xs text-gray-500">Across all departments</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Improvement Rate</p>
              <p className="text-2xl font-bold text-purple-600">+5.2%</p>
              <p className="text-xs text-gray-500">From last assessment</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
