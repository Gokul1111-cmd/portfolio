import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

const defaultApproachContent = {
  title: "My Approach",
  description: "I follow a structured methodology to ensure quality, scalability, and user satisfaction in every project.",
  steps: [
    { number: 1, title: "Understanding", description: "Deep dive into requirements and project goals" },
    { number: 2, title: "Planning", description: "Strategic roadmap and architecture design" },
    { number: 3, title: "Development", description: "Clean, scalable code implementation" },
    { number: 4, title: "Testing", description: "Rigorous QA and performance optimization" },
    { number: 5, title: "Deployment", description: "Smooth launch and continuous monitoring" }
  ]
};

export const MyApproach = () => {
  const [approachContent, setApproachContent] = useState(defaultApproachContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApproach = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch('/api/content?key=approach');
        if (!res.ok) throw new Error('Failed to fetch approach');
        const data = await res.json();
        if (data && data.data) {
          setApproachContent({
            title: data.data.title || defaultApproachContent.title,
            description: data.data.description || defaultApproachContent.description,
            steps: Array.isArray(data.data.steps) && data.data.steps.length ? data.data.steps : defaultApproachContent.steps
          });
        } else {
          setApproachContent(defaultApproachContent);
        }
      } catch (err) {
        console.error('Approach fetch failed', err);
        setApproachContent(defaultApproachContent);
        setError('Unable to load approach content. Showing defaults.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApproach();
  }, []);

  if (isLoading) {
    return (
      <section id="approach" className="relative py-28 px-4 bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">Loading...</div>
      </section>
    );
  }

  return (
    <section id="approach" className="relative py-28 px-4 bg-gradient-to-br from-background via-secondary/5 to-background overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center gap-2">
            <Sparkles className="text-primary" /> {approachContent.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {approachContent.description}
          </p>
          {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20 transform -translate-x-1/2" />

          <div className="space-y-8 md:space-y-12">
            <AnimatePresence>
              {(approachContent.steps || []).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-6 md:gap-12 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Step Content */}
                  <div className="flex-1">
                    <motion.div
                      className="bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 border border-primary/30">
                            <span className="text-lg font-bold text-primary">{step.number}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Circle Indicator */}
                  <div className="hidden md:flex items-center justify-center flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
                      <div className="relative flex items-center justify-center h-12 w-12 rounded-full bg-card border-2 border-primary shadow-lg">
                        <CheckCircle2 size={24} className="text-primary" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Empty space */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 text-center"
        >
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 font-semibold hover:scale-105">
            Let's Work Together
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MyApproach;
