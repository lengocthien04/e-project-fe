import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface RiskAssessmentAlertProps {
  riskAssessment: Array<{
    type: string
    level: string
    description: string
    departments: string[]
    impact: string
    recommendation: string
  }>
}

export function RiskAssessmentAlert({ riskAssessment }: RiskAssessmentAlertProps) {
  if (riskAssessment.length === 0) return null

  return (
    <Card className="border-l-4 border-l-red-500 bg-red-50">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Quality Risks Identified</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {riskAssessment.map((risk, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={risk.level === "High" ? "destructive" : "secondary"}>{risk.level} Risk</Badge>
                    <span className="text-sm text-gray-500">{risk.type}</span>
                  </div>
                  <p className="text-sm font-medium mb-1">{risk.description}</p>
                  <p className="text-xs text-gray-600 mb-2">{risk.recommendation}</p>
                  <div className="flex flex-wrap gap-1">
                    {risk.departments.slice(0, 2).map((dept, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {dept.split(" ")[0]}
                      </Badge>
                    ))}
                    {risk.departments.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{risk.departments.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
