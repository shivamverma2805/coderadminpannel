import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Zap, Target } from 'lucide-react';

const AboutUsPage = () => {
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const featureVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } }
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
          className="text-5xl md:text-6xl font-extrabold gradient-text mb-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          About TutorFlow
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Empowering educators and inspiring learners through innovative technology and a passion for knowledge sharing.
        </motion.p>
      </header>

      <section className="mb-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={featureVariants}>
          <img  
            className="rounded-xl shadow-2xl w-full h-auto object-cover" 
            alt="Team of diverse educators collaborating"
           src="https://images.unsplash.com/photo-1573165231977-3f0e27806045" />
        </motion.div>
        <motion.div variants={featureVariants} className="space-y-6">
          <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            At TutorFlow, our mission is to democratize education by providing tutors with powerful, easy-to-use tools to create, manage, and scale their teaching businesses. We believe that anyone with knowledge to share should have the platform to do so effectively.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            We strive to foster a vibrant community where learning thrives, connections are made, and educational barriers are broken down.
          </p>
        </motion.div>
      </section>

      <section className="mb-20">
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">What We Stand For</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Innovation", description: "Constantly evolving our platform with cutting-edge features to meet the dynamic needs of modern education." },
            { icon: Users, title: "Community", description: "Building a supportive network of tutors and learners, fostering collaboration and growth." },
            { icon: Target, title: "Empowerment", description: "Providing tutors with the autonomy and tools to build successful and impactful educational offerings." }
          ].map((item, index) => (
            <motion.div key={index} variants={featureVariants} transition={{ delay: 0.2 * (index + 1) }}>
              <Card className="bg-secondary border-border h-full hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 hover:border-primary/50">
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-primary/20 rounded-full mb-4 inline-block">
                    <item.icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-primary">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="text-center py-12 bg-secondary rounded-xl border border-border">
        <motion.h2 
            className="text-3xl font-bold text-primary mb-6"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.5, duration: 0.5}}
        >Join the TutorFlow Revolution</motion.h2>
        <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay: 0.7, duration: 0.5}}
        >
            Whether you're an experienced educator or just starting out, TutorFlow provides the tools and support you need to succeed.
        </motion.p>
        <motion.div
            initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay: 0.9, duration: 0.5}}
        >
             <img  
                className="rounded-lg shadow-xl mx-auto w-full max-w-lg h-auto object-cover" 
                alt="Stylized graphic of interconnected nodes representing a learning network"
               src="https://images.unsplash.com/photo-1643101807331-21a4a3f081d5" />
        </motion.div>
      </section>

    </motion.div>
  );
};

export default AboutUsPage;