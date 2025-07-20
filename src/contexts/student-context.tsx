import { Student } from "@/types/student.type";
import { createContext, useContext, useState, type ReactNode } from "react";

type StudentContextType = {
  students: Student[];
  selectedStudents: number[];
  setSelectedStudents: (ids: number[]) => void;
  updateStudent: (id: number, updates: Partial<Student>) => void;
  updateMultipleStudents: (ids: number[], updates: Partial<Student>) => void;
  deleteStudent: (id: number) => void;
  deleteMultipleStudents: (ids: number[]) => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const updateStudent = (id: number, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      )
    );
  };

  const updateMultipleStudents = (ids: number[], updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((student) =>
        ids.includes(student.id) ? { ...student, ...updates } : student
      )
    );
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
    setSelectedStudents((prev) =>
      prev.filter((selectedId) => selectedId !== id)
    );
  };

  const deleteMultipleStudents = (ids: number[]) => {
    setStudents((prev) => prev.filter((student) => !ids.includes(student.id)));
    setSelectedStudents([]);
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        selectedStudents,
        setSelectedStudents,
        updateStudent,
        updateMultipleStudents,
        deleteStudent,
        deleteMultipleStudents,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudents() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
}
