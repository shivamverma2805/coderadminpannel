import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, Award, ArrowRight, Search } from 'lucide-react';
import { CourseContext } from '@/contexts/CourseContext';
import { AuthContext } from '@/contexts/AuthContext';

const StudentDashboardPage = () => {
  const { courses } = useContext(CourseContext);
  const { user } = useContext(AuthContext);

  // Placeholder: courses student is enrolled in.
  // In a real app, this would come from user data.
  const enrolledCourses = courses.slice(0, 2); 
  const recommendedCourses = courses.slice(1, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      className="space-y-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants} className="text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text mb-3">
          Welcome, {user?.name || 'Student'}!
        </h1>
        <p className="text-xl text-muted-foreground">
          Ready to learn something new today? Let's dive in!
        </p>
      </motion.header>

      {/* Hero Section for Students */}
      <motion.section 
        variants={itemVariants}
        className="relative p-8 md:p-12 rounded-xl overflow-hidden bg-gradient-to-tr from-accent/10 via-secondary to-background border border-border shadow-2xl"
      >
        <div className="absolute inset-0 opacity-10">
           <img-replace className="w-full h-full object-cover" alt="Abstract background with learning motifs" src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b" />
        </div>
        <div className="relative z-10 md:flex md:items-center md:justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-primary mb-3">Discover Your Next Passion</h2>
            <p className="text-foreground/80 mb-6 text-lg">
              Explore a universe of knowledge. Find courses that spark your curiosity and help you grow.
            </p>
            <Link to="/courses">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all transform hover:scale-105 shadow-lg group">
                <Search className="h-5 w-5 mr-2" /> Browse All Courses 
              </Button>
            </Link>
          </div>
           <motion.div 
            className="md:w-1/3 flex justify-center"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
          >
             <img-replace className="rounded-lg shadow-xl w-full max-w-xs h-auto object-contain" alt="Stylized open book with glowing pages" src="https://images.unsplash.com/photo-1543269865-cbf427effbad" />
          </motion.div>
        </div>
      </motion.section>

      {/* Enrolled Courses Section */}
      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-bold text-primary mb-6">Continue Learning</h2>
        {enrolledCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {enrolledCourses.map(course => (
              <motion.div key={course.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 }}}>
                <Card className="bg-secondary border-border shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full flex flex-col">
                  {course.imageUrl && (
                    <div className="h-40 w-full overflow-hidden rounded-t-lg">
                       <img-replace src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-foreground">{course.title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm">
                      {/* Placeholder for progress */}
                      75% Complete
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Progress bar placeholder */}
                    <div className="w-full bg-background rounded-full h-2.5 mb-4">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                     <Button className="w-full bg-primary text-primary-foreground hover:bg-accent group">
                        <PlayCircle className="h-5 w-5 mr-2" /> Resume Course
                      </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-secondary border-border p-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            <Link to="/courses">
              <Button variant="link" className="text-primary text-lg mt-2">Find a course to start!</Button>
            </Link>
          </Card>
        )}
         <div className="mt-6 text-right">
            <Link to="/student/my-courses">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    View All My Courses <ArrowRight className="h-4 w-4 ml-2"/>
                </Button>
            </Link>
        </div>
      </motion.section>

      {/* Recommended Courses Section */}
      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-bold text-primary mb-6">Recommended For You</h2>
        {recommendedCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedCourses.map(course => (
              <motion.div key={course.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 }}}>
                <Card className="bg-secondary border-border shadow-lg hover:shadow-primary/30 transition-shadow duration-300 h-full flex flex-col">
                   {course.imageUrl && (
                    <div className="h-40 w-full overflow-hidden rounded-t-lg">
                       <img-replace src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-foreground">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-2 h-12 overflow-hidden text-ellipsis">{course.description}</p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{course.duration}</span>
                        <span>{course.topics.length} Topics</span>
                    </div>
                  </CardContent>
                  <CardContent className="pt-0">
                    <Link to={`/courses`}> {/* Link to general courses page, or specific course view if available */}
                      <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground group">
                        Learn More <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
           <Card className="bg-secondary border-border p-6 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No specific recommendations right now. Explore all courses!</p>
          </Card>
        )}
      </motion.section>

      {/* Achievements Section - Placeholder */}
      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-bold text-primary mb-6">Your Achievements</h2>
        <Card className="bg-secondary border-border shadow-lg p-6 text-center">
          <Award className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <CardTitle className="text-xl text-foreground mb-2">Keep Learning!</CardTitle>
          <p className="text-muted-foreground">Your achievements and certificates will appear here as you complete courses.</p>
           <img-replace class="mx-auto mt-6 rounded-lg shadow-md w-full max-w-sm h-auto object-cover" alt="Collection of colorful achievement badges" src="https://images.unsplash.com/photo-1609087595888-edc9166a0863" />
        </Card>
      </motion.section>
    </motion.div>
  );
};

export default StudentDashboardPage;