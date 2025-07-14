"use client";

import { useState } from "react";
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

import {
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
} from "lucide-react";
import {
  Student,
  StudentStatus,
  useStudents,
} from "@/contexts/student-context";

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
  const { updateStudent } = useStudents();
  const [isEditing, setIsEditing] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>(student);

  const handleSave = () => {
    updateStudent(student.id, editedStudent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStudent(student);
    setIsEditing(false);
  };

  const statusColors: Record<StudentStatus, string> = {
    active: "bg-green-100 text-green-800",
    graduated: "bg-blue-100 text-blue-800",
    "on-leave": "bg-yellow-100 text-yellow-800",
    "dropped-out": "bg-red-100 text-red-800",
    "currently-working": "bg-purple-100 text-purple-800",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {student.firstName} {student.lastName}
                </DialogTitle>
                <p className="text-gray-600">{student.studentId}</p>
              </div>
              <Badge className={statusColors[student.status]}>
                {student.status.replace("-", " ")}
              </Badge>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
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

        <div className="space-y-6 mt-6">
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
                      value={editedStudent.firstName}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {student.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      value={editedStudent.lastName}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {student.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedStudent.email}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">{student.email}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedStudent.phone}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">{student.phone}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={editedStudent.dateOfBirth}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          dateOfBirth: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <p className="text-sm text-gray-900">
                        {new Date(student.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  {isEditing ? (
                    <Input
                      id="studentId"
                      value={editedStudent.studentId}
                      onChange={(e) =>
                        setEditedStudent((prev) => ({
                          ...prev,
                          studentId: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {student.studentId}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                {isEditing ? (
                  <Textarea
                    id="address"
                    value={editedStudent.address}
                    onChange={(e) =>
                      setEditedStudent((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <div className="flex items-start mt-1">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <p className="text-sm text-gray-900">{student.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Academic Information</h3>

              <div>
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Select
                    value={editedStudent.department}
                    onValueChange={(value) =>
                      setEditedStudent((prev) => ({
                        ...prev,
                        department: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {student.department}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                {isEditing ? (
                  <Select
                    value={editedStudent.year.toString()}
                    onValueChange={(value) =>
                      setEditedStudent((prev) => ({
                        ...prev,
                        year: Number.parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {student.year} Year
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="gpa">GPA</Label>
                {isEditing ? (
                  <Input
                    id="gpa"
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={editedStudent.gpa}
                    onChange={(e) =>
                      setEditedStudent((prev) => ({
                        ...prev,
                        gpa: Number.parseFloat(e.target.value),
                      }))
                    }
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{student.gpa}</p>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                {isEditing ? (
                  <Select
                    value={editedStudent.status}
                    onValueChange={(value: StudentStatus) =>
                      setEditedStudent((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="currently-working">
                        Currently Working
                      </SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                      <SelectItem value="dropped-out">Dropped Out</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={statusColors[student.status]}>
                    {student.status.replace("-", " ")}
                  </Badge>
                )}
              </div>
              <div>
                <Label>Enrollment Date</Label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(student.enrollmentDate).toLocaleDateString()}
                </p>
              </div>
              {student.graduationDate && (
                <div>
                  <Label>Graduation Date</Label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(student.graduationDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Contact Name</Label>
                {isEditing ? (
                  <Input
                    id="emergencyContact"
                    value={editedStudent.emergencyContact}
                    onChange={(e) =>
                      setEditedStudent((prev) => ({
                        ...prev,
                        emergencyContact: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {student.emergencyContact}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                {isEditing ? (
                  <Input
                    id="emergencyPhone"
                    value={editedStudent.emergencyPhone}
                    onChange={(e) =>
                      setEditedStudent((prev) => ({
                        ...prev,
                        emergencyPhone: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-sm text-gray-900">
                      {student.emergencyPhone}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
