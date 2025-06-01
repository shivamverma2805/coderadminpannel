import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Info, Book, Star, Mail, PlusSquare, BookOpen, User, Gift, Zap, LogIn, LogOut, UserPlus, Users, Settings, GraduationCap, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  if (!user) return null; // Don't render sidebar if no user

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const commonNavItems = [
    { name: 'Courses', path: '/courses', icon: Book },
    { name: 'Popular Courses', path: '/popular-courses', icon: Star },
  ];
  
  const studentNavItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: GraduationCap },
    { name: 'My Learning', path: '/student/my-courses', icon: BookOpen },
    ...commonNavItems,
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Referrals', path: '/admin/referral', icon: Gift }, // Assuming referral is common
  ];

  const tutorNavItems = [
    { name: 'Dashboard', path: '/home', icon: Home }, // Tutor dashboard
    { name: 'Create Course', path: '/admin/create-course', icon: PlusSquare },
    { name: 'My Courses', path: '/admin/my-courses', icon: BookOpen }, // Courses they created
    ...commonNavItems,
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Referrals', path: '/admin/referral', icon: Gift },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', path: '/home', icon: Settings },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Courses', path: '/admin/my-courses', icon: Briefcase }, // Admin view of all courses
    ...tutorNavItems.filter(item => !['Dashboard', 'My Courses'].includes(item.name)), // Avoid duplicates, take specific tutor items
    ...studentNavItems.filter(item => !['Dashboard', 'My Learning', 'Profile', 'Referrals'].includes(item.name)), // Avoid duplicates
  ];
  
  let navItems;
  let panelTitle = "Menu";

  if (user.role === 'student') {
    navItems = studentNavItems;
    panelTitle = "Student Portal";
  } else if (user.role === 'tutor') {
    navItems = tutorNavItems;
    panelTitle = "Tutor Panel";
  } else if (user.role === 'admin') {
    navItems = adminNavItems;
    panelTitle = "Admin Control";
  } else {
    navItems = commonNavItems; // Fallback, should not happen if role is set
  }
  // Ensure unique items if combining, e.g. by path
  const uniqueNavItems = Array.from(new Set(navItems.map(a => a.path)))
    .map(path => {
        return navItems.find(a => a.path === path)
    });


  return (
    <motion.aside
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      className="w-72 bg-secondary backdrop-blur-lg shadow-2xl p-6 flex flex-col justify-between border-r border-border"
    >
      <div>
        <motion.div 
          className="flex items-center mb-6"
          initial={{ opacity:0, y: -20 }}
          animate={{ opacity:1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Zap className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-3xl font-bold tracking-tighter gradient-text">TutorFlow</h1>
        </motion.div>

        <div className="mb-8 p-3 bg-background/30 rounded-lg flex items-center space-x-3">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarImage src={user.avatarUrl || `https://source.unsplash.com/random/100x100/?${user.role}`} alt={user.name} />
            <AvatarFallback className="bg-accent text-accent-foreground">{user.name ? user.name.substring(0,1).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground text-sm truncate">{user.name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
        </div>
        
        <nav>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{panelTitle}</h2>
          <ul>
            {uniqueNavItems.map((item, index) => (
              <motion.li 
                key={item.path} 
                className="mb-2"
                initial={{ opacity:0, x: -20 }}
                animate={{ opacity:1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.4 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out group
                    ${isActive
                      ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                      : 'text-foreground/80 hover:bg-primary/20 hover:text-primary-foreground hover:shadow-md hover:scale-102'
                    }`
                  }
                >
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <item.icon className={`h-5 w-5 mr-4 group-hover:text-primary ${NavLink.isActive ? 'text-primary-foreground': 'text-foreground/70'}`} />
                  </motion.div>
                  <span className="text-sm font-medium">{item.name}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
      
      <motion.div 
        className="mt-auto"
        initial={{ opacity:0, y: 20 }}
        animate={{ opacity:1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {user ? (
          <Button onClick={handleLogout} variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <LogOut className="h-5 w-5 mr-2" /> Logout
          </Button>
        ) : (
          <div className="space-y-2">
            <Button onClick={() => navigate('/login')} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <LogIn className="h-5 w-5 mr-2" /> Login
            </Button>
            <Button onClick={() => navigate('/signup')} variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <UserPlus className="h-5 w-5 mr-2" /> Sign Up
            </Button>
          </div>
        )}
        <p className="text-xs text-muted-foreground text-center mt-4">&copy; {new Date().getFullYear()} TutorFlow</p>
        <p className="text-xs text-muted-foreground text-center">Orange Power! ✨</p>
      </motion.div>
    </motion.aside>
  );
};

export default Sidebar;