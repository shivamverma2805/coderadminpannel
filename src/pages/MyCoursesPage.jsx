import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Eye, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CourseContext } from '@/contexts/CourseContext';
import { AuthContext } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MyCoursesPage = () => {
  const { courses, deleteCourse, fetchCourses, isLoading, error } = useContext(CourseContext);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCourses(user.id); // Fetch courses created by the logged-in tutor
    }
  }, [user, fetchCourses]);

  const handleDeleteCourse = async (courseId) => {
    const success = await deleteCourse(courseId);
    if (success) {
      toast({
        title: "Course Deleted",
        description: "The course has been successfully deleted.",
        className: "bg-red-600 text-primary-foreground",
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: "Could not delete the course. Please try again.",
        variant: "destructive",
      });
    }
    setCourseToDelete(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { y: -20, opacity: 0, transition: { duration: 0.3 } }
  };
  
  const cardHoverEffect = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.03, y: -5, transition: { type: "spring", stiffness: 300, damping: 15 } }
  };

  if (isLoading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground">Loading your courses...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive text-xl p-8">Error loading courses: {error}</div>;
  }

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants} className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight gradient-text">My Courses</h1>
        <Link to="/admin/create-course">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-all transform hover:scale-105 shadow-lg group">
            <PlusCircle className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" /> Create New Course
          </Button>
        </Link>
      </motion.header>

      {courses.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-10 bg-secondary border border-border rounded-xl shadow-lg">
          <img-replace class="mx-auto mb-6 h-40 w-40 text-muted-foreground opacity-50" alt="Empty box illustration representing no courses"  src="https://images.unsplash.com/photo-1694878981885-7647baf0d957" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Courses Here Yet!</h2>
          <p className="text-muted-foreground mb-6">
            Time to unleash your knowledge! Create your first course and start teaching.
          </p>
          <Link to="/admin/create-course">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl transition-all transform hover:scale-105">
              Create Your First Masterpiece <ArrowRight className="h-5 w-5 ml-2"/>
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
        >
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div 
                key={course.id} 
                variants={itemVariants} 
                exit="exit" 
                layout
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div variants={cardHoverEffect} className="h-full">
                <Card className="bg-secondary border-border shadow-xl flex flex-col h-full group overflow-hidden">
                  {course.image_url && (
                    <div className="h-48 w-full overflow-hidden">
                       <img-replace src={course.image_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{course.title}</CardTitle>
                    <CardDescription className="text-muted-foreground h-16 overflow-hidden text-ellipsis pt-1">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-2">
                    <div className="flex justify-between text-sm mb-1">
                        <p className="text-muted-foreground">{Array.isArray(course.topics) ? course.topics.length : 0} Topics</p>
                        <p className="font-medium text-accent">{course.duration}</p>
                    </div>
                    <p className="text-xs text-muted-foreground/70">Created: {new Date(course.created_at).toLocaleDateString()}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2 pt-4 border-t border-border/50 mt-auto">
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10" onClick={() => navigate(`/admin/my-courses/edit/${course.id}`)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10" onClick={() => navigate(`/admin/my-courses/edit/${course.id}`)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => setCourseToDelete(course.id)}>
                           <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background border-primary text-foreground">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-primary">Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. This will permanently delete the course "{course.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:bg-secondary/50">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteCourse(courseToDelete)}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            disabled={isLoading}
                          >
                            {isLoading && courseToDelete === course.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Yes, delete course
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyCoursesPage;