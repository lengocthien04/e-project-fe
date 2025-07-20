import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UserPlus, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateStudentDto,
  StudentStatus,
  YearLevel,
} from "@/types/student.type";
import studentApi from "@/apis/student.api";
import { useToast } from "@/hooks/use-toast";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStudentDialog({
  open,
  onOpenChange,
}: AddStudentDialogProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateStudentDto>({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    enrollmentDate: new Date().toISOString().split("T")[0],
    currentYearLevel: YearLevel.FRESHMAN,
    major: "",
    minor: "",
    status: StudentStatus.ACTIVE,
    profilePicture: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create student mutation
  const createStudentMutation = useMutation({
    mutationFn: studentApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student created successfully",
      });
      handleClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create student",
        variant: "destructive",
      });
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    }
    if (!formData.major.trim()) {
      newErrors.major = "Major is required";
    }
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.enrollmentDate) {
      newErrors.enrollmentDate = "Enrollment date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    createStudentMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
      currentYearLevel: YearLevel.FRESHMAN,
      major: "",
      minor: "",
      status: StudentStatus.ACTIVE,
      profilePicture: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof CreateStudentDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Student
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter first name"
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter last name"
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) =>
                    handleInputChange("studentId", e.target.value)
                  }
                  placeholder="Enter student ID"
                  className={errors.studentId ? "border-red-500" : ""}
                />
                {errors.studentId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.studentId}
                  </p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500 mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="major">Major *</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="Enter major"
                  className={errors.major ? "border-red-500" : ""}
                />
                {errors.major && (
                  <p className="text-sm text-red-500 mt-1">{errors.major}</p>
                )}
              </div>
              <div>
                <Label htmlFor="minor">Minor</Label>
                <Input
                  id="minor"
                  value={formData.minor || ""}
                  onChange={(e) => handleInputChange("minor", e.target.value)}
                  placeholder="Enter minor (optional)"
                />
              </div>
              <div>
                <Label htmlFor="yearLevel">Year Level</Label>
                <Select
                  value={formData.currentYearLevel}
                  onValueChange={(value: YearLevel) =>
                    handleInputChange("currentYearLevel", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={YearLevel.FRESHMAN}>Freshman</SelectItem>
                    <SelectItem value={YearLevel.SOPHOMORE}>
                      Sophomore
                    </SelectItem>
                    <SelectItem value={YearLevel.JUNIOR}>Junior</SelectItem>
                    <SelectItem value={YearLevel.SENIOR}>Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: StudentStatus) =>
                    handleInputChange("status", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={StudentStatus.ACTIVE}>Active</SelectItem>

                    <SelectItem value={StudentStatus.SUSPENDED}>
                      Suspended
                    </SelectItem>
                    <SelectItem value={StudentStatus.GRADUATED}>
                      Graduated
                    </SelectItem>
                    <SelectItem value={StudentStatus.WITHDRAWN}>
                      Withdrawn
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                <Input
                  id="enrollmentDate"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) =>
                    handleInputChange("enrollmentDate", e.target.value)
                  }
                  className={errors.enrollmentDate ? "border-red-500" : ""}
                />
                {errors.enrollmentDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.enrollmentDate}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Profile Picture */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div>
              <Label htmlFor="profilePicture">Profile Picture URL</Label>
              <Input
                id="profilePicture"
                value={formData.profilePicture || ""}
                onChange={(e) =>
                  handleInputChange("profilePicture", e.target.value)
                }
                placeholder="Enter profile picture URL (optional)"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createStudentMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={createStudentMutation.isPending}
          >
            {createStudentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Student"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
