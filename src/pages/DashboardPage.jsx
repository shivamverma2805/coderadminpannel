
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, BarChart2, ArrowRight, TrendingUp, DollarSign, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CourseContext } from '@/contexts/CourseContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ComposedChart, Area } from 'recharts';

const DashboardPage = () => {
  const { courses } = useContext(CourseContext);
  const totalCourses = courses.length;

  const stats = [
    { title: 'Total Courses', value: totalCourses, icon: BookOpen, color: 'text-primary', link: '/admin/my-courses' },
    { title: 'Enrolled Students', value: '120+', icon: Users, color: 'text-accent', link: '#' },
    { title: 'Monthly Revenue', value: '$1,250', icon: DollarSign, color: 'text-green-500', link: '#' },
  ];

  const studentEnrollmentData = [
    { name: 'Jan', students: 30, courses: 5 },
    { name: 'Feb', students: 45, courses: 7 },
    { name: 'Mar', students: 60, courses: 10 },
    { name: 'Apr', students: 50, courses: 12 },
    { name: 'May', students: 70, courses: 15 },
    { name: 'Jun', students: 85, courses: 18 },
  ];

  const coursePerformanceData = courses.slice(0, 5).map(course => ({
    name: course.title.substring(0, 15) + (course.title.length > 15 ? '...' : ''), // Shorten name for chart
    students: Math.floor(Math.random() * 100) + 20, // Dummy student count
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // Dummy rating 3.5-5.0
  }));


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 12 } },
  };
  
  const chartCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };


  return (
    <motion.div
      className="space-y-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants} className="text-center md:text-left">
        <h1 className="text-5xl font-extrabold tracking-tight gradient-text mb-4">TutorFlow Dashboard</h1>
        <p className="text-xl text-muted-foreground">
          Insights & actions to supercharge your teaching.
        </p>
      </motion.header>

      <motion.section 
        variants={itemVariants}
        className="relative p-8 md:p-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-background border border-border shadow-2xl"
      >
        <div className="absolute inset-0 opacity-5">
           <img-replace className="w-full h-full object-cover" alt="Abstract orange and black geometric pattern" src="https://images.unsplash.com/photo-1604079628040-94301bb21b91" />
        </div>
        <div className="relative z-10 md:flex md:items-center md:justify-between">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-primary mb-3">Elevate Your Courses!</h2>
            <p className="text-foreground/80 mb-6 text-lg">
              Utilize powerful analytics, manage your content seamlessly, and engage with your students like never before.
            </p>
            <Link to="/admin/create-course">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent transition-all transform hover:scale-105 shadow-lg group">
                Launch New Course <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <motion.div 
            className="md:w-1/3 flex justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
          >
             <img-replace className="rounded-full shadow-xl w-48 h-48 object-cover border-4 border-accent" alt="Vibrant abstract representation of data and learning" src="https://images.unsplash.com/photo-1633032229000-d87595c6f9c0" />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="bg-secondary border-border shadow-xl hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-2 hover:border-primary/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium text-muted-foreground">{stat.title}</CardTitle>
                <stat.icon className={`h-7 w-7 ${stat.color} p-1 rounded-md`} />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-foreground">{stat.value}</div>
                <Link to={stat.link} className="text-xs text-primary hover:underline mt-1 flex items-center group">
                  View Details <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform"/>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      <motion.section className="grid gap-8 lg:grid-cols-2" variants={containerVariants}>
        <motion.div variants={chartCardVariants}>
          <Card className="bg-secondary border-border shadow-xl p-2 md:p-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-accent" /> Student Enrollment Trends
              </CardTitle>
              <CardDescription className="text-muted-foreground">Monthly new students & courses created.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={studentEnrollmentData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ 
                        backgroundColor: 'hsl(var(--background)/0.9)', 
                        borderColor: 'hsl(var(--primary))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px hsla(var(--primary)/0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--primary)/0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                  <Area yAxisId="left" type="monotone" dataKey="students" fill="hsl(var(--primary)/0.3)" stroke="hsl(var(--primary))" activeDot={{ r: 6, strokeWidth: 2, fill: 'hsl(var(--primary))' }} name="New Students" />
                  <Line yAxisId="right" type="monotone" dataKey="courses" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r:4, fill: 'hsl(var(--accent))' }} activeDot={{ r: 6, strokeWidth: 2, fill: 'hsl(var(--accent))' }} name="Courses Added" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={chartCardVariants}>
          <Card className="bg-secondary border-border shadow-xl p-2 md:p-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary flex items-center">
                <BarChart2 className="h-6 w-6 mr-2 text-accent" /> Top Course Performance
              </CardTitle>
              <CardDescription className="text-muted-foreground">Student count and ratings for top courses.</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={coursePerformanceData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, width: 80 }} width={90} />
                  <Tooltip
                     contentStyle={{ 
                        backgroundColor: 'hsl(var(--background)/0.9)', 
                        borderColor: 'hsl(var(--primary))',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px hsla(var(--primary)/0.1)'
                    }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--primary)/0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                  <Bar dataKey="students" barSize={20} fill="hsl(var(--primary))" name="Students" radius={[0, 5, 5, 0]} />
                  <Line dataKey="rating" type="monotone" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r:4, fill: 'hsl(var(--accent))' }} activeDot={{ r: 6, strokeWidth: 2, fill: 'hsl(var(--accent))' }} name="Avg Rating" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
      
      <motion.section variants={itemVariants}>
        <Card className="bg-secondary border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-primary">Quick Actions</CardTitle>
            <CardDescription className="text-muted-foreground">Jump right into your next task.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/my-courses">
              <Button variant="outline" className="w-full py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all transform hover:scale-105">
                <BookOpen className="h-5 w-5 mr-2"/> Manage My Courses
              </Button>
            </Link>
            <Link to="/admin/profile">
              <Button variant="outline" className="w-full py-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all transform hover:scale-105">
                <Users className="h-5 w-5 mr-2"/> Update Profile
              </Button>
            </Link>
             <Link to="/admin/referral">
              <Button variant="outline" className="w-full py-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all transform hover:scale-105">
                <Gift className="h-5 w-5 mr-2"/> View Referrals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.section>

    </motion.div>
  );
};

export default DashboardPage;
