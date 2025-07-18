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
import { StudentProfileDialog } from "./student-profile-dialog";
import {
  Student,
  StudentStatus,
  useStudents,
} from "@/contexts/student-context";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { MassEditDialog } from "./mass-edit-dialog";
import { AddStudentDialog } from "./add-student-dialog";
import { AppContext } from "@/contexts/app.context";

export default function StudentManagement() {
  const statusColors: Record<StudentStatus, string> = {
    active: "bg-green-100 text-green-800",
    graduated: "bg-blue-100 text-blue-800",
    "on-leave": "bg-yellow-100 text-yellow-800",
    "dropped-out": "bg-red-100 text-red-800",
    "currently-working": "bg-purple-100 text-purple-800",
  };

  const statusIcons: Record<StudentStatus, any> = {
    active: Users,
    graduated: GraduationCap,
    "on-leave": UserX,
    "dropped-out": UserX,
    "currently-working": Briefcase,
  };
  const {
    students,
    selectedStudents,
    setSelectedStudents,
    deleteStudent,
    deleteMultipleStudents,
  } = useStudents();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showMassEdit, setShowMassEdit] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showStudentProfile, setShowStudentProfile] = useState(false);

  // Get unique departments
  const departments = Array.from(new Set(students.map((s) => s.department)));

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "all" || student.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Statistics
  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    graduated: students.filter((s) => s.status === "graduated").length,
    working: students.filter((s) => s.status === "currently-working").length,
    onLeave: students.filter((s) => s.status === "on-leave").length,
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedStudents.length > 0) {
      deleteMultipleStudents(selectedStudents);
    }
  };
  const { profile } = useContext(AppContext);
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:2xl font-bold text-gray-900">
            Student Management
          </h2>
          <p className="text-gray-600">Manage student</p>
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
                disabled={profile?.role !== "admin"}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
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
                <p className="text-sm text-gray-600">Working</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.working}
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
                <p className="text-sm text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.onLeave}
                </p>
              </div>
              <UserX className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
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
                <SelectItem value="graduated">Graduated</SelectItem>
                <SelectItem value="currently-working">
                  Currently Working
                </SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="dropped-out">Dropped Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
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
                  {/* Mobile Layout */}
                  <div className="flex space-x-3 w-full sm:w-auto sm:items-center">
                    {/* Mobile: Avatar and Content Block */}
                    <div className="flex space-x-3 flex-1 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium">
                          {student.firstName[0]}
                          {student.lastName[0]}
                        </span>
                      </div>

                      {/* Mobile: Name and Status Block */}
                      <div className="flex-1 flex flex-col gap-2 min-w-0 sm:hidden max-w-0">
                        <p className="text-base font-medium text-gray-900 line-clamp-1 min-w-[100px]">
                          {student.firstName} {student.lastName}
                        </p>

                        <Badge
                          className={`${statusColors[student.status]} w-fit`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          <p className="line-clamp-1 min-w-[40px] text-xs">
                            {student.status.replace("-", " ")}
                          </p>
                        </Badge>
                      </div>
                    </div>

                    {/* Mobile: Checkbox in top right */}
                    <div className="flex-shrink-0 sm:hidden">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) =>
                          handleSelectStudent(student.id, checked as boolean)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5"
                      />
                    </div>

                    {/* Desktop: Checkbox on left */}
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) =>
                        handleSelectStudent(student.id, checked as boolean)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="hidden sm:block"
                    />
                  </div>

                  {/* Desktop: Main content area */}
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    {/* Desktop: Name and status */}
                    <div className="hidden sm:flex items-center space-x-2 mb-1">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.firstName} {student.lastName}
                        </p>
                      </div>

                      <Badge className={statusColors[student.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {student.status.replace("-", " ")}
                      </Badge>
                    </div>

                    {/* Student details - responsive layout */}
                    <div className="flex flex-col space-y-1 sm:space-y-0 mt-3 sm:mt-0">
                      <p className="text-sm text-gray-500 truncate text-center sm:text-left">
                        {student.studentId} • {student.department}
                      </p>
                      <p className="text-sm text-gray-500 text-center sm:text-left">
                        Year {student.year}
                      </p>
                      <div className="flex items-center justify-between sm:hidden mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          GPA: {student.gpa}
                        </p>
                        <p className="text-xs text-gray-500 truncate ml-2">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: Right side info */}
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-sm text-gray-900 mb-1">
                      GPA: {student.gpa}
                    </p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      {selectedStudent && (
        <StudentProfileDialog
          open={showStudentProfile}
          onOpenChange={setShowStudentProfile}
          student={selectedStudent}
        />
      )}
      {/* Dialogs */}
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
