import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CourseContext } from '@/contexts/CourseContext';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Loader2 } from 'lucide-react';

const CoursesPage = () => {
  const { courses, fetchCourses, isLoading, error } = useContext(CourseContext);
  const [searchTerm, setSearchTerm] = useState('');
  // const [filterCategory, setFilterCategory] = useState('All'); // Example filter

  useEffect(() => {
    fetchCourses(); // Fetch all courses
  }, [fetchCourses]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = (course.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (course.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    // Add category filter logic here if categories are implemented
    // const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
    return matchesSearch; // && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  if (isLoading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive text-xl p-8">Error loading courses: {error}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12 text-foreground"
    >
      <header className="text-center mb-12">
        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-6xl font-extrabold gradient-text mb-4"
        >
          Explore Our Courses
        </motion.h1>
        <motion.p 
          variants={itemVariants} 
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Discover a wide range of courses designed to help you learn and grow. Find your next learning adventure!
        </motion.p>
      </header>

      <motion.div variants={itemVariants} className="mb-10 md:flex md:justify-between md:items-center space-y-4 md:space-y-0">
        <div className="relative md:w-1/2 lg:w-1/3">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-secondary border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Filter className="h-4 w-4 mr-2" /> Filters (Soon)
          </Button>
        </div>
      </motion.div>

      {filteredCourses.length === 0 ? (
         <motion.div variants={itemVariants} className="text-center py-10">
           <img-replace class="mx-auto mb-6 h-40 w-40 text-muted-foreground" alt="Magnifying glass over empty page illustration" src="https://images.unsplash.com/photo-1586769852836-bc069f19e1b6" />
           <h2 className="text-2xl font-semibold text-foreground mb-2">No Courses Found</h2>
           <p className="text-muted-foreground">
             Try adjusting your search or filter, or explore our <Link to="/popular-courses" className="text-primary hover:underline">popular courses</Link>.
           </p>
         </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {filteredCourses.map(course => (
            <motion.div key={course.id} variants={itemVariants}>
              <Card className="bg-secondary border-border h-full flex flex-col overflow-hidden hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 hover:border-primary/50 group">
                {course.image_url && (
                  <div className="h-48 w-full overflow-hidden">
                     <img-replace src={course.image_url} alt={course.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{course.title}</CardTitle>
                  <CardDescription className="text-muted-foreground h-20 overflow-hidden text-ellipsis">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>{Array.isArray(course.topics) ? course.topics.length : 0} Topics</span>
                    <span>{course.duration}</span>
                  </div>
                  {course.profiles && (
                    <div className="flex items-center mt-2">
                      <img-replace src={course.profiles.avatar_url || `https://source.unsplash.com/random/30x30/?profile,user`} alt={course.profiles.full_name} className="h-6 w-6 rounded-full mr-2 object-cover" />
                      <span className="text-xs text-muted-foreground">{course.profiles.full_name || 'Tutor'}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-4">
                  <Link to={`/courses/${course.id}`} className="w-full"> {/* TODO: Create single course view page */}
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-accent group">
                      View Course <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"/>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesPage;