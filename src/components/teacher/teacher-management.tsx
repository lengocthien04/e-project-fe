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
import { Checkbox } from "@/components/ui/checkbox";
import { useTeachers, type TeacherStatus } from "@/contexts/teacher-context";
import {
  Search,
  Users,
  Star,
  DollarSign,
  BookOpen,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";

const statusColors: Record<TeacherStatus, string> = {
  active: "bg-green-100 text-green-800",
  "on-leave": "bg-yellow-100 text-yellow-800",
  retired: "bg-gray-100 text-gray-800",
  "part-time": "bg-blue-100 text-blue-800",
};

export function TeacherManagement() {
  const {
    teachers,
    selectedTeachers,
    setSelectedTeachers,
    deleteTeacher,
    deleteMultipleTeachers,
  } = useTeachers();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
    total: teachers.length,
    active: teachers.filter((t) => t.status === "active").length,
    partTime: teachers.filter((t) => t.status === "part-time").length,

    totalStudents: teachers.reduce((sum, t) => sum + t.studentsCount, 0),
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTeachers(filteredTeachers.map((t) => t.id));
    } else {
      setSelectedTeachers([]);
    }
  };

  const handleSelectTeacher = (teacherId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeachers((prev) => [...prev, teacherId]);
    } else {
      setSelectedTeachers((prev) => prev.filter((id) => id !== teacherId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedTeachers.length > 0) {
      deleteMultipleTeachers(selectedTeachers);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Teacher Management
          </h2>
          <p className="text-gray-600">Manage faculty and teaching staff</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="whitespace-nowrap w-fit">
            <Plus className="h-4 w-4 mr-0 sm:mr-2" />
            <p className="hidden sm:flex text-sm"> Add Teacher</p>
          </Button>
          {selectedTeachers.length > 0 && (
            <>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Selected ({selectedTeachers.length})
              </Button>
              <Button variant="destructive" onClick={handleDeleteSelected}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalStudents}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 hover:border:none">
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
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
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedTeachers.length === filteredTeachers.length &&
                  filteredTeachers.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
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
                  {/* Desktop: Checkbox on left */}
                  <Checkbox
                    checked={selectedTeachers.includes(teacher.id)}
                    onCheckedChange={(checked) =>
                      handleSelectTeacher(teacher.id, checked as boolean)
                    }
                    className="hidden sm:block sm:mr-2"
                  />

                  {/* Avatar */}
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
                        {teacher.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile: Checkbox in top right */}
                  <Checkbox
                    checked={selectedTeachers.includes(teacher.id)}
                    onCheckedChange={(checked) =>
                      handleSelectTeacher(teacher.id, checked as boolean)
                    }
                    className="sm:hidden w-5 h-5 flex-shrink-0"
                  />
                </div>

                {/* Desktop: Main content area */}
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  {/* Desktop: Name, status, and rating */}
                  <div className="hidden sm:flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {teacher.firstName} {teacher.lastName}
                    </p>
                    <Badge className={statusColors[teacher.status]}>
                      {teacher.status.replace("-", " ")}
                    </Badge>
                  </div>

                  {/* Teacher details */}
                  <div className="flex flex-col space-y-2 sm:space-y-1 mt-3 sm:mt-0">
                    <p className="text-sm text-gray-500 truncate text-center sm:text-left">
                      {teacher.employeeId} • {teacher.department} •{" "}
                      {teacher.experience} years exp.
                    </p>
                    <p className="text-xs text-center sm:text-left text-gray-400 truncate">
                      {teacher.specialization.join(", ")}
                    </p>

                    {/* Mobile: Stats and salary */}
                    <div className="sm:hidden pt-2 border-t border-gray-100">
                      <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-row sm:flex-col gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {teacher.studentsCount} students
                          </p>
                          <p className="text-sm text-gray-500">
                            {teacher.coursesAssigned.length} courses
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              ${teacher.salary.toLocaleString()}
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
                    {teacher.studentsCount} students
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {teacher.coursesAssigned.length} courses
                  </p>
                  <div className="flex items-center justify-end">
                    <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">
                      ${teacher.salary.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
