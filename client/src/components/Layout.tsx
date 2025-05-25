import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useScrollTop } from "@/hooks/useScrollTop";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Use the scroll-to-top hook to ensure page starts at the top when navigating
  useScrollTop();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
