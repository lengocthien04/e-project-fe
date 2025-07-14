import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertTriangle, Target, AlertCircle, Brain } from "lucide-react"

interface RecommendationsTabProps {
  riskAssessment: any[]
  departmentQuality: any[]
}

export function RecommendationsTab({ riskAssessment, departmentQuality }: RecommendationsTabProps) {
  return (
    <div className="space-y-6">
      {/* Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <TrendingUp className="h-5 w-5 mr-2" />
              Strengths & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-100 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🏆 High Performance Areas</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>
                  • {departmentQuality[0]?.department} leads with {departmentQuality[0]?.qualityScore} quality score
                </li>
                <li>• {departmentQuality.filter((d) => d.qualityGrade === "A").length} departments achieved Grade A</li>
                <li>• Overall quality improved by 5.2% from last assessment</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">📈 Growth Opportunities</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Optimize student-teacher ratios for better outcomes</li>
                <li>• Increase utilization in underenrolled courses</li>
                <li>• Share best practices from top performers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-100 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Attention Required</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• {departmentQuality.filter((d) => d.riskLevel === "High").length} departments at high risk</li>
                <li>• {departmentQuality.filter((d) => d.avgGPA < 3.0).length} departments below GPA threshold</li>
                <li>• Review retention strategies for at-risk programs</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-100 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">🎯 Strategic Initiatives</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Implement cross-departmental collaboration</li>
                <li>• Develop teacher mentorship programs</li>
                <li>• Create data-driven improvement plans</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Action Plan */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Quality Improvement Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* High Priority Actions */}
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                High Priority Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskAssessment
                  .filter((r) => r.level === "High")
                  .map((risk, index) => (
                    <div key={index} className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">{risk.type} Risk Mitigation</h4>
                      <p className="text-sm text-red-800 mb-2">{risk.description}</p>
                      <p className="text-sm text-red-700 mb-3">{risk.recommendation}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="destructive">Urgent</Badge>
                        <span className="text-xs text-red-600">Impact: {risk.impact}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Medium Priority Actions */}
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Medium Priority Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {riskAssessment
                  .filter((r) => r.level === "Medium")
                  .map((risk, index) => (
                    <div key={index} className="p-4 border-l-4 border-l-yellow-500 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900 mb-2">{risk.type} Enhancement</h4>
                      <p className="text-sm text-yellow-800 mb-2">{risk.description}</p>
                      <p className="text-sm text-yellow-700 mb-3">{risk.recommendation}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">Important</Badge>
                        <span className="text-xs text-yellow-600">Impact: {risk.impact}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Strategic Initiatives */}
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Strategic Quality Initiatives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Excellence Centers</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Establish centers of excellence in high-performing departments to mentor others
                  </p>
                  <Badge variant="outline">Long-term</Badge>
                </div>

                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Quality Assurance System</h4>
                  <p className="text-sm text-green-800 mb-3">
                    Implement continuous monitoring and feedback systems for real-time quality tracking
                  </p>
                  <Badge variant="outline">Medium-term</Badge>
                </div>

                <div className="p-4 border border-purple-200 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">Innovation Labs</h4>
                  <p className="text-sm text-purple-800 mb-3">
                    Create innovation labs for experimenting with new teaching methodologies
                  </p>
                  <Badge variant="outline">Long-term</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
