import React from "react";
import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube 
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold font-heading mb-4">Elira</h2>
            <p className="text-neutral-400 mb-6">Tanuljon korlátok nélkül világszínvonalú egyetemek és vállalatok kurzusaival.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-tertiary transition duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-tertiary transition duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-tertiary transition duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-tertiary transition duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-tertiary transition duration-200">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Elira</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Rólunk</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Mi működik</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Karrier</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Katalógus</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Kurzusok</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Közösség</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Tanulók</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Partnerek</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Fejlesztők</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Oktatók</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Támogatás</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Súgó központ</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Kapcsolat</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Adatvédelem</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Feltételek</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition duration-200">Hozzáférhetőség</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">© 2025 Elira Inc. Minden jog fenntartva.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="text-neutral-500 hover:text-white text-sm transition duration-200">Adatvédelmi irányelvek</a>
            <a href="#" className="text-neutral-500 hover:text-white text-sm transition duration-200">Használati feltételek</a>
            <a href="#" className="text-neutral-500 hover:text-white text-sm transition duration-200">Cookie-beállítások</a>
            <div className="flex items-center space-x-2">
              <span className="text-neutral-500 text-sm">Nyelv:</span>
              <select className="bg-neutral-800 text-neutral-400 text-sm py-1 px-2 rounded border border-neutral-700 focus:outline-none">
                <option value="hu">Magyar</option>
                <option value="en">English</option>
                <option value="de">Deutsch</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
