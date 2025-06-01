import { useLocation } from 'wouter';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CourseCreationWizard } from '@/components/admin/CourseCreationWizard';

export default function AdminCourseCreationPage() {
  const [, setLocation] = useLocation();

  const handleComplete = (courseId: number) => {
    setLocation(`/admin/courses/${courseId}`);
  };

  const handleCancel = () => {
    setLocation('/admin/courses');
  };

  return (
    <AdminLayout>
      <CourseCreationWizard 
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
}