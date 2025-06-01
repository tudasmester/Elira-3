import { useParams, useLocation } from "wouter";
import { CourseForm } from "@/components/admin/CourseForm";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminCourseEditPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const courseId = id ? parseInt(id) : undefined;

  const handleSuccess = () => {
    setLocation("/admin/courses");
  };

  const handleCancel = () => {
    setLocation("/admin/courses");
  };

  if (!courseId) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Invalid Course ID</h1>
            <p className="text-gray-600 mt-2">The course ID provided is not valid.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CourseForm 
        courseId={courseId}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
}