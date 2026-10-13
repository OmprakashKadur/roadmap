import { Course } from '../types/course.types';
import { htmlCourse } from './courses/htmlCourse';
import { cssCourse } from './courses/cssCourse';
import { javascriptCourse } from './courses/javascriptCourse';
import { reactCourse } from './courses/reactCourse';
import { nextjsCourse } from './courses/nextjsCourse';
import { nodejsCourse } from './courses/nodejsCourse';
import { postgresqlCourse } from './courses/postgresqlCourse';
import { etlCourse } from './courses/etlCourse';

export const COURSES: Course[] = [
  htmlCourse,
  cssCourse,
  javascriptCourse,
  reactCourse,
  nextjsCourse,
  nodejsCourse,
  postgresqlCourse,
  etlCourse,
];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function getLessonBySlugs(courseSlug: string, lessonSlug: string) {
  const course = getCourseBySlug(courseSlug);
  if (!course) return null;

  for (const courseModule of course.modules) {
    const lesson = courseModule.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) {
      return { course, module: courseModule, lesson };
    }
  }

  return null;
}

export {
  htmlCourse,
  cssCourse,
  javascriptCourse,
  reactCourse,
  nextjsCourse,
  nodejsCourse,
  postgresqlCourse,
  etlCourse,
};
