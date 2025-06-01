import { useLocation } from "wouter";
import { CourseForm } from "@/components/admin/CourseForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminCourseCreatePage() {
  const [, setLocation] = useLocation();

  const handleSuccess = () => {
    setLocation("/admin/courses");
  };

  const handleCancel = () => {
    setLocation("/admin/courses");
  };

  return (
    <AdminLayout>
      <CourseForm 
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
}