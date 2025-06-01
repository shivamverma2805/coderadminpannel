import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Mail, Lock, Zap } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, user, profile, isLoading: authIsLoading } = useContext(AuthContext); // Get user and profile
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      // The AuthContext's onAuthStateChange listener will update `user` and `profile`
      // and trigger navigation via ProtectedRoute or App.jsx logic.
      // We need to wait for profile to be available after login for correct navigation.
      // A small delay or a more robust check might be needed if navigation depends on profile role immediately.
      
      // The navigation will be handled by App.jsx useEffect listening to user state
      // For now, we just show a success toast. The AuthContext will handle the redirect.
      toast({
        title: "Login Successful!",
        description: `Welcome back! Redirecting...`,
        className: "bg-green-500 text-primary-foreground",
      });
      // Navigation is handled by ProtectedRoute redirecting based on role from context
      // If login is successful, AuthContext updates user, ProtectedRoute sees it and redirects.
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Effect to navigate after user and profile are set by AuthContext
  React.useEffect(() => {
    if (user && profile?.role) {
      if (profile.role === 'student') {
        navigate('/student/dashboard', { replace: true });
      } else if (profile.role === 'tutor' || profile.role === 'admin') {
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
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.4, ease: "easeOut" } },
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-secondary to-background">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="in"
        exit="out"
        className="w-full max-w-md"
      >
        <Card className="bg-secondary/80 backdrop-blur-md border-primary/30 shadow-2xl overflow-hidden">
          <CardHeader className="text-center p-8 bg-gradient-to-br from-primary to-accent">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 150, damping: 10 }}
            >
              <Zap className="h-16 w-16 text-primary-foreground mx-auto mb-3" />
            </motion.div>
            <CardTitle className="text-4xl font-extrabold text-primary-foreground">Welcome Back!</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg">
              Log in to manage your TutorFlow.
            </CardDescription>
          </CardHeader>
          <motion.div variants={cardContentVariants}>
            <CardContent className="p-8 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-lg font-semibold text-primary/90 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-accent" /> Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground h-12 text-base"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button type="submit" size="lg" className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-accent transition-all transform hover:shadow-xl" disabled={isSubmitting || authIsLoading}>
                    {(isSubmitting || authIsLoading) ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <LogIn className="h-6 w-6 mr-2" />
                    )}
                    {(isSubmitting || authIsLoading) ? 'Logging In...' : 'Log In'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex flex-col items-center space-y-3 bg-secondary/50">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot your password? (Soon)
              </Link>
              <p className="text-muted-foreground text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-accent hover:underline">
                  Sign Up Now
                </Link>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;