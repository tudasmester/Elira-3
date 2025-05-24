import React from "react";
import { ArrowRight } from "lucide-react";
import { careers } from "@/data/careers";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CareerPaths: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Launch a new career in as little as 6 months</h2>
          <p className="text-neutral-600 mb-8">View our career programs</p>
        </motion.div>

        <div className="bg-neutral-900 rounded-xl p-6 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Career Information Section */}
            <div className="lg:col-span-2 text-white">
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-neutral-400">Project manager</span>
                    <span className="text-sm text-neutral-400">In-demand job</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">Project manager</h3>
                <p className="text-sm text-neutral-300">A project manager oversees business projects from start to finish</p>
                <div className="text-sm text-neutral-400">Median salary</div>
                <div className="text-xl font-semibold">$75,000</div>
                
                <div className="pt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-md w-full">
                    Project manager
                  </Button>
                </div>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="lg:col-span-3">
              <div className="text-white mb-3">
                <h4 className="text-lg font-semibold">Recommended Professional Certificates</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Certificate Card 1 */}
                <div className="bg-neutral-800 rounded-lg overflow-hidden flex">
                  <div className="w-2/5">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                      alt="Google Project Management" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-3/5 p-3">
                    <div className="text-xs text-neutral-400">Google</div>
                    <div className="text-sm font-medium text-white">Google Project Management: Professional Certificate</div>
                    <div className="mt-2 flex items-center text-xs text-neutral-400">
                      <span className="mr-2">4.9</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Card 2 */}
                <div className="bg-neutral-800 rounded-lg overflow-hidden flex">
                  <div className="w-2/5">
                    <img 
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                      alt="Google IT Support" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-3/5 p-3">
                    <div className="text-xs text-neutral-400">Google</div>
                    <div className="text-sm font-medium text-white">Google IT Support Professional Certificate</div>
                    <div className="mt-2 flex items-center text-xs text-neutral-400">
                      <span className="mr-2">4.8</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;
