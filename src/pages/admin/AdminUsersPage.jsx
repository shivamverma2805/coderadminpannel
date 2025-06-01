import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Trash2, UserPlus, Search, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';


const AdminUsersPage = () => {
  const { user: adminUser, isLoading: authLoading } = useContext(AuthContext);
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'full_name', direction: 'ascending' });

  useEffect(() => {
    const fetchUsers = async () => {
      if (adminUser?.role !== 'admin') return;
      setIsLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, email:users(email), role, avatar_url, updated_at') // Assuming email is in auth.users
          .order(sortConfig.key, { ascending: sortConfig.direction === 'ascending' });

        if (error) throw error;
        
        // The email might be nested if joined from users table. Adjust if necessary.
        // For now, let's assume a direct 'email' field or handle it if it's users.email
        const formattedUsers = data.map(u => ({
            ...u,
            email: u.email?.email || 'N/A', // Adjust based on actual Supabase response structure
            joined: u.updated_at // Using updated_at as joined date for simplicity
        }));
        setUsers(formattedUsers);

      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error Fetching Users",
          description: error.message || "Could not load user data.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [adminUser, sortConfig, toast]);
  

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };
  
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (adminUser?.role !== 'admin') {
    return (
      <motion.div className="text-center p-10" initial={{opacity:0}} animate={{opacity:1}}>
        <h1 className="text-3xl text-destructive font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </motion.div>
    );
  }


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-12 text-foreground"
    >
      <motion.header variants={itemVariants} className="mb-8 md:flex md:justify-between md:items-center">
        <div>
            <h1 className="text-4xl font-bold tracking-tight gradient-text">User Management</h1>
            <p className="text-muted-foreground mt-1">Oversee and manage all users on the TutorFlow platform.</p>
        </div>
        <Button className="mt-4 md:mt-0 bg-primary text-primary-foreground hover:bg-accent" disabled>
          <UserPlus className="h-5 w-5 mr-2" /> Add New User (Soon)
        </Button>
      </motion.header>

      <motion.div variants={itemVariants} className="mb-6">
        <Card className="bg-secondary border-border">
            <CardContent className="p-4">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search users by name, email, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground h-11"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
            </CardContent>
        </Card>
      </motion.div>

      {isLoadingUsers ? (
        <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-3 text-lg text-muted-foreground">Loading users...</p>
        </div>
      ) : (
        <motion.div variants={itemVariants} className="overflow-x-auto">
          <Card className="bg-secondary border-border shadow-lg">
            <Table>
              <TableHeader>
                <TableRow className="border-b-border/50">
                  <TableHead className="w-[80px]"></TableHead>
                  <TableHead onClick={() => handleSort('full_name')} className="cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center">Name {getSortIcon('full_name')}</div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('email')} className="cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center">Email {getSortIcon('email')}</div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('role')} className="cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center">Role {getSortIcon('role')}</div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('updated_at')} className="cursor-pointer hover:text-primary transition-colors">
                      <div className="flex items-center">Last Active {getSortIcon('updated_at')}</div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-b-border/20 hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src={user.avatar_url} alt={user.full_name} />
                        <AvatarFallback className="bg-accent text-accent-foreground">{(user.full_name || 'U').substring(0,1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{user.full_name || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 
                          user.role === 'tutor' ? 'bg-blue-500/20 text-blue-400' : 
                          'bg-green-500/20 text-green-400'}`}>
                        {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="text-accent hover:text-primary hover:bg-primary/10" disabled>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80 hover:bg-destructive/10" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredUsers.length === 0 && !isLoadingUsers && (
              <p className="text-center text-muted-foreground py-8">No users found matching your criteria.</p>
            )}
          </Card>
        </motion.div>
      )}
       <motion.div variants={itemVariants} className="mt-8 text-center">
         <img-replace class="mx-auto rounded-lg shadow-lg w-full max-w-lg h-auto object-cover" alt="Network of diverse user profile icons connected by lines" src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7" />
       </motion.div>
    </motion.div>
  );
};

export default AdminUsersPage;