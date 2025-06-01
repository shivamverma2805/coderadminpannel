import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { User, Mail, Edit3, Loader2, Image as ImageIcon } from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, profile, updateUserProfile, isLoading: authLoading } = useContext(AuthContext);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '', // Email is usually not editable directly from profile form for security
    avatarUrl: '',
    bio: '', // Added bio field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile) {
      setFormData({
        fullName: profile.full_name || user.email.split('@')[0], // Fallback to part of email if name not set
        email: user.email,
        avatarUrl: profile.avatar_url || '',
        bio: profile.bio || "Passionate learner and educator, ready to share knowledge!", // Default bio
      });
    }
  }, [user, profile]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      if (!formData.fullName) {
         toast({
            title: "Missing Required Fields",
            description: "Full Name cannot be empty.",
            variant: "destructive",
         });
         return;
      }
      setIsSubmitting(true);
      try {
        await updateUserProfile({ 
          fullName: formData.fullName, 
          avatarUrl: formData.avatarUrl,
          bio: formData.bio, // Assuming bio is part of profile table
        });
        toast({
          title: "Profile Updated",
          description: "Your profile information has been successfully saved.",
          className: "bg-green-500 text-primary-foreground"
        });
        setIsEditing(false);
      } catch (error) {
        toast({
          title: "Update Failed",
          description: error.message || "Could not update your profile.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Reset form data to current profile if canceling edit
      if (user && profile) {
        setFormData({
          fullName: profile.full_name || user.email.split('@')[0],
          email: user.email,
          avatarUrl: profile.avatar_url || '',
          bio: profile.bio || "Passionate learner and educator, ready to share knowledge!",
        });
      }
      setIsEditing(true);
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (authLoading && !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground">Loading profile...</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-secondary border-border shadow-xl">
        <CardHeader className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="mx-auto w-fit relative">
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary shadow-lg">
              <AvatarImage src={formData.avatarUrl || profile?.avatar_url} alt={formData.fullName || profile?.full_name} />
              <AvatarFallback className="text-4xl bg-accent text-accent-foreground">
                {(formData.fullName || profile?.full_name || 'U').substring(0,1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
                <label htmlFor="avatarUrlInput" className="absolute bottom-2 right-2 bg-primary p-2 rounded-full cursor-pointer hover:bg-accent transition-colors">
                    <ImageIcon className="h-5 w-5 text-primary-foreground"/>
                </label>
            )}
          </motion.div>
          <CardTitle className="text-3xl font-bold gradient-text">{formData.fullName || profile?.full_name}</CardTitle>
          <CardDescription className="text-muted-foreground capitalize">{profile?.role} Profile & Settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing && (
            <div className="space-y-2">
                <Label htmlFor="avatarUrlInput" className="text-md font-semibold text-primary/90 flex items-center"><ImageIcon className="h-4 w-4 mr-2 text-accent"/> Avatar URL</Label>
                <Input id="avatarUrlInput" value={formData.avatarUrl} onChange={(e) => setFormData(prev => ({...prev, avatarUrl: e.target.value}))} placeholder="https://example.com/avatar.png" className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"/>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-md font-semibold text-primary/90 flex items-center"><User className="h-4 w-4 mr-2 text-accent"/> Full Name</Label>
            {isEditing ? (
              <Input id="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"/>
            ) : (
              <p className="text-lg text-foreground mt-1 p-2 bg-background/30 rounded-md">{formData.fullName || profile?.full_name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-md font-semibold text-primary/90 flex items-center"><Mail className="h-4 w-4 mr-2 text-accent"/> Email Address</Label>
            <p className="text-lg text-muted-foreground mt-1 p-2 bg-background/30 rounded-md">{formData.email || user?.email} (Not editable)</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-md font-semibold text-primary/90">Your Bio</Label>
            {isEditing ? (
              <Textarea id="bio" value={formData.bio} onChange={handleInputChange} rows={4} placeholder="Tell us a bit about yourself..." className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"/>
            ) : (
              <p className="text-md text-muted-foreground mt-1 leading-relaxed p-2 bg-background/30 rounded-md min-h-[80px]">{formData.bio || "No bio set."}</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-border/50">
            <Button onClick={handleEditToggle} size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all transform hover:scale-105 shadow-lg" disabled={isSubmitting || authLoading}>
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Edit3 className="h-5 w-5 mr-2" />
              )}
              {isEditing ? (isSubmitting ? "Saving..." : "Save Changes") : "Edit Profile"}
            </Button>
          </div>
           <div className="mt-8 text-center">
             <img-replace class="mx-auto rounded-lg shadow-lg w-full max-w-md h-auto object-cover" alt="Abstract background representing learning and knowledge with orange hues" src="https://images.unsplash.com/photo-1700941019917-731dc64ce685" />
           </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfilePage;