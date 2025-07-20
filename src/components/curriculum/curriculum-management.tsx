"use client";

import { useState, useMemo } from "react";
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
  Search,
  BookOpen,
  Users,
  Plus,
  GraduationCap,
  Loader2,
  Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Course, CourseStatus, CourseLevel } from "@/types/course.type";
import { useDebounce } from "@/hooks/use-debounce";
import courseApi from "@/apis/coruse.api";
import { CourseProfileDialog } from "./course-profile-dialog";

const statusColors: Record<CourseStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  ARCHIVED: "bg-red-100 text-red-800",
};

const levelColors: Record<CourseLevel, string> = {
  UNDERGRADUATE: "bg-blue-100 text-blue-800",
  GRADUATE: "bg-purple-100 text-purple-800",
  DOCTORAL: "bg-indigo-100 text-indigo-800",
};

export default function CurriculumManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseProfile, setShowCourseProfile] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Search parameters
  const searchParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm || undefined,
      department: departmentFilter !== "all" ? departmentFilter : undefined,
      level: levelFilter !== "all" ? (levelFilter as CourseLevel) : undefined,
      status:
        statusFilter !== "all" ? (statusFilter as CourseStatus) : undefined,
    }),
    [
      currentPage,
      pageSize,
      debouncedSearchTerm,
      departmentFilter,
      levelFilter,
      statusFilter,
    ]
  );

  // Fetch courses with search and pagination
  const {
    data: coursesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", searchParams],
    queryFn: () => courseApi.getAllCourses(searchParams),
  });

  // Get all courses for statistics (without pagination)
  const { data: allCoursesResponse } = useQuery({
    queryKey: ["courses", "all"],
    queryFn: () => courseApi.getAllCourses({ limit: 100 }),
  });

  // Get departments
  const { data: departmentsResponse } = useQuery({
    queryKey: ["courses", "departments"],
    queryFn: () => courseApi.getDepartments(),
  });

  const courses = useMemo(
    () => coursesResponse?.data || [],
    [coursesResponse?.data]
  );
  const metadata = coursesResponse?.metadata;
  const allCourses = useMemo(
    () => allCoursesResponse?.data || [],
    [allCoursesResponse?.data]
  );
  const departments = useMemo(
    () => departmentsResponse?.data || [],
    [departmentsResponse?.data]
  );

  // Calculate statistics from all courses
  const stats = useMemo(() => {
    return {
      total: allCourses.length,
      active: allCourses.filter((c) => c.status === CourseStatus.ACTIVE).length,
      undergraduate: allCourses.filter(
        (c) => c.level === CourseLevel.UNDERGRADUATE
      ).length,
      graduate: allCourses.filter((c) => c.level === CourseLevel.GRADUATE)
        .length,
      doctoral: allCourses.filter((c) => c.level === CourseLevel.DOCTORAL)
        .length,
    };
  }, [allCourses]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(courses.map((c) => c.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId: number, checked: boolean) => {
    if (checked) {
      setSelectedCourses((prev) => [...prev, courseId]);
    } else {
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedCourses([]); // Clear selections when changing pages
  };

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewProfile = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseProfile(true);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading courses: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:2xl font-bold text-gray-900 sm:text-left">
            Course Management
          </h2>
          <p className="text-gray-600 sm:text-left">
            Manage courses and academic programs
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button size="sm" className="whitespace-nowrap w-fit">
            <Plus className="h-4 w-4 mr-0 sm:mr-2" />
            <p className="hidden sm:flex text-sm">Add Course</p>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Active</p>
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
                <p className="text-sm text-gray-600">Undergraduate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.undergraduate}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Graduate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.graduate}
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
                <p className="text-sm text-gray-600">Doctoral</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {stats.doctoral}
                </p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
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
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                <SelectItem value={CourseLevel.UNDERGRADUATE}>
                  Undergraduate
                </SelectItem>
                <SelectItem value={CourseLevel.GRADUATE}>Graduate</SelectItem>
                <SelectItem value={CourseLevel.DOCTORAL}>Doctoral</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={CourseStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={CourseStatus.INACTIVE}>Inactive</SelectItem>
                <SelectItem value={CourseStatus.ARCHIVED}>Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Courses ({courses.length})
              {metadata && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Page {metadata.page} of {metadata.totalPages} (
                  {metadata.total} total)
                </span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={
                  selectedCourses.length === courses.length &&
                  courses.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading courses...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50"
                  >
                    {/* Mobile: Top row with icon, name, and checkbox */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      {/* Desktop: Checkbox on left */}
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) =>
                          handleSelectCourse(course.id, checked as boolean)
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
                          <p className="text-base font-medium text-gray-900 truncate">
                            {course.courseName}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={statusColors[course.status]}>
                            {course.status}
                          </Badge>
                          <Badge className={levelColors[course.level]}>
                            {course.level}
                          </Badge>
                        </div>
                      </div>

                      {/* Mobile: Checkbox in top right */}
                      <Checkbox
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) =>
                          handleSelectCourse(course.id, checked as boolean)
                        }
                        className="sm:hidden w-5 h-5 flex-shrink-0"
                      />
                    </div>

                    {/* Desktop: Main content area */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      {/* Desktop: Name and badges */}
                      <div className="hidden sm:flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.courseName}
                        </p>
                        <Badge className={statusColors[course.status]}>
                          {course.status}
                        </Badge>
                        <Badge className={levelColors[course.level]}>
                          {course.level}
                        </Badge>
                      </div>

                      {/* Course details */}
                      <div className="flex flex-col space-y-2 sm:space-y-1 mt-3 sm:mt-0">
                        <p className="text-sm text-gray-500 truncate text-center sm:text-left">
                          {course.courseCode} • {course.department} •{" "}
                          {course.credits} credits
                        </p>
                        <p className="text-xs text-center sm:text-left text-gray-400 truncate">
                          Min: {course.minimumEnrollment} • Max:{" "}
                          {course.maximumEnrollment}
                        </p>

                        {/* Mobile: Additional info */}
                        <div className="sm:hidden pt-2 border-t border-gray-100">
                          <p className="text-sm text-gray-700 truncate mb-2">
                            {course.description}
                          </p>
                          {course.prerequisites && (
                            <p className="text-xs text-gray-500">
                              Prerequisites: {course.prerequisites}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Right side info */}
                    <div className="hidden sm:block text-right flex-shrink-0">
                      <p className="text-sm text-gray-900 mb-1 truncate max-w-40">
                        {course.description}
                      </p>
                      {course.prerequisites && (
                        <p className="text-xs text-gray-500 truncate max-w-40">
                          Prerequisites: {course.prerequisites}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProfile(course)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {metadata && metadata.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, metadata.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (metadata.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= metadata.totalPages - 2) {
                            pageNum = metadata.totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8"
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(
                          Math.min(metadata.totalPages, currentPage + 1)
                        )
                      }
                      disabled={currentPage === metadata.totalPages}
                    >
                      Next
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, metadata.total)} of{" "}
                    {metadata.total} results
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Course Profile Dialog - You'll need to create this */}
      {selectedCourse && (
        <CourseProfileDialog
          open={showCourseProfile}
          onOpenChange={setShowCourseProfile}
          course={selectedCourse}
        />
      )}
    </div>
  );
}
