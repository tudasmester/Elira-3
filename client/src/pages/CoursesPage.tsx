import React from 'react';
import { motion } from 'framer-motion';
import CourseGrid from '@/components/CourseGrid';
import { courses } from '@/data/courses';
import { Badge } from "@/components/ui/badge";
import Layout from '@/components/Layout';

const CoursesPage: React.FC = () => {
  // Categories for filtering
  const categories = [
    'Programozás',
    'Adatelemzés',
    'Üzleti',
    'Pénzügy',
    'Marketing',
    'Informatika',
    'Statisztika',
    'Nyelv'
  ];

  return (
    <Layout>
      <section className="pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 px-4 py-1">
              500+ kurzus
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
              Fedezze fel online kurzusainkat
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Válogasson a magyar egyetemek és vállalatok által kínált minőségi kurzusok közül és fejlessze karrierjét
            </p>
          </motion.div>

          {/* Filter and course grid */}
          <div className="mb-20">
            <CourseGrid
              title="Legnépszerűbb kurzusok"
              subtitle="A hallgatók által legmagasabbra értékelt kurzusok a platformon"
              courses={courses}
              limit={6}
              showViewAll={true}
              categories={categories}
              variant="standard"
            />
          </div>

          {/* Free courses section */}
          <div className="mb-20">
            <CourseGrid
              title="Ingyenes kurzusok"
              subtitle="Kezdje el a tanulást költségek nélkül ezekkel az ingyenes kurzusokkal"
              courses={courses.filter(course => course.isFree)}
              limit={4}
              showViewAll={true}
              variant="featured"
            />
          </div>

          {/* Compact view demo */}
          <div>
            <CourseGrid
              title="Ajánlott kurzusok"
              subtitle="Az Ön érdeklődési köre alapján válogatott kurzusok"
              courses={courses}
              limit={8}
              showViewAll={true}
              variant="compact"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CoursesPage;