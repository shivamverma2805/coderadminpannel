import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, XCircle, Save, ArrowLeft, Image as ImageIcon, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { CourseContext } from '@/contexts/CourseContext';

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { fetchCourseById, updateCourse, isLoading: isCourseLoading } = useContext(CourseContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState([{ name: '', content: '' }]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [courseExists, setCourseExists] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      setIsLoadingPage(true);
      const courseToEdit = await fetchCourseById(courseId);
      if (courseToEdit) {
        setTitle(courseToEdit.title);
        setDescription(courseToEdit.description);
        setImageUrl(courseToEdit.image_url || '');
        setDuration(courseToEdit.duration || '');
        setTopics(courseToEdit.topics && courseToEdit.topics.length > 0 ? courseToEdit.topics : [{ name: '', content: '' }]);
        setCourseExists(true);
      } else {
        setCourseExists(false);
        toast({
          title: "Course Not Found",
          description: "The requested course could not be found. Redirecting...",
          variant: "destructive",
        });
        navigate('/admin/my-courses');
      }
      setIsLoadingPage(false);
    };
    loadCourse();
  }, [courseId, fetchCourseById, navigate, toast]);


  const handleAddTopic = () => {
    setTopics([...topics, { name: '', content: '' }]);
  };

  const handleRemoveTopic = (index) => {
    const newTopics = topics.filter((_, i) => i !== index);
    setTopics(newTopics);
  };

  const handleTopicChange = (index, field, value) => {
    const newTopics = topics.map((topic, i) => {
      if (i === index) {
        return { ...topic, [field]: value };
      }
      return topic;
    });
    setTopics(newTopics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || !duration || topics.some(t => !t.name || !t.content)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all course details, image, duration, and topic fields.",
        variant: "destructive",
      });
      return;
    }

    const updatedCourseData = {
      title,
      description,
      image_url: imageUrl,
      duration,
      topics,
    };
    const success = await updateCourse(courseId, updatedCourseData);
    if (success) {
      toast({
        title: "Course Updated!",
        description: `"${title}" has been successfully updated.`,
        className: "bg-green-500 text-primary-foreground"
      });
      navigate('/admin/my-courses');
    } else {
       toast({
        title: "Update Failed",
        description: "Could not update the course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const pageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoadingPage) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-xl text-foreground">Loading course data...</p>
      </div>
    );
  }
  if (!courseExists) {
     return <div className="flex justify-center items-center h-full"><p className="text-destructive text-xl">Course not found.</p></div>;
  }


  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-3xl mx-auto"
    >
      <Button variant="ghost" onClick={() => navigate('/admin/my-courses')} className="mb-4 text-primary hover:text-accent hover:bg-primary/10">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to My Courses
      </Button>
      <Card className="bg-secondary border-border shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold gradient-text">Edit Course</CardTitle>
          <CardDescription className="text-muted-foreground">
            Refine your course details. Every update makes it better!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-lg font-semibold text-primary/90">Course Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Advanced JavaScript Techniques"
                className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-lg font-semibold text-primary/90">Course Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A detailed description of the course content and learning outcomes."
                className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                rows={4}
                required
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="imageUrl" className="text-lg font-semibold text-primary/90 flex items-center">
                  <ImageIcon className="h-5 w-5 mr-2 text-accent" /> Course Image URL
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/your-course-image.jpg"
                  className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration" className="text-lg font-semibold text-primary/90 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-accent" /> Course Duration
                </Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 6 Weeks, 24 Hours"
                  className="mt-1 bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>


            <div className="space-y-4 pt-2 border-t border-border/50">
              <h3 className="text-xl font-semibold text-primary/90 pt-2">Topics</h3>
              {topics.map((topic, index) => (
                <motion.div 
                  key={index} 
                  className="p-4 border border-border rounded-lg space-y-3 bg-background/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05}}
                >
                  <div className="flex justify-between items-center">
                    <Label htmlFor={`topic-name-${index}`} className="text-md font-medium text-accent">Topic {index + 1}</Label>
                    {topics.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTopic(index)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="h-5 w-5 mr-1" /> Remove
                      </Button>
                    )}
                  </div>
                  <Input
                    id={`topic-name-${index}`}
                    value={topic.name}
                    onChange={(e) => handleTopicChange(index, 'name', e.target.value)}
                    placeholder="Topic Title (e.g., Asynchronous JavaScript)"
                     className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                     required
                  />
                  <Textarea
                    id={`topic-content-${index}`}
                    value={topic.content}
                    onChange={(e) => handleTopicChange(index, 'content', e.target.value)}
                    placeholder="Detailed content for this topic..."
                    className="bg-background border-border focus:ring-primary text-foreground placeholder:text-muted-foreground"
                    rows={3}
                    required
                  />
                </motion.div>
              ))}
              <Button
                type="button"
                onClick={handleAddTopic}
                variant="outline"
                className="w-full border-dashed border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <PlusCircle className="h-5 w-5 mr-2" /> Add Another Topic
              </Button>
            </div>

            <div className="flex justify-end pt-6 border-t border-border/50">
              <Button type="submit" size="lg" className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:from-primary/90 hover:to-accent/90 transition-all transform hover:scale-105 shadow-lg" disabled={isCourseLoading}>
                {isCourseLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save className="h-5 w-5 mr-2" />
                )}
                {isCourseLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EditCoursePage;