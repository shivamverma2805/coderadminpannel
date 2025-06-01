import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Gift, Copy, Share2, Users, DollarSign } from 'lucide-react';

const ReferralPage = () => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referredUsers, setReferredUsers] = useState(0); // Dummy data
  const [earnings, setEarnings] = useState(0); // Dummy data

  useEffect(() => {
    // Simulate fetching/generating referral code from localStorage or a service
    let storedCode = localStorage.getItem('referralCode');
    if (!storedCode) {
      storedCode = `TUTORFLOW-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
      localStorage.setItem('referralCode', storedCode);
    }
    setReferralCode(storedCode);
    // Assuming your app is hosted at a specific domain, replace with actual domain
    setReferralLink(`https://your-tutorflow-app.com/signup?ref=${storedCode}`); 

    // Simulate fetching referral stats
    setReferredUsers(parseInt(localStorage.getItem('referredUsersCount') || '5', 10));
    setEarnings(parseFloat(localStorage.getItem('referralEarnings') || '25.00'));

  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({ title: "Copied!", description: "Referral code copied to clipboard.", className: "bg-green-500 text-primary-foreground" });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Copied!", description: "Referral link copied to clipboard.", className: "bg-green-500 text-primary-foreground" });
  };
  
  const handleShare = () => {
     if (navigator.share) {
      navigator.share({
        title: 'Join TutorFlow!',
        text: `Sign up for TutorFlow using my referral link and get started!`,
        url: referralLink,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      handleCopyLink();
      toast({ title: "Link Copied", description: "Share this link with your friends!", className: "bg-blue-500 text-primary-foreground"});
    }
  }

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="container mx-auto px-4 py-12 text-foreground"
    >
      <header className="text-center mb-12">
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-6xl font-extrabold gradient-text mb-4 flex items-center justify-center"
        >
          <Gift className="h-12 w-12 mr-4 text-accent" /> TutorFlow Referral Program
        </motion.h1>
        <motion.p 
          variants={itemVariants}
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Share TutorFlow with your friends and earn rewards for every successful referral!
        </motion.p>
      </header>

      <motion.div className="grid md:grid-cols-2 gap-8 mb-12 items-stretch">
        <motion.div variants={itemVariants}>
          <Card className="bg-secondary border-border shadow-xl h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Your Referral Code</CardTitle>
              <CardDescription className="text-muted-foreground">Share this code with your friends.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center">
              <Input 
                readOnly 
                value={referralCode} 
                className="text-2xl font-mono tracking-wider text-center bg-background border-dashed border-primary/50 py-6 text-accent" 
              />
              <Button onClick={handleCopyCode} className="mt-4 bg-primary text-primary-foreground hover:bg-accent w-full">
                <Copy className="h-4 w-4 mr-2" /> Copy Code
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="bg-secondary border-border shadow-xl h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Your Referral Link</CardTitle>
              <CardDescription className="text-muted-foreground">Or share this direct link.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center items-center">
              <Input 
                readOnly 
                value={referralLink} 
                className="text-sm text-center bg-background border-dashed border-primary/50 py-3 text-accent truncate"
              />
              <div className="flex space-x-2 w-full mt-4">
                <Button onClick={handleCopyLink} className="bg-primary text-primary-foreground hover:bg-accent flex-1">
                  <Copy className="h-4 w-4 mr-2" /> Copy Link
                </Button>
                 <Button onClick={handleShare} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-secondary border-border shadow-xl mb-12">
            <CardHeader>
                <CardTitle className="text-2xl text-primary">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
                <div className="flex items-start">
                    <span className="text-primary font-bold text-2xl mr-3">1.</span>
                    <p>Share your unique referral code or link with friends, colleagues, or on social media.</p>
                </div>
                <div className="flex items-start">
                    <span className="text-primary font-bold text-2xl mr-3">2.</span>
                    <p>Your friend signs up for TutorFlow using your code/link and subscribes to a plan.</p>
                </div>
                <div className="flex items-start">
                    <span className="text-primary font-bold text-2xl mr-3">3.</span>
                    <p>You both get rewarded! (e.g., You get a discount on your next bill, they get a bonus feature).</p>
                </div>
                 <p className="text-xs italic text-center pt-2">Specific rewards and terms will be detailed here once the system is fully live.</p>
            </CardContent>
        </Card>
      </motion.div>
      
      <motion.h2 variants={itemVariants} className="text-3xl font-bold gradient-text text-center mb-8">Your Referral Stats</motion.h2>
      <motion.div className="grid md:grid-cols-2 gap-8" variants={pageVariants}>
        <motion.div variants={itemVariants}>
            <Card className="bg-secondary border-border shadow-lg text-center p-6 hover:shadow-primary/20 transition-shadow">
                <Users className="h-12 w-12 text-primary mx-auto mb-3"/>
                <p className="text-4xl font-bold text-foreground">{referredUsers}</p>
                <p className="text-muted-foreground">Successful Referrals</p>
            </Card>
        </motion.div>
         <motion.div variants={itemVariants}>
            <Card className="bg-secondary border-border shadow-lg text-center p-6 hover:shadow-primary/20 transition-shadow">
                <DollarSign className="h-12 w-12 text-accent mx-auto mb-3"/>
                <p className="text-4xl font-bold text-foreground">${earnings.toFixed(2)}</p>
                <p className="text-muted-foreground">Total Earnings (Example)</p>
            </Card>
        </motion.div>
      </motion.div>
      
       <motion.div variants={itemVariants} className="mt-12 text-center">
           <img  
            className="rounded-xl shadow-2xl w-full max-w-lg h-auto object-cover mx-auto" 
            alt="Illustration of people connecting and sharing gifts"
            src="https://images.unsplash.com/photo-1516053055290-2863d8bd601e" />
       </motion.div>

    </motion.div>
  );
};

export default ReferralPage;