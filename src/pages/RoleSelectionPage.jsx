import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GraduationCap, Briefcase, Zap } from 'lucide-react';

// This page is a conceptual placeholder if needed after signup,
// but current implementation puts role selection directly in SignupPage.
// It can be repurposed or removed.

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // In a real app, this would update user's role in backend/context
    // For now, it's a conceptual step.
    console.log("Role selected:", role);
    // Navigate to the appropriate dashboard or next step
    if (role === 'student') {
      navigate('/student/dashboard');
    } else if (role === 'tutor') {
      navigate('/home'); // Tutor dashboard
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    out: { opacity: 0, y: -50, transition: { duration: 0.3, ease: "easeIn" } }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.8 },
    in: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut" } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-secondary to-background text-foreground">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        className="w-full max-w-2xl text-center"
      >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 10, duration: 0.8 }}
            className="inline-block mb-8"
        >
            <Zap className="h-20 w-20 text-primary" />
        </motion.div>
        
        <CardTitle className="text-5xl font-extrabold gradient-text mb-6">Choose Your Path</CardTitle>
        <CardDescription className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
          Are you here to learn and explore, or to share your knowledge and teach? Select your role to get started.
        </CardDescription>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={cardVariants} transition={{ delay: 0.2 }}>
            <Card 
              className="bg-secondary/80 backdrop-blur-md border-primary/30 shadow-xl hover:shadow-primary/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => handleRoleSelect('student')}
            >
              <CardHeader className="items-center p-6">
                <GraduationCap className="h-16 w-16 text-accent mb-4" />
                <CardTitle className="text-3xl font-bold text-primary">I'm a Student</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-6">
                  Browse courses, enroll in new learning adventures, and track your progress.
                </p>
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg">
                  Explore as Student
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} transition={{ delay: 0.4 }}>
            <Card 
              className="bg-secondary/80 backdrop-blur-md border-primary/30 shadow-xl hover:shadow-primary/50 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              onClick={() => handleRoleSelect('tutor')}
            >
              <CardHeader className="items-center p-6">
                <Briefcase className="h-16 w-16 text-accent mb-4" />
                <CardTitle className="text-3xl font-bold text-primary">I'm a Tutor</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-muted-foreground mb-6">
                  Create engaging courses, manage your students, and build your teaching empire.
                </p>
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg">
                  Teach as Tutor
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;