import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import logo from "../assets/academion2.png";

const Navbar: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto">
        {/* Main Navigation */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <img src={logo} alt="Academion logo" className="h-8" />
            </Link>
            <div className="relative ml-6">
              <button className="flex items-center text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                <span>Felfedezés</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl px-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Mit szeretne tanulni?"
                className="w-full pl-10 pr-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-neutral-500">
                <Search className="h-4 w-4" />
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Online diplomák</a>
            <a href="#" className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Karrierek</a>
            <a href="#" className="text-neutral-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">Bejelentkezés</a>
            <Button className="bg-primary hover:bg-primary/90 text-white">Csatlakozzon ingyen</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
