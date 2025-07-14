import { Shield, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DashboardHeaderProps {
  selectedDepartment: string
  setSelectedDepartment: (value: string) => void
  selectedTimeframe: string
  setSelectedTimeframe: (value: string) => void
  departmentQuality: any[]
}

export function DashboardHeader({
  selectedDepartment,
  setSelectedDepartment,
  selectedTimeframe,
  setSelectedTimeframe,
  departmentQuality,
}: DashboardHeaderProps) {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Education Quality Inspection Dashboard
        </h1>
      </div>
      <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
        Comprehensive quality assessment and monitoring system for educational institutions
      </p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departmentQuality.map((dept) => (
              <SelectItem key={dept.department} value={dept.department}>
                {dept.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Current Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Period</SelectItem>
            <SelectItem value="semester">This Semester</SelectItem>
            <SelectItem value="year">Academic Year</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
