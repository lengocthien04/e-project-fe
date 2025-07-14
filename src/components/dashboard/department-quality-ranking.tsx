import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"

const COLORS = {
  excellent: "#10b981",
  good: "#3b82f6",
  average: "#f59e0b",
  poor: "#ef4444",
}

interface DepartmentQualityRankingProps {
  departmentQuality: any[]
}

export function DepartmentQualityRanking({ departmentQuality }: DepartmentQualityRankingProps) {
  const getQualityColor = (score: number) => {
    if (score >= 85) return COLORS.excellent
    if (score >= 75) return COLORS.good
    if (score >= 65) return COLORS.average
    return COLORS.poor
  }

  const getQualityBadgeVariant = (score: number) => {
    if (score >= 85) return "default"
    if (score >= 75) return "secondary"
    if (score >= 65) return "outline"
    return "destructive"
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-green-600" />
          Department Quality Ranking
        </CardTitle>
        <CardDescription>Quality scores and grades by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {departmentQuality.map((dept, index) => (
            <div key={dept.department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-sm font-bold text-blue-800">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{dept.shortName}</p>
                  <p className="text-xs text-gray-500">{dept.studentCount} students</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: getQualityColor(dept.qualityScore) }}>
                    {dept.qualityScore}
                  </p>
                  <Badge variant={getQualityBadgeVariant(dept.qualityScore)} className="text-xs">
                    Grade {dept.qualityGrade}
                  </Badge>
                </div>
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: getQualityColor(dept.qualityScore) }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
