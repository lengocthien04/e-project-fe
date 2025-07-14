import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, Star, Users, Activity } from "lucide-react"

const COLORS = {
  excellent: "#10b981",
  good: "#3b82f6",
  average: "#f59e0b",
  poor: "#ef4444",
}

interface QualityMetricsOverviewProps {
  qualityMetrics: {
    overall: number
    academic: number
    teaching: number
    operational: number
    satisfaction: number
    avgGPA: number
    avgTeacherRating: number
    retentionRate: number
    utilizationRate: number
  }
}

export function QualityMetricsOverview({ qualityMetrics }: QualityMetricsOverviewProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={getQualityColor(qualityMetrics.overall)}
                    strokeWidth="2"
                    strokeDasharray={`${qualityMetrics.overall}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-900">{qualityMetrics.overall}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Overall Quality Score</p>
              <Badge variant={getQualityBadgeVariant(qualityMetrics.overall)} className="mt-1">
                {qualityMetrics.overall >= 85
                  ? "Excellent"
                  : qualityMetrics.overall >= 75
                    ? "Good"
                    : qualityMetrics.overall >= 65
                      ? "Average"
                      : "Needs Improvement"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-700">Academic Excellence</p>
              <p className="text-3xl font-bold text-green-900">{qualityMetrics.academic}%</p>
              <div className="flex items-center text-sm text-green-600">
                <GraduationCap className="h-4 w-4 mr-1" />
                <span>Avg GPA: {qualityMetrics.avgGPA}</span>
              </div>
            </div>
            <Progress value={qualityMetrics.academic} className="w-16 h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-purple-700">Teaching Quality</p>
              <p className="text-3xl font-bold text-purple-900">{qualityMetrics.teaching}%</p>
              <div className="flex items-center text-sm text-purple-600">
                <Star className="h-4 w-4 mr-1" />
                <span>Avg Rating: {qualityMetrics.avgTeacherRating}</span>
              </div>
            </div>
            <Progress value={qualityMetrics.teaching} className="w-16 h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-orange-700">Student Satisfaction</p>
              <p className="text-3xl font-bold text-orange-900">{qualityMetrics.satisfaction}%</p>
              <div className="flex items-center text-sm text-orange-600">
                <Users className="h-4 w-4 mr-1" />
                <span>Retention: {qualityMetrics.retentionRate}%</span>
              </div>
            </div>
            <Progress value={qualityMetrics.satisfaction} className="w-16 h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-teal-700">Resource Efficiency</p>
              <p className="text-3xl font-bold text-teal-900">{qualityMetrics.operational}%</p>
              <div className="flex items-center text-sm text-teal-600">
                <Activity className="h-4 w-4 mr-1" />
                <span>Utilization: {qualityMetrics.utilizationRate}%</span>
              </div>
            </div>
            <Progress value={qualityMetrics.operational} className="w-16 h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
