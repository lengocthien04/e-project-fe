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
  Star,
  Award,
  Building,
  DollarSign,
} from "lucide-react";
import {
  Teacher,
  TeacherProfile,
  TeacherStatus,
  UpdateTeacherDto,
  AcademicRank,
  EducationLevel,
} from "@/types/teacher.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import teacherApi from "@/apis/teacher.api";

interface TeacherProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher: Teacher;
}

export function TeacherProfileDialog({
  open,
  onOpenChange,
  teacher,
}: TeacherProfileDialogProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeacher, setEditedTeacher] = useState<TeacherProfile | null>(
    null
  );

  const { data: profileResponse, isLoading: profileLoading } = useQuery({
    queryKey: ["teacher", "profile", teacher.id],
    queryFn: () => teacherApi.getTeacherProfile(teacher.id),
    enabled: open,
  });

  // Fetch teaching records
  const { data: teachingRecordsResponse, isLoading: teachingRecordsLoading } =
    useQuery({
      queryKey: ["teacher", "teaching-records", teacher.id],
      queryFn: () => teacherApi.getTeacherTeachingRecords(teacher.id),
      enabled: open,
    });

  // Fetch current classes
  const { data: currentClassesResponse, isLoading: currentClassesLoading } =
    useQuery({
      queryKey: ["teacher", "current-classes", teacher.id],
      queryFn: () => teacherApi.getTeacherCurrentClasses(teacher.id),
      enabled: open,
    });

  // Update teacher mutation (you'll need to add this to your API)
  const updateTeacherMutation = useMutation({
    mutationFn: (data: { id: number; updates: UpdateTeacherDto }) =>
      // Assuming you'll add this endpoint later
      Promise.resolve({ data: editedTeacher }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({
        queryKey: ["teacher", "profile", teacher.id],
      });
      setIsEditing(false);
    },
  });

  const profileData = profileResponse?.data as TeacherProfile;
  const teachingRecords = teachingRecordsResponse?.data || [];
  const currentClasses = currentClassesResponse?.data || [];

  useEffect(() => {
    if (profileData) {
      setEditedTeacher(profileData);
    }
  }, [profileData]);

  const handleSave = () => {
    if (!editedTeacher) return;

    const {
      id,
      createdAt,
      updatedAt,
      overallRating,
      classes,
      teachingRecords,
      ...data
    } = editedTeacher;

    updateTeacherMutation.mutate({
      id: teacher.id,
      updates: data,
    });
  };

  const handleCancel = () => {
    if (profileData) {
      setEditedTeacher(profileData);
    }
    setIsEditing(false);
  };

  const statusColors: Record<TeacherStatus, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    ON_LEAVE: "bg-yellow-100 text-yellow-800",
    RETIRED: "bg-blue-100 text-blue-800",
    TERMINATED: "bg-red-100 text-red-800",
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
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-medium">
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </span>
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </DialogTitle>
                <p className="text-gray-600">{profileData.employeeId}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={statusColors[profileData.status]}>
                    {profileData.status.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline">
                    {profileData.academicRank.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={updateTeacherMutation.isPending}
                  >
                    {updateTeacherMutation.isPending ? (
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

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Performance
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
                        value={editedTeacher?.firstName || ""}
                        onChange={(e) =>
                          setEditedTeacher((prev) => ({
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
                        value={editedTeacher?.lastName || ""}
                        onChange={(e) =>
                          setEditedTeacher((prev) => ({
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
                        value={editedTeacher?.email || ""}
                        onChange={(e) =>
                          setEditedTeacher((prev) => ({
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
                        value={editedTeacher?.phone || ""}
                        onChange={(e) =>
                          setEditedTeacher((prev) => ({
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
                          editedTeacher?.dateOfBirth
                            ?.toString()
                            .split("T")[0] || ""
                        }
                        onChange={(e) =>
                          setEditedTeacher((prev) => ({
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
                    <Label htmlFor="employeeId">Employee ID</Label>
                    {isEditing ? (
                      <Input
                        id="employeeId"
                        value={editedTeacher?.employeeId || ""}
                        onChange={(e) =>
                          setEditedTeacher((prev) => ({
                            ...prev!,
                            employeeId: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.employeeId}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={editedTeacher?.address || ""}
                      onChange={(e) =>
                        setEditedTeacher((prev) => ({
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
                <div>
                  <Label htmlFor="biography">Biography</Label>
                  {isEditing ? (
                    <Textarea
                      id="biography"
                      rows={4}
                      value={editedTeacher?.biography || ""}
                      onChange={(e) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          biography: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.biography || "No biography available"}
                    </p>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Academic Information</h3>

                <div>
                  <Label htmlFor="department">Department</Label>
                  {isEditing ? (
                    <Input
                      id="department"
                      value={editedTeacher?.department || ""}
                      onChange={(e) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          department: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {profileData.department}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  {isEditing ? (
                    <Input
                      id="specialization"
                      value={editedTeacher?.specialization || ""}
                      onChange={(e) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          specialization: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.specialization}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="academicRank">Academic Rank</Label>
                  {isEditing ? (
                    <Select
                      value={editedTeacher?.academicRank}
                      onValueChange={(value: AcademicRank) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          academicRank: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AcademicRank.INSTRUCTOR}>
                          Instructor
                        </SelectItem>
                        <SelectItem value={AcademicRank.ASSISTANT_PROFESSOR}>
                          Assistant Professor
                        </SelectItem>
                        <SelectItem value={AcademicRank.ASSOCIATE_PROFESSOR}>
                          Associate Professor
                        </SelectItem>
                        <SelectItem value={AcademicRank.FULL_PROFESSOR}>
                          Professor
                        </SelectItem>
                        <SelectItem value={AcademicRank.EMERITUS}>
                          Emeritus Professor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.academicRank?.replace("_", " ")}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="highestEducation">Highest Education</Label>
                  {isEditing ? (
                    <Select
                      value={editedTeacher?.highestEducation}
                      onValueChange={(value: EducationLevel) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          highestEducation: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EducationLevel.MASTERS}>
                          Master's
                        </SelectItem>
                        <SelectItem value={EducationLevel.DOCTORATE}>
                          Doctorate
                        </SelectItem>
                        <SelectItem value={EducationLevel.PHD}>
                          Post Doctorate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center mt-1">
                      <GraduationCap className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {profileData.highestEducation}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      value={editedTeacher?.yearsOfExperience || ""}
                      onChange={(e) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          yearsOfExperience: parseInt(e.target.value),
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.yearsOfExperience} years
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="overallRating">Overall Rating</Label>
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    <p className="text-sm text-gray-900">
                      {profileData.overallRating || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  {isEditing ? (
                    <Input
                      id="salary"
                      type="number"
                      value={editedTeacher?.salary || ""}
                      onChange={(e) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          salary: parseFloat(e.target.value),
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        ${profileData.salary?.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedTeacher?.status}
                      onValueChange={(value: TeacherStatus) =>
                        setEditedTeacher((prev) => ({
                          ...prev!,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TeacherStatus.ACTIVE}>
                          Active
                        </SelectItem>

                        <SelectItem value={TeacherStatus.ON_LEAVE}>
                          On Leave
                        </SelectItem>

                        <SelectItem value={TeacherStatus.RETIRED}>
                          Retired
                        </SelectItem>
                        <SelectItem value={TeacherStatus.TERMINATED}>
                          Terminated
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
                  <Label>Hire Date</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {profileData.hireDate
                      ? new Date(profileData.hireDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6 mt-6">
            {currentClassesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading classes...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Current Classes</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentClasses.length} class(es) found
                  </div>
                </div>

                {currentClasses.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No current classes found</p>
                        <p className="text-sm">
                          Classes will appear here once assigned to the teacher.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {currentClasses.map((classItem, index) => (
                      <Card key={classItem.id || index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">
                              {classItem.classCode} -{" "}
                              {classItem.course?.courseName}
                            </span>
                            <Badge
                              className={
                                classItem.status === "ACTIVE"
                                  ? "bg-green-100 text-green-800"
                                  : classItem.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {classItem.status}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Course Code
                              </Label>
                              <p className="text-lg font-semibold">
                                {classItem.course?.courseCode}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Credits
                              </Label>
                              <p className="text-lg font-semibold">
                                {classItem.course?.credits}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Enrollment
                              </Label>
                              <p className="text-lg font-semibold">
                                {classItem.currentEnrollment}/
                                {classItem.maximumEnrollment}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Semester
                              </Label>
                              <p className="text-sm">
                                {classItem.semester} {classItem.academicYear}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Schedule
                              </Label>
                              <p className="text-sm">{classItem.schedule}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Location
                              </Label>
                              <p className="text-sm">{classItem.location}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Duration
                              </Label>
                              <p className="text-sm">
                                {new Date(
                                  classItem.startDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  classItem.endDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {classItem.course?.description && (
                            <div className="mt-4">
                              <Label className="text-sm font-medium text-gray-500">
                                Course Description
                              </Label>
                              <p className="text-sm text-gray-700 mt-1">
                                {classItem.course.description}
                              </p>
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

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            {teachingRecordsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading performance records...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    <h3 className="text-lg font-medium">
                      Teaching Performance
                    </h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {teachingRecords.length} record(s) found
                  </div>
                </div>

                {teachingRecords.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No performance records found</p>
                        <p className="text-sm">
                          Performance records will appear here after teaching
                          evaluations.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {teachingRecords.map((record, index) => (
                      <Card key={record.id || index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">
                              {record.class?.semester}{" "}
                              {record.class?.academicYear} -{" "}
                              {record.class?.classCode}
                            </span>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span className="font-semibold">
                                {record.overallSatisfactionScore}
                              </span>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Teaching Effectiveness
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.teachingEffectivenessScore}
                                /5.0
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Communication Skills
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.communicationSkillsScore}
                                /5.0
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Course Material Quality
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.courseMaterialQualityScore}
                                /5.0
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Class Average
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.classAverageScore}%
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Pass Rate
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.passRate}%
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Attendance Rate
                              </Label>
                              <p className="text-lg font-semibold">
                                {record.attendanceRate}%
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Students Enrolled
                              </Label>
                              <p className="text-sm">
                                {record.totalStudentsEnrolled}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Students Completed
                              </Label>
                              <p className="text-sm">
                                {record.studentsCompleted}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Students Withdrawn
                              </Label>
                              <p className="text-sm">
                                {record.studentsWithdrawn}
                              </p>
                            </div>
                          </div>

                          {record.studentFeedbackSummary && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium text-gray-500">
                                Student Feedback Summary
                              </Label>
                              <p className="text-sm text-gray-700 mt-1">
                                {record.studentFeedbackSummary}
                              </p>
                            </div>
                          )}

                          {record.positiveComments && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium text-gray-500">
                                Positive Comments
                              </Label>
                              <p className="text-sm text-green-700 mt-1">
                                {record.positiveComments}
                              </p>
                            </div>
                          )}

                          {record.improvementSuggestions && (
                            <div className="mb-4">
                              <Label className="text-sm font-medium text-gray-500">
                                Improvement Suggestions
                              </Label>
                              <p className="text-sm text-orange-700 mt-1">
                                {record.improvementSuggestions}
                              </p>
                            </div>
                          )}

                          {record.administrativeEvaluation && (
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Administrative Evaluation
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  className={
                                    record.administrativeEvaluation ===
                                    "EXCELLENT"
                                      ? "bg-green-100 text-green-800"
                                      : record.administrativeEvaluation ===
                                        "VERY_GOOD"
                                      ? "bg-blue-100 text-blue-800"
                                      : record.administrativeEvaluation ===
                                        "GOOD"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {record.administrativeEvaluation.replace(
                                    "_",
                                    " "
                                  )}
                                </Badge>
                              </div>
                              {record.administratorComments && (
                                <p className="text-sm text-gray-700 mt-2">
                                  {record.administratorComments}
                                </p>
                              )}
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
