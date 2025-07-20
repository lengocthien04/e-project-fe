/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Briefcase,
  Edit,
  GraduationCap,
  Plus,
  Search,
  Trash2,
  Users,
  UserX,
  Loader2,
} from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { StudentProfileDialog } from "./student-profile-dialog";
import { MassEditDialog } from "./mass-edit-dialog";
import { useContext, useState, useMemo } from "react";
import { AppContext } from "@/contexts/app.context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student, StudentStatus } from "@/types/student.type";
import { useDebounce } from "@/hooks/use-debounce";
import studentApi from "@/apis/student.api";
import { AddStudentDialog } from "./add-student-dialog";

export default function StudentManagement() {
  const statusColors: Record<StudentStatus, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    GRADUATED: "bg-blue-100 text-blue-800",
    SUSPENDED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-100 text-gray-800",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusIcons: Record<StudentStatus, any> = {
    ACTIVE: Users,
    GRADUATED: GraduationCap,
    SUSPENDED: UserX,
    WITHDRAWN: UserX,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showMassEdit, setShowMassEdit] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showStudentProfile, setShowStudentProfile] = useState(false);

  const queryClient = useQueryClient();
  const { profile } = useContext(AppContext);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Search parameters
  const searchParams = useMemo(
    () => ({
      page: currentPage,
      limit: pageSize,
      search: debouncedSearchTerm || undefined,
    }),
    [currentPage, pageSize, debouncedSearchTerm]
  );

  // Fetch students with search and pagination
  const {
    data: studentsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students", searchParams],
    queryFn: () => studentApi.getAllStudents(searchParams),
  });

  // Get all students for statistics (without pagination)
  const { data: allStudentsResponse } = useQuery({
    queryKey: ["students", "all"],
    queryFn: () => studentApi.getAllStudents({ limit: 100 }),
  });

  // Delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: studentApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSelectedStudents([]);
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => studentApi.deleteStudent(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSelectedStudents([]);
    },
  });

  const students = useMemo(
    () => studentsResponse?.data || [],
    [studentsResponse?.data]
  );
  const metadata = studentsResponse?.metadata;
  const allStudents = useMemo(
    () => allStudentsResponse?.data || [],
    [allStudentsResponse?.data]
  );

  // Filter students for display (client-side filtering for department/status)
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesDepartment =
        departmentFilter === "all" || student.major === departmentFilter;
      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;
      return matchesDepartment && matchesStatus;
    });
  }, [students, departmentFilter, statusFilter]);

  // Get unique departments from all students
  const departments = useMemo(() => {
    return Array.from(new Set(allStudents.map((s) => s.major))).filter(Boolean);
  }, [allStudents]);

  // Calculate statistics from all students
  const stats = useMemo(() => {
    return {
      total: allStudents.length,
      active: allStudents.filter((s) => s.status === StudentStatus.ACTIVE)
        .length,
      graduated: allStudents.filter((s) => s.status === StudentStatus.GRADUATED)
        .length,
      transferred: allStudents.filter(
        (s) => s.status === StudentStatus.WITHDRAWN
      ).length,
      suspended: allStudents.filter((s) => s.status === StudentStatus.SUSPENDED)
        .length,
    };
  }, [allStudents]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.length > 0) {
      bulkDeleteMutation.mutate(selectedStudents);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedStudents([]); // Clear selections when changing pages
  };

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">
            Error loading students: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:2xl font-bold text-gray-900 sm:text-left">
            Student Management
          </h2>
          <p className="text-gray-600 sm:text-left">Manage students</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={() => setShowAddStudent(true)}
            size="sm"
            className="whitespace-nowrap w-fit"
          >
            <Plus className="h-4 w-4 mr-0 sm:mr-2" />
            <p className="hidden sm:flex text-sm">Add Student</p>
          </Button>
          {selectedStudents.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMassEdit(true)}
                className="whitespace-nowrap"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit ({selectedStudents.length})
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="whitespace-nowrap"
                disabled={
                  profile?.role !== "admin" || bulkDeleteMutation.isPending
                }
              >
                {bulkDeleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
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
                <p className="text-sm text-gray-600">Active</p>
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
                <p className="text-sm text-gray-600">Graduated</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.graduated}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Withdrawn</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.transferred}
                </p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.suspended}
                </p>
              </div>
              <UserX className="h-8 w-8 text-yellow-600" />
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
                  placeholder="Search students..."
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>
                <SelectItem value={StudentStatus.GRADUATED}>
                  Graduated
                </SelectItem>

                <SelectItem value={StudentStatus.SUSPENDED}>
                  Suspended
                </SelectItem>
                <SelectItem value={StudentStatus.WITHDRAWN}>
                  Withdrawn
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Students ({filteredStudents.length})
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
                  selectedStudents.length === filteredStudents.length &&
                  filteredStudents.length > 0
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
              <span className="ml-2">Loading students...</span>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {filteredStudents.map((student) => {
                  const StatusIcon = statusIcons[student.status];
                  return (
                    <div
                      key={student.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowStudentProfile(true);
                      }}
                    >
                      <div className="flex space-x-3 w-full sm:w-auto sm:items-center">
                        <div className="flex space-x-3 flex-1 sm:space-x-4">
                          <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium">
                              {student.firstName[0]}
                              {student.lastName[0]}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col gap-2 min-w-0 sm:hidden max-w-0">
                            <p className="text-base font-medium text-gray-900 line-clamp-1 min-w-[100px]">
                              {student.firstName} {student.lastName}
                            </p>

                            <Badge
                              className={`${
                                statusColors[student.status]
                              } w-fit`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              <p className="line-clamp-1 min-w-[40px] text-xs">
                                {student.status.replace("_", " ")}
                              </p>
                            </Badge>
                          </div>
                        </div>

                        <div className="flex-shrink-0 sm:hidden">
                          <Checkbox
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={(checked) =>
                              handleSelectStudent(
                                student.id,
                                checked as boolean
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="w-5 h-5"
                          />
                        </div>

                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) =>
                            handleSelectStudent(student.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="hidden sm:block"
                        />
                      </div>

                      <div className="flex-1 min-w-0 w-full sm:w-auto">
                        <div className="hidden sm:flex items-center space-x-2 mb-1">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {student.firstName} {student.lastName}
                            </p>
                          </div>

                          <Badge className={statusColors[student.status]}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {student.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="flex flex-col space-y-1 sm:space-y-0 mt-3 sm:mt-0">
                          <p className="text-sm text-gray-500 truncate text-center sm:text-left">
                            {student.studentId} • {student.major}
                          </p>
                          <p className="text-sm text-gray-500 text-center sm:text-left">
                            Year {student.currentYearLevel}
                          </p>
                          <div className="flex items-center justify-between sm:hidden mt-2 pt-2 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                              GPA: {student.cumulativeGPA}
                            </p>
                            <p className="text-xs text-gray-500 truncate ml-2">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:block text-right flex-shrink-0">
                        <p className="text-sm text-gray-900 mb-1">
                          GPA: {student.cumulativeGPA}
                        </p>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Simple Pagination */}
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

      {/* Dialogs */}
      {selectedStudent && (
        <StudentProfileDialog
          open={showStudentProfile}
          onOpenChange={setShowStudentProfile}
          student={selectedStudent}
        />
      )}

      <MassEditDialog
        open={showMassEdit}
        onOpenChange={setShowMassEdit}
        selectedStudentIds={selectedStudents}
      />

      <AddStudentDialog
        open={showAddStudent}
        onOpenChange={setShowAddStudent}
      />
    </>
  );
}
