import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Damian K.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    quote: "Thanks to the content and help of my instructors, I was able to learn at my own pace. With the knowledge I gained, I feel more comfortable in my role and industry."
  },
  {
    id: 2,
    name: "Ramm D.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    quote: "I've always wanted to become a designer, but never knew how to start. The courses on Coursera have given me the foundation I needed to pursue my dream career."
  },
  {
    id: 3,
    name: "Nana C.",
    image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
    quote: "Everyone was very supportive, and the course content was exceptional. The hands-on projects prepared me for real-world challenges in my job."
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">From the community</h2>
          <p className="text-neutral-600">Over 100 million people have already joined Coursera</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h3 className="text-lg font-bold mb-2">{testimonial.name}</h3>
              <p className="text-neutral-600 text-sm">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;