import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Hiba!",
        description: "Kérjük, adjon meg egy érvényes e-mail címet.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Sikeres feliratkozás!",
      description: "Köszönjük, hogy feliratkozott hírlevelünkre.",
    });
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-r from-primary to-teal-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold font-heading mb-4"
        >
          Iratkozzon fel hírlevelünkre
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-white/80 mb-8 max-w-2xl mx-auto"
        >
          Kapjon értesítéseket az új kurzusokról, speciális ajánlatokról és izgalmas oktatási lehetőségekről.
        </motion.p>
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Input
            type="email"
            placeholder="E-mail cím"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-md text-neutral-800 focus:outline-none focus:ring-2 focus:ring-white sm:w-80"
          />
          <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-neutral-100">
            Feliratkozás
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default NewsletterCTA;
