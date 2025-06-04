import React from 'react';
import { useParams } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExamBuilderProvider } from '@/contexts/ExamBuilderContext';
import { ExamBuilder } from '@/components/exam-builder/ExamBuilder';
import { AdminGuard } from '@/components/AdminGuard';

export default function ExamBuilderPage() {
  const params = useParams();
  const courseId = params.courseId ? parseInt(params.courseId) : undefined;
  const examId = params.examId ? parseInt(params.examId) : undefined;

  return (
    <AdminGuard>
      <ExamBuilderProvider>
        <div className="min-h-screen bg-gray-50">
          <ExamBuilder courseId={courseId} examId={examId} />
        </div>
      </ExamBuilderProvider>
    </AdminGuard>
  );
}