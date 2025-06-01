import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Mail, Lock, User as UserIcon, Zap, Briefcase, GraduationCap } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';

const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup: signupUser, isLoading: authIsLoading, user, profile } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student'); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please re-enter.",
        variant: "destructive",
      });
      return;
    }
    if (!role) {
      toast({
        title: "Role Required",
        description: "Please select if you are signing up as a Student or Tutor.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      await signupUser(email, password, fullName, role);
      // AuthContext's onAuthStateChange will set user and profile.
      // Navigation will be handled by the useEffect below or ProtectedRoute.
      toast({
        title: "Signup Successful!",
        description: `Welcome, ${fullName}! Your account is created. Check your email for verification if enabled. Redirecting...`,
        className: "bg-green-500 text-primary-foreground",
      });

    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effect to navigate after user and profile are set by AuthContext
  React.useEffect(() => {
    if (user && profile?.role) { // Ensure user and profile (with role) are available
      if (profile.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (profile.role === 'tutor' || profile.role === 'admin') {
        // Admin signup is typically handled differently, but for this flow:
        navigate('/home', { replace: true });
      }
    }
  }, [user, profile, navigate]);
  
  const pageVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    in: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "circOut" } },
    out: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.3, ease: "circIn" } }
  };

  const cardContentVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.4, ease: "easeOut" } },
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-bl from-background via-secondary to-background">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        className="w-full max-w-lg"
      >
        <Card className="bg-secondary/80 backdrop-blur-md border-primary/30 shadow-2xl overflow-hidden">
          <CardHeader className="text-center p-8 bg-gradient-to-bl from-primary to-accent">
             <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: -360 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 10 }}
            >
              <Zap className="h-16 w-16 text-primary-foreground mx-auto mb-3" />
            </motion.div>
            <CardTitle className="text-4xl font-extrabold text-primary-foreground">Join TutorFlow</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Create your account and start your journey.
            </CardDescription>
          </CardHeader>
          <motion.div variants={cardContentVariants}>
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-lg font-semibold text-primary/90 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-accent" /> Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Full Name"
                    required
                    className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-semibold text-primary/90 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-accent" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground h-12 text-base"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="password" className="text-lg font-semibold text-primary/90 flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-accent" /> Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        required
                        minLength={6}
                        className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground h-12 text-base"
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-lg font-semibold text-primary/90 flex items-center">
                        <Lock className="h-5 w-5 mr-2 text-accent" /> Confirm Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground h-12 text-base"
                    />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Label className="text-lg font-semibold text-primary/90">Sign up as a:</Label>
                    <RadioGroup defaultValue="student" value={role} onValueChange={setRole} className="flex flex-col sm:flex-row gap-4">
                        <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                            <Label 
                                htmlFor="role-student" 
                                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${role === 'student' ? 'border-primary bg-primary/10 text-primary shadow-lg' : 'border-border bg-background hover:border-accent'}`}
                            >
                                <RadioGroupItem value="student" id="role-student" className="sr-only" />
                                <GraduationCap className={`h-6 w-6 mr-3 ${role === 'student' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="text-md font-medium">Student</span>
                            </Label>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.97 }} className="flex-1">
                            <Label 
                                htmlFor="role-tutor" 
                                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${role === 'tutor' ? 'border-primary bg-primary/10 text-primary shadow-lg' : 'border-border bg-background hover:border-accent'}`}
                            >
                                <RadioGroupItem value="tutor" id="role-tutor" className="sr-only" />
                                <Briefcase className={`h-6 w-6 mr-3 ${role === 'tutor' ? 'text-primary' : 'text-muted-foreground'}`} />
                                <span className="text-md font-medium">Tutor</span>
                            </Label>
                        </motion.div>
                    </RadioGroup>
                </div>


                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <Button type="submit" size="lg" className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-accent transition-all transform hover:shadow-xl" disabled={isSubmitting || authIsLoading}>
                    {(isSubmitting || authIsLoading) ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <UserPlus className="h-6 w-6 mr-2" />
                    )}
                    {(isSubmitting || authIsLoading) ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex flex-col items-center space-y-3 bg-secondary/50">
              <p className="text-muted-foreground text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-accent hover:underline">
                  Log In
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;