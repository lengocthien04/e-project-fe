/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  Loader2,
} from "lucide-react";
import {
  Student,
  StudentProfile,
  StudentStatus,
  UpdateStudentDto,
  YearLevel,
} from "@/types/student.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import studentApi from "@/apis/student.api";
import { cn } from "@/lib/utils";

interface StudentProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}

export function StudentProfileDialog({
  open,
  onOpenChange,
  student,
}: StudentProfileDialogProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<StudentProfile | null>(
    null
  );

  const { data: profileResponse, isLoading: profileLoading } = useQuery({
    queryKey: ["student", "profile", student.id],
    queryFn: () => studentApi.getStudentProfile(student.id),
    enabled: open,
  });

  // Fetch study records
  const { data: studyRecordsResponse, isLoading: studyRecordsLoading } =
    useQuery({
      queryKey: ["student", "study-records", student.id],
      queryFn: () => studentApi.getStudentStudyRecords(student.id),
      enabled: open,
    });

  // Update student mutation
  const updateStudentMutation = useMutation({
    mutationFn: (data: { id: number; updates: UpdateStudentDto }) =>
      studentApi.updateStudent(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({
        queryKey: ["student", "profile", student.id],
      });
      setIsEditing(false);
    },
  });

  const profileData = profileResponse?.data as StudentProfile;
  const studyRecords = studyRecordsResponse?.data || [];

  useEffect(() => {
    if (profileData) {
      const { studyRecords, ...data } = profileData;
      setEditedStudent(data);
    }
  }, [profileData]);

  const handleSave = () => {
    if (!editedStudent) return;

    const {
      cumulativeGPA,
      createdAt,
      updatedAt,
      id,
      totalCreditsEarned,
      ...data
    } = editedStudent;

    updateStudentMutation.mutate({
      id: student.id,
      updates: data,
    });
  };

  const handleCancel = () => {
    if (profileData) {
      const { studyRecords, ...data } = profileData;
      setEditedStudent(data);
    }
    setIsEditing(false);
  };

  const statusColors: Record<StudentStatus, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    GRADUATED: "bg-blue-100 text-blue-800",
    SUSPENDED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-yellow-100 text-yellow-800",
  };

  // Show loading if profile is still loading
  if (profileLoading || !profileData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </DialogTitle>
                <p className="text-gray-600">{profileData.studentId}</p>
              </div>
              <Badge className={statusColors[profileData.status]}>
                {profileData.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={updateStudentMutation.isPending}
                  >
                    {updateStudentMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-6 items-center">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="study-records"
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Study Records
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedStudent?.firstName || ""}
                        onChange={(e) =>
                          setEditedStudent((prev) => ({
                            ...prev!,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedStudent?.lastName || ""}
                        onChange={(e) =>
                          setEditedStudent((prev) => ({
                            ...prev!,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedStudent?.email || ""}
                        onChange={(e) =>
                          setEditedStudent((prev) => ({
                            ...prev!,
                            email: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {profileData.email}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedStudent?.phone || ""}
                        onChange={(e) =>
                          setEditedStudent((prev) => ({
                            ...prev!,
                            phone: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {profileData.phone || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          editedStudent?.dateOfBirth
                            ?.toString()
                            .split("T")[0] || ""
                        }
                        onChange={(e) =>
                          setEditedStudent((prev) => ({
                            ...prev!,
                            dateOfBirth: new Date(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {profileData.dateOfBirth
                            ? new Date(
                                profileData.dateOfBirth
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    {isEditing ? (
                      <Input
                        id="studentId"
                        value={editedStudent?.studentId || ""}
                        onChange={(e) =>
                          setEditedStudent((prev) => ({
                            ...prev!,
                            studentId: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.studentId}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editedStudent?.address || ""}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev!,
                          address: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-900">
                        {profileData.address || "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Academic Information</h3>

                <div>
                  <Label htmlFor="major">Major</Label>
                  {isEditing ? (
                    <Input
                      id="major"
                      value={editedStudent?.major || ""}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev!,
                          major: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.major || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="minor">Minor</Label>
                  {isEditing ? (
                    <Input
                      id="minor"
                      value={editedStudent?.minor || ""}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev!,
                          minor: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.minor || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="yearLevel">Year Level</Label>
                  {isEditing ? (
                    <Select
                      value={editedStudent?.currentYearLevel}
                      onValueChange={(value: YearLevel) =>
                        setEditedStudent((prev) => ({
                          ...prev!,
                          currentYearLevel: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={YearLevel.FRESHMAN}>
                          Freshman
                        </SelectItem>
                        <SelectItem value={YearLevel.SOPHOMORE}>
                          Sophomore
                        </SelectItem>
                        <SelectItem value={YearLevel.JUNIOR}>Junior</SelectItem>
                        <SelectItem value={YearLevel.SENIOR}>Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.currentYearLevel || "N/A"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="gpa">Cumulative GPA</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData.cumulativeGPA || "N/A"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="credits">Total Credits Earned</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData.totalCreditsEarned || 0} credits
                  </p>
                </div>
                <div className="w-fit flex felx-row gap-2 items-center justify-start">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedStudent?.status}
                      onValueChange={(value: StudentStatus) =>
                        setEditedStudent((prev) => ({
                          ...prev!,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={StudentStatus.ACTIVE}>
                          Active
                        </SelectItem>
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
                  ) : (
                    <Badge className={statusColors[profileData.status]}>
                      {profileData.status.replace("_", " ")}
                    </Badge>
                  )}
                </div>
                <div>
                  <Label>Enrollment Date</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData.enrollmentDate
                      ? new Date(
                          profileData.enrollmentDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Study Records Tab */}
          <TabsContent value="study-records" className="space-y-6 mt-6">
            {studyRecordsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading study records...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Academic Records</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {studyRecords.length} record(s) found
                  </div>
                </div>

                {studyRecords.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No study records found</p>
                        <p className="text-sm">
                          Study records will appear here once the student
                          enrolls in courses.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {studyRecords.map((record, index) => (
                      <Card key={record.id || index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">
                              {record.semester} {record.academicYear}
                            </span>
                            <Badge variant="outline">
                              {record.courses?.length || 0} courses
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Total Credits
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.totalCredits || 0}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Semester GPA
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.gpa?.toFixed(2) || "N/A"}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Status
                              </Label>
                              <Badge
                                className={
                                  record.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "ENROLLED"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {record.status || "Unknown"}
                              </Badge>
                            </div>
                          </div>

                          {record.courses && record.courses.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500 mb-3 block">
                                Courses
                              </Label>
                              <div className="space-y-2">
                                {record.courses.map((course, courseIndex) => (
                                  <div
                                    key={course.id || courseIndex}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium">
                                        {course.courseCode} -{" "}
                                        {course.courseName}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {course.credits} credits • Instructor:{" "}
                                        {course.instructor}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      {course.grade && (
                                        <p className="font-semibold text-lg">
                                          {course.grade}
                                        </p>
                                      )}
                                      {course.gradePoints && (
                                        <p className="text-sm text-gray-500">
                                          {course.gradePoints.toFixed(1)} pts
                                        </p>
                                      )}
                                      <Badge
                                        className={cn(
                                          course.status === "COMPLETED"
                                            ? "bg-green-100 text-green-800"
                                            : course.status === "ENROLLED"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-red-100 text-red-800",
                                          "w-4 h-4"
                                        )}
                                      >
                                        {course.status}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
