import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CourseContext } from '@/contexts/CourseContext';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, ArrowRight } from 'lucide-react';

const PopularCoursesPage = () => {
  const { courses } = useContext(CourseContext);

  // Dummy logic for "popular" - e.g., first 6 courses or courses with most topics.
  // Replace with actual popularity metric when available.
  const popularCourses = courses
    .slice() // Create a shallow copy to avoid mutating the original array
    .sort((a, b) => b.topics.length - a.topics.length) // Example: sort by number of topics
    .slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };
  
  const cardHoverEffect = {
    rest: { scale: 1, boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)" }, // Default shadow from Tailwind's shadow-xl
    hover: { 
      scale: 1.03, 
      boxShadow: "0px 20px 25px -5px hsla(var(--primary)/0.3), 0px 10px 10px -5px hsla(var(--primary)/0.2)" // Enhanced orange shadow
    }
  };


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12 text-foreground"
    >
      <header className="text-center mb-16">
        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-6xl font-extrabold gradient-text mb-4 flex items-center justify-center"
        >
          <TrendingUp className="h-12 w-12 mr-4 text-accent" /> Popular Courses
        </motion.h1>
        <motion.p 
          variants={itemVariants} 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Check out what's trending! These are the courses our community loves right now.
        </motion.p>
      </header>

      {popularCourses.length === 0 ? (
        <motion.div variants={itemVariants} className="text-center py-10">
          <img  class="mx-auto mb-6 h-40 w-40 text-muted-foreground" alt="Empty star illustration" src="https://images.unsplash.com/flagged/photo-1608632359963-5828fa3b4141" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">No Popular Courses Yet</h2>
          <p className="text-muted-foreground">
            We're still gathering data. Check back soon or <Link to="/courses" className="text-primary hover:underline">explore all courses</Link>.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {popularCourses.map((course, index) => (
            <motion.div 
              key={course.id} 
              variants={itemVariants}
              initial="rest"
              whileHover="hover"
              animate="rest"
            >
              <motion.div variants={cardHoverEffect} className="h-full">
                <Card className="bg-secondary border-border h-full flex flex-col overflow-hidden group transition-all duration-300">
                  {course.imageUrl && (
                    <div className="h-52 w-full overflow-hidden relative">
                       <img-replace src={course.imageUrl} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       <div className="absolute top-3 right-3 bg-accent text-accent-foreground p-2 rounded-full shadow-lg">
                           <Star className="h-5 w-5"/>
                       </div>
                    </div>
                  )}
                  <CardHeader className="flex-1">
                    <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{course.title}</CardTitle>
                    <CardDescription className="text-muted-foreground h-16 overflow-hidden text-ellipsis mt-1">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{course.topics.length} Engaging Topics</span>
                      <span className="font-semibold text-primary">{course.duration}</span>
                    </div>
                     {/* Example: Dummy rating */}
                    <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">(120+ Reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 mt-auto">
                    <Link to={`/admin/my-courses/edit/${course.id}`} className="w-full">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-accent group">
                        Explore Course <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="text-center mt-16">
        <Link to="/courses">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6">
            View All Courses
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default PopularCoursesPage;