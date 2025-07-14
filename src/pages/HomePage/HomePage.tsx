import { CurriculumProvider } from "@/contexts/curriculum-context";
import { StudentProvider } from "@/contexts/student-context";
import { StudentDashboard } from "@/components/student-dashboard";
import { TeacherProvider } from "@/contexts/teacher-context";

export default function HomePage() {
  return (
    <StudentProvider>
      <TeacherProvider>
        <CurriculumProvider>
          <StudentDashboard />
        </CurriculumProvider>
      </TeacherProvider>
    </StudentProvider>
  );
}
