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
              <a href="https://facebook.com/elira" target="_blank" rel="noopener noreferrer" className="text-white hover:text-tertiary transition duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/elira" target="_blank" rel="noopener noreferrer" className="text-white hover:text-tertiary transition duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/elira" target="_blank" rel="noopener noreferrer" className="text-white hover:text-tertiary transition duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/elira" target="_blank" rel="noopener noreferrer" className="text-white hover:text-tertiary transition duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/elira" target="_blank" rel="noopener noreferrer" className="text-white hover:text-tertiary transition duration-200">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Elira</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-neutral-400 hover:text-white transition duration-200">Rólunk</Link></li>
              <li><Link href="/how-it-works" className="text-neutral-400 hover:text-white transition duration-200">Mi működik</Link></li>
              <li><Link href="/careers" className="text-neutral-400 hover:text-white transition duration-200">Karrier</Link></li>
              <li><Link href="/catalog" className="text-neutral-400 hover:text-white transition duration-200">Katalógus</Link></li>
              <li><Link href="/courses" className="text-neutral-400 hover:text-white transition duration-200">Kurzusok</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Közösség</h3>
            <ul className="space-y-2">
              <li><Link href="/students" className="text-neutral-400 hover:text-white transition duration-200">Tanulók</Link></li>
              <li><Link href="/partners" className="text-neutral-400 hover:text-white transition duration-200">Partnerek</Link></li>
              <li><Link href="/developers" className="text-neutral-400 hover:text-white transition duration-200">Fejlesztők</Link></li>
              <li><Link href="/instructors" className="text-neutral-400 hover:text-white transition duration-200">Oktatók</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-white transition duration-200">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Támogatás</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-neutral-400 hover:text-white transition duration-200">Súgó központ</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white transition duration-200">Kapcsolat</Link></li>
              <li><Link href="/privacy" className="text-neutral-400 hover:text-white transition duration-200">Adatvédelem</Link></li>
              <li><Link href="/terms" className="text-neutral-400 hover:text-white transition duration-200">Feltételek</Link></li>
              <li><Link href="/accessibility" className="text-neutral-400 hover:text-white transition duration-200">Hozzáférhetőség</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">© 2025 Elira Inc. Minden jog fenntartva.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy-policy" className="text-neutral-500 hover:text-white text-sm transition duration-200">Adatvédelmi irányelvek</Link>
            <Link href="/terms-of-service" className="text-neutral-500 hover:text-white text-sm transition duration-200">Használati feltételek</Link>
            <Link href="/cookie-settings" className="text-neutral-500 hover:text-white text-sm transition duration-200">Cookie-beállítások</Link>
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
