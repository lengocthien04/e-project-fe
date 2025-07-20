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
  BookOpen,
  GraduationCap,
  Loader2,
  Users,
  Clock,
  MapPin,
  Building,
  Award,
} from "lucide-react";
import {
  Course,
  CourseProfile,
  CourseStatus,
  CourseLevel,
  UpdateCourseDto,
  Class,
} from "@/types/course.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import courseApi from "@/apis/coruse.api";

interface CourseProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
}

export function CourseProfileDialog({
  open,
  onOpenChange,
  course,
}: CourseProfileDialogProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState<CourseProfile | null>(null);

  const { data: profileResponse, isLoading: profileLoading } = useQuery({
    queryKey: ["course", "profile", course.id],
    queryFn: () => courseApi.getCourseProfile(course.id),
    enabled: open,
  });

  // Fetch course classes
  const { data: classesResponse, isLoading: classesLoading } = useQuery({
    queryKey: ["course", "classes", course.id],
    queryFn: () => courseApi.getCourseClasses(course.id),
    enabled: open,
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: (data: { id: number; updates: UpdateCourseDto }) =>
      courseApi.updateCourse(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({
        queryKey: ["course", "profile", course.id],
      });
      setIsEditing(false);
    },
  });

  const profileData = profileResponse?.data as CourseProfile;
  const classes = classesResponse?.data || [];

  useEffect(() => {
    if (profileData) {
      const { classes, ...data } = profileData;
      setEditedCourse(data);
    }
  }, [profileData]);

  const handleSave = () => {
    if (!editedCourse) return;

    const { createdAt, updatedAt, id, classes, ...data } = editedCourse;

    updateCourseMutation.mutate({
      id: course.id,
      updates: data,
    });
  };

  const handleCancel = () => {
    if (profileData) {
      const { classes, ...data } = profileData;
      setEditedCourse(data);
    }
    setIsEditing(false);
  };

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

  // Show loading if profile is still loading
  if (profileLoading || !profileData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading course profile...</span>
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
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {profileData.courseName}
                </DialogTitle>
                <p className="text-gray-600">{profileData.courseCode}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={statusColors[profileData.status]}>
                    {profileData.status}
                  </Badge>
                  <Badge className={levelColors[profileData.level]}>
                    {profileData.level}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={updateCourseMutation.isPending}
                  >
                    {updateCourseMutation.isPending ? (
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
                  Edit Course
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Course Details
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Classes
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Information */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center mb-4">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Course Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="courseCode">Course Code</Label>
                    {isEditing ? (
                      <Input
                        id="courseCode"
                        value={editedCourse?.courseCode || ""}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev!,
                            courseCode: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.courseCode}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="courseName">Course Name</Label>
                    {isEditing ? (
                      <Input
                        id="courseName"
                        value={editedCourse?.courseName || ""}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev!,
                            courseName: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.courseName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={editedCourse?.department || ""}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
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
                    <Label htmlFor="credits">Credits</Label>
                    {isEditing ? (
                      <Input
                        id="credits"
                        type="number"
                        min="1"
                        max="10"
                        value={editedCourse?.credits || ""}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev!,
                            credits: parseInt(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Award className="h-4 w-4 mr-2 text-gray-400" />
                        <p className="text-sm text-gray-900">
                          {profileData.credits} credits
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="minimumEnrollment">
                      Minimum Enrollment
                    </Label>
                    {isEditing ? (
                      <Input
                        id="minimumEnrollment"
                        type="number"
                        min="1"
                        value={editedCourse?.minimumEnrollment || ""}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev!,
                            minimumEnrollment: parseInt(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.minimumEnrollment} students
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="maximumEnrollment">
                      Maximum Enrollment
                    </Label>
                    {isEditing ? (
                      <Input
                        id="maximumEnrollment"
                        type="number"
                        min="1"
                        value={editedCourse?.maximumEnrollment || ""}
                        onChange={(e) =>
                          setEditedCourse((prev) => ({
                            ...prev!,
                            maximumEnrollment: parseInt(e.target.value),
                          }))
                        }
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profileData.maximumEnrollment} students
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      rows={3}
                      value={editedCourse?.description || ""}
                      onChange={(e) =>
                        setEditedCourse((prev) => ({
                          ...prev!,
                          description: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  {isEditing ? (
                    <Textarea
                      id="prerequisites"
                      rows={2}
                      value={editedCourse?.prerequisites || ""}
                      onChange={(e) =>
                        setEditedCourse((prev) => ({
                          ...prev!,
                          prerequisites: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.prerequisites || "None"}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="learningObjectives">
                    Learning Objectives
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="learningObjectives"
                      rows={4}
                      value={editedCourse?.learningObjectives || ""}
                      onChange={(e) =>
                        setEditedCourse((prev) => ({
                          ...prev!,
                          learningObjectives: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.learningObjectives || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Settings</h3>

                <div>
                  <Label htmlFor="level">Course Level</Label>
                  {isEditing ? (
                    <Select
                      value={editedCourse?.level}
                      onValueChange={(value: CourseLevel) =>
                        setEditedCourse((prev) => ({
                          ...prev!,
                          level: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CourseLevel.UNDERGRADUATE}>
                          Undergraduate
                        </SelectItem>
                        <SelectItem value={CourseLevel.GRADUATE}>
                          Graduate
                        </SelectItem>
                        <SelectItem value={CourseLevel.DOCTORAL}>
                          Doctoral
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={levelColors[profileData.level]}>
                      {profileData.level}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedCourse?.status}
                      onValueChange={(value: CourseStatus) =>
                        setEditedCourse((prev) => ({
                          ...prev!,
                          status: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CourseStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={CourseStatus.INACTIVE}>
                          Inactive
                        </SelectItem>
                        <SelectItem value={CourseStatus.ARCHIVED}>
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={statusColors[profileData.status]}>
                      {profileData.status}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="textbook">Textbook</Label>
                  {isEditing ? (
                    <Input
                      id="textbook"
                      value={editedCourse?.textbook || ""}
                      onChange={(e) =>
                        setEditedCourse((prev) => ({
                          ...prev!,
                          textbook: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {profileData.textbook || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Created Date</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label>Last Updated</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(profileData.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="space-y-6 mt-6">
            {classesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading classes...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Course Classes</h3>
                  </div>
                  <div className="text-sm text-gray-500">
                    {classes.length} class(es) found
                  </div>
                </div>

                {classes.length === 0 ? (
                  <Card>
                    <CardContent className="py-8">
                      <div className="text-center text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No classes found</p>
                        <p className="text-sm">
                          Classes will appear here once they are scheduled for
                          this course.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {classes.map((classItem, index) => (
                      <Card key={classItem.id || index}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">
                              {classItem.classCode}
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
                                Teacher
                              </Label>
                              <p className="text-lg font-semibold">
                                {classItem.teacher?.firstName}{" "}
                                {classItem.teacher?.lastName}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Enrollment
                              </Label>
                              <p className="text-lg font-semibold">
                                {classItem.currentEnrollment}/
                                {classItem.maxEnrollment}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Academic Year
                              </Label>
                              <p className="text-lg font-semibold">
                                {classItem.semester} {classItem.academicYear}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                Start Date
                              </Label>
                              <p className="text-sm">
                                {new Date(
                                  classItem.startDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-500">
                                End Date
                              </Label>
                              <p className="text-sm">
                                {new Date(
                                  classItem.endDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar for enrollment */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                              <span>Enrollment Progress</span>
                              <span>
                                {Math.round(
                                  (classItem.currentEnrollment /
                                    classItem.maxEnrollment) *
                                    100
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: `${
                                    (classItem.currentEnrollment /
                                      classItem.maxStudents) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
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
