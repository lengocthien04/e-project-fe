import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, DollarSign, Plus, Eye, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import teacherApi from "@/apis/teacher.api";
import { Teacher, TeacherStatus } from "@/types/teacher.type";
import { TeacherProfileDialog } from "./teacher-profile-dialog";

const statusColors: Record<TeacherStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  ON_LEAVE: "bg-yellow-100 text-yellow-800",
  RETIRED: "bg-blue-100 text-blue-800",
  TERMINATED: "bg-red-100 text-red-800",
};

export function TeacherManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;

  // Fetch teachers
  const { data: teachersResponse, isLoading } = useQuery({
    queryKey: ["teachers", { page, limit, search: searchTerm }],
    queryFn: () =>
      teacherApi.getAllTeachers({ page, limit, search: searchTerm }),
  });

  const teachers = teachersResponse?.data || [];
  const totalTeachers = teachersResponse?.metadata?.total || 0;

  // Get unique departments
  const departments = Array.from(new Set(teachers.map((t) => t.department)));

  // Filter teachers
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || teacher.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || teacher.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Statistics
  const stats = {
    total: totalTeachers,
    active: teachers.filter((t) => t.status === TeacherStatus.ACTIVE).length,
    onLeave: teachers.filter((t) => t.status === TeacherStatus.ON_LEAVE).length,
    retired: teachers.filter((t) => t.status === TeacherStatus.RETIRED).length,
  };

  const handleViewProfile = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setProfileDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading teachers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
            Teacher Management
          </h2>
          <p className="text-gray-600">Manage faculty and teaching staff</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="whitespace-nowrap w-fit">
            <Plus className="h-4 w-4 mr-0 sm:mr-2" />
            <p className="hidden sm:flex text-sm"> Add Teacher</p>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.onLeave}
                </p>
              </div>
              <Users className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retired</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.retired}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TeacherStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={TeacherStatus.ON_LEAVE}>On Leave</SelectItem>
                <SelectItem value={TeacherStatus.RETIRED}>Retired</SelectItem>
                <SelectItem value={TeacherStatus.TERMINATED}>
                  Terminated
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Teacher List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Teachers ({filteredTeachers.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50"
              >
                {/* Mobile: Top row with avatar, name, and checkbox */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-start">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 !ml-0">
                    <span className="text-sm font-medium">
                      {teacher.firstName[0]}
                      {teacher.lastName[0]}
                    </span>
                  </div>

                  {/* Mobile: Name and status */}
                  <div className="flex-1 min-w-0 sm:hidden">
                    <div className="mb-2">
                      <p className="text-base font-medium text-gray-900 truncate text-left sm:text-center">
                        {teacher.firstName} {teacher.lastName}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <Badge className={statusColors[teacher.status]}>
                        {teacher.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Desktop: Main content area */}
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  {/* Desktop: Name, status, and rating */}
                  <div className="hidden sm:flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                    <Badge className={statusColors[teacher.status]}>
                      {teacher.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Teacher details */}
                  <div className="flex flex-col space-y-2 sm:space-y-1 mt-3 sm:mt-0">
                    <p className="text-sm text-gray-500 truncate text-center sm:text-left">
                      {teacher.employeeId} • {teacher.department} •{" "}
                      {teacher.academicRank}
                    </p>
                    <p className="text-xs text-center sm:text-left text-gray-400 truncate">
                      {teacher.specialization} • {teacher.yearsOfExperience}{" "}
                      years exp.
                    </p>

                    {/* Mobile: Stats and salary */}
                    <div className="sm:hidden pt-2 border-t border-gray-100">
                      <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row sm:flex-col gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            Rating: {teacher.overallRating || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {teacher.highestEducation}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              ${teacher.salary?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Right side info */}
                <div className="hidden sm:block text-right flex-shrink-0">
                  <p className="text-sm text-gray-900 mb-1">
                    Rating: {teacher.overallRating || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {teacher.highestEducation}
                  </p>
                  <div className="flex items-center justify-end mb-2">
                    <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      {teacher.salary?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewProfile(teacher)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Profile Dialog */}
      {selectedTeacher && (
        <TeacherProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          teacher={selectedTeacher}
        />
      )}
    </div>
  );
}
