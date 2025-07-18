"use client";

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
import {
  useCurricula,
  type CurriculumStatus,
} from "@/contexts/curriculum-context";
import { useTeachers } from "@/contexts/teacher-context";
import {
  Search,
  BookOpen,
  Users,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
} from "lucide-react";

const statusColors: Record<CurriculumStatus, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  "under-review": "bg-yellow-100 text-yellow-800",
  archived: "bg-red-100 text-red-800",
};

const levelColors = {
  undergraduate: "bg-blue-100 text-blue-800",
  graduate: "bg-purple-100 text-purple-800",
  doctoral: "bg-indigo-100 text-indigo-800",
};

export function CurriculumManagement() {
  const {
    curricula,
    selectedCurricula,
    setSelectedCurricula,
    deleteCurriculum,
    deleteMultipleCurricula,
  } = useCurricula();
  const { teachers } = useTeachers();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  // Get unique departments
  const departments = Array.from(new Set(curricula.map((c) => c.department)));

  // Filter curricula
  const filteredCurricula = curricula.filter((curriculum) => {
    const matchesSearch =
      curriculum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curriculum.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curriculum.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || curriculum.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || curriculum.status === statusFilter;
    const matchesLevel =
      levelFilter === "all" || curriculum.level === levelFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesLevel;
  });

  // Statistics
  const stats = {
    total: curricula.length,
    active: curricula.filter((c) => c.status === "active").length,
    totalEnrollments: curricula.reduce(
      (sum, c) => sum + c.enrolledStudents.length,
      0
    ),
    avgCapacity: Math.round(
      curricula.reduce(
        (sum, c) => sum + (c.enrolledStudents.length / c.maxCapacity) * 100,
        0
      ) / curricula.length
    ),
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCurricula(filteredCurricula.map((c) => c.id));
    } else {
      setSelectedCurricula([]);
    }
  };

  const handleSelectCurriculum = (curriculumId: string, checked: boolean) => {
    if (checked) {
      setSelectedCurricula((prev) => [...prev, curriculumId]);
    } else {
      setSelectedCurricula((prev) => prev.filter((id) => id !== curriculumId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedCurricula.length > 0) {
      deleteMultipleCurricula(selectedCurricula);
    }
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unassigned";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Curriculum Management
          </h2>
          <p className="text-gray-600">Manage courses and academic programs</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="whitespace-nowrap w-fit">
            <Plus className="h-4 w-4 mr-0 md:mr-2" />
            <p className="hidden md:flex text-sm"> Add Course</p>
          </Button>
          {selectedCurricula.length > 0 && (
            <>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Selected ({selectedCurricula.length})
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalEnrollments}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Capacity</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.avgCapacity}%
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 hover:border-none">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
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
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="doctoral">Doctoral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Curriculum List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Courses ({filteredCurricula.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedCurricula.length === filteredCurricula.length &&
                  filteredCurricula.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredCurricula.map((curriculum) => (
              <div
                key={curriculum.id}
                className="flex flex-col md:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50"
              >
                {/* Mobile: Top row with icon, name, and checkbox */}
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {/* Desktop: Checkbox on left */}
                  <Checkbox
                    checked={selectedCurricula.includes(curriculum.id)}
                    onCheckedChange={(checked) =>
                      handleSelectCurriculum(curriculum.id, checked as boolean)
                    }
                    className="hidden sm:block"
                  />

                  {/* Icon */}
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>

                  {/* Mobile: Name and badges */}
                  <div className="flex-1 min-w-0 sm:hidden">
                    <div className="mb-2">
                      <p className="text-base font-medium text-gray-900 truncate text-left sm:text-center">
                        {curriculum.name}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={statusColors[curriculum.status]}>
                        {curriculum.status.replace("-", " ")}
                      </Badge>
                      <Badge className={levelColors[curriculum.level]}>
                        {curriculum.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile: Checkbox in top right */}
                  <Checkbox
                    checked={selectedCurricula.includes(curriculum.id)}
                    onCheckedChange={(checked) =>
                      handleSelectCurriculum(curriculum.id, checked as boolean)
                    }
                    className="sm:hidden w-5 h-5 flex-shrink-0"
                  />
                </div>

                {/* Desktop: Main content area */}
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  {/* Desktop: Name and badges */}
                  <div className="hidden sm:flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {curriculum.name}
                    </p>
                    <Badge className={statusColors[curriculum.status]}>
                      {curriculum.status.replace("-", " ")}
                    </Badge>
                    <Badge className={levelColors[curriculum.level]}>
                      {curriculum.level}
                    </Badge>
                  </div>

                  {/* Course details */}
                  <div className="flex flex-col space-y-2 md:space-y-1 mt-3 md:mt-0">
                    <p className="text-sm text-gray-500 text-center sm:text-left">
                      {curriculum.code} • {curriculum.department} •{" "}
                      {curriculum.credits} credits
                    </p>

                    {/* Schedule and capacity info */}
                    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4 text-left">
                      <div className="flex items-center text-xs text-gray-400 text-left">
                        <Users className="h-3 w-3 mr-1" />
                        {curriculum.enrolledStudents.length}/
                        {curriculum.maxCapacity}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {curriculum.schedule.days.join(", ")}{" "}
                        {curriculum.schedule.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="h-3 w-3 mr-1" />
                        {curriculum.schedule.location}
                      </div>
                    </div>

                    {/* Mobile: Teacher and semester info */}
                    <div className="md:hidden pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getTeacherName(curriculum.teacherId)}
                          </p>
                          <p className="text-sm text-gray-500 text-center sm:text-left">
                            {curriculum.semester} {curriculum.year}
                          </p>
                        </div>
                      </div>

                      {/* Mobile: Progress bar */}
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (curriculum.enrolledStudents.length /
                                  curriculum.maxCapacity) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">
                          {Math.round(
                            (curriculum.enrolledStudents.length /
                              curriculum.maxCapacity) *
                              100
                          )}
                          % full
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: Right side info */}
                <div className="hidden md:block text-right flex-shrink-0">
                  <p className="text-sm text-gray-900 mb-1">
                    {getTeacherName(curriculum.teacherId)}
                  </p>
                  <p className="text-sm text-gray-500 text-center sm:text-left">
                    {curriculum.semester} {curriculum.year}
                  </p>
                  <div className="mt-1">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (curriculum.enrolledStudents.length /
                              curriculum.maxCapacity) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(
                        (curriculum.enrolledStudents.length /
                          curriculum.maxCapacity) *
                          100
                      )}
                      % full
                    </p>
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
