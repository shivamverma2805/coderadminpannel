import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const ContactUsPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields in the contact form.",
        variant: "destructive",
      });
      return;
    }
    // Simulate form submission
    console.log("Form data submitted:", formData);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out! We'll get back to you soon.",
      className: "bg-green-500 text-primary-foreground"
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="container mx-auto px-4 py-12 text-foreground"
    >
      <header className="text-center mb-16">
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-6xl font-extrabold gradient-text mb-4"
        >
          Get In Touch
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          transition={{ delay: 0.1 }}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          We're here to help and answer any question you might have. We look forward to hearing from you!
        </motion.p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div variants={itemVariants} transition={{ delay: 0.2 }}>
          <Card className="bg-secondary border-border shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Send Us A Message</CardTitle>
              <CardDescription className="text-muted-foreground">Fill out the form and we'll be in touch shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-md font-semibold text-primary/80">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Your Name" className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-md font-semibold text-primary/80">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-md font-semibold text-primary/80">Subject</Label>
                  <Input id="subject" value={formData.subject} onChange={handleInputChange} placeholder="What's this about?" className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground" />
                </div>
                <div>
                  <Label htmlFor="message" className="text-md font-semibold text-primary/80">Message</Label>
                  <Textarea id="message" value={formData.message} onChange={handleInputChange} placeholder="Your message here..." rows={5} className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground" />
                </div>
                <Button type="submit" size="lg" className="w-full bg-primary text-primary-foreground hover:bg-accent transition-all transform hover:scale-105 shadow-lg">
                  <Send className="h-5 w-5 mr-2" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="space-y-8" variants={itemVariants} transition={{ delay: 0.3 }}>
          <Card className="bg-secondary border-border shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Contact Information</CardTitle>
              <CardDescription className="text-muted-foreground">Reach us directly through these channels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Email Us</h3>
                  <a href="mailto:support@tutorflow.com" className="text-primary/80 hover:text-primary hover:underline">support@tutorflow.com</a>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Call Us</h3>
                  <p className="text-primary/80">(123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-accent mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Our Office</h3>
                  <p className="text-primary/80">123 Education Lane, Learning City, Knowledgedom, 45678</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <motion.div variants={itemVariants} transition={{delay: 0.4}}>
             <img  
                className="rounded-xl shadow-2xl w-full h-auto object-cover max-h-80" 
                alt="Stylized map showing a vibrant city location pin"
               src="https://images.unsplash.com/photo-1518487346609-25352f3e0c8c" />
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactUsPage;