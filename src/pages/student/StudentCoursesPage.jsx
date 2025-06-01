import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, PlayCircle, CheckCircle, Search } from 'lucide-react';
import { CourseContext } from '@/contexts/CourseContext';
import { AuthContext } from '@/contexts/AuthContext';

const StudentCoursesPage = () => {
  const { courses } = useContext(CourseContext);
  const { user } = useContext(AuthContext);

  // Placeholder: courses student is enrolled in.
  // In a real app, this would come from user data.
  // For this example, let's assume they are enrolled in the first 3 courses.
  const enrolledCourses = courses.slice(0, 3).map((course, index) => ({
    ...course,
    progress: Math.floor(Math.random() * 70) + 30, // Random progress between 30-100%
    completed: index === 0 // Assume first course is completed for demo
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12 text-foreground"
    >
      <motion.header variants={itemVariants} className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-4">My Learning Path</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          All your enrolled courses, progress, and achievements in one place. Keep up the great work!
        </p>
      </motion.header>

      {enrolledCourses.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-16 bg-secondary border border-border rounded-xl shadow-lg">
          <img-replace class="mx-auto mb-8 h-48 w-48 text-muted-foreground opacity-60" alt="Empty bookshelf illustration" src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18" />
          <h2 className="text-3xl font-semibold text-foreground mb-3">Your Bookshelf is Empty!</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven't enrolled in any courses yet. Don't worry, a world of knowledge awaits!
          </p>
          <Link to="/courses">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-all transform hover:scale-105 shadow-lg group">
              <Search className="h-5 w-5 mr-2" /> Explore Courses Now
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {enrolledCourses.map(course => (
            <motion.div key={course.id} variants={itemVariants} whileHover={{ y: -6, transition: { duration: 0.2 }}}>
              <Card className="bg-secondary border-border h-full flex flex-col overflow-hidden shadow-lg hover:shadow-primary/40 transition-all duration-300 group">
                {course.imageUrl && (
                  <div className="h-48 w-full overflow-hidden relative">
                     <img-replace src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                     {course.completed && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full shadow-md">
                            <CheckCircle className="h-6 w-6"/>
                        </div>
                     )}
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{course.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm pt-1">
                    {course.topics.length} topics &bull; {course.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2.5">
                      <motion.div 
                        className={`h-2.5 rounded-full ${course.completed ? 'bg-green-500' : 'bg-primary'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {course.completed ? "Completed!" : `Last accessed: ${new Date().toLocaleDateString()}`}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/20">
                  <Button className={`w-full ${course.completed ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-accent'} text-primary-foreground group`}>
                    {course.completed ? <CheckCircle className="h-5 w-5 mr-2" /> : <PlayCircle className="h-5 w-5 mr-2" />}
                    {course.completed ? 'View Certificate (Soon!)' : 'Continue Learning'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentCoursesPage;