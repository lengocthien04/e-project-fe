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
import { Checkbox } from "@/components/ui/checkbox";
import { useStudents, type StudentStatus } from "@/contexts/student-context";
import { Users } from "lucide-react";

interface MassEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudentIds: string[];
}

export function MassEditDialog({
  open,
  onOpenChange,
  selectedStudentIds,
}: MassEditDialogProps) {
  const { updateMultipleStudents, students } = useStudents();

  const [updates, setUpdates] = useState({
    department: "",
    status: "" as StudentStatus | "",
    year: "",
    gpa: "",
  });

  const [fieldsToUpdate, setFieldsToUpdate] = useState({
    department: false,
    status: false,
    year: false,
    gpa: false,
  });

  const selectedStudents = students.filter((s) =>
    selectedStudentIds.includes(s.id)
  );

  const handleSave = () => {
    const updateData: any = {};

    if (fieldsToUpdate.department && updates.department) {
      updateData.department = updates.department;
    }
    if (fieldsToUpdate.status && updates.status) {
      updateData.status = updates.status;
    }
    if (fieldsToUpdate.year && updates.year) {
      updateData.year = Number.parseInt(updates.year);
    }
    if (fieldsToUpdate.gpa && updates.gpa) {
      updateData.gpa = Number.parseFloat(updates.gpa);
    }

    if (Object.keys(updateData).length > 0) {
      updateMultipleStudents(selectedStudentIds, updateData);
    }

    // Reset form
    setUpdates({
      department: "",
      status: "" as StudentStatus | "",
      year: "",
      gpa: "",
    });
    setFieldsToUpdate({
      department: false,
      status: false,
      year: false,
      gpa: false,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setUpdates({
      department: "",
      status: "" as StudentStatus | "",
      year: "",
      gpa: "",
    });
    setFieldsToUpdate({
      department: false,
      status: false,
      year: false,
      gpa: false,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Mass Edit Students
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Editing {selectedStudentIds.length} selected students:
            </p>
            <div className="mt-2 max-h-32 overflow-y-auto">
              {selectedStudents.map((student) => (
                <p key={student.id} className="text-sm font-medium">
                  {student.firstName} {student.lastName} ({student.studentId})
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Department */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="update-department"
                checked={fieldsToUpdate.department}
                onCheckedChange={(checked) =>
                  setFieldsToUpdate((prev) => ({
                    ...prev,
                    department: checked as boolean,
                  }))
                }
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={updates.department}
                  onValueChange={(value) =>
                    setUpdates((prev) => ({ ...prev, department: value }))
                  }
                  disabled={!fieldsToUpdate.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
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
              </div>
            </div>

            {/* Status */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="update-status"
                checked={fieldsToUpdate.status}
                onCheckedChange={(checked) =>
                  setFieldsToUpdate((prev) => ({
                    ...prev,
                    status: checked as boolean,
                  }))
                }
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={updates.status}
                  onValueChange={(value: StudentStatus) =>
                    setUpdates((prev) => ({ ...prev, status: value }))
                  }
                  disabled={!fieldsToUpdate.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
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
              </div>
            </div>

            {/* Year */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="update-year"
                checked={fieldsToUpdate.year}
                onCheckedChange={(checked) =>
                  setFieldsToUpdate((prev) => ({
                    ...prev,
                    year: checked as boolean,
                  }))
                }
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select
                  value={updates.year}
                  onValueChange={(value) =>
                    setUpdates((prev) => ({ ...prev, year: value }))
                  }
                  disabled={!fieldsToUpdate.year}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* GPA */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="update-gpa"
                checked={fieldsToUpdate.gpa}
                onCheckedChange={(checked) =>
                  setFieldsToUpdate((prev) => ({
                    ...prev,
                    gpa: checked as boolean,
                  }))
                }
              />
              <div className="flex-1 space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input
                  id="gpa"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  placeholder="Enter GPA"
                  value={updates.gpa}
                  onChange={(e) =>
                    setUpdates((prev) => ({ ...prev, gpa: e.target.value }))
                  }
                  disabled={!fieldsToUpdate.gpa}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Update Students</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
