import React from "react";
import { Bell, Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-primary text-2xl font-bold font-heading">Elira</div>
              <nav className="ml-10 hidden md:flex space-x-8">
                <a href="#" className="text-neutral-700 hover:text-primary font-medium">Felfedezés</a>
                <a href="#" className="text-neutral-700 hover:text-primary font-medium">Kurzusaim</a>
                <a href="#" className="text-neutral-700 hover:text-primary font-medium">Tananyagtár</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Keresés..."
                  className="pl-10 pr-4 py-2 border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100">
                <Bell className="h-5 w-5" />
              </button>
              <div className="relative">
                <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white">
                  <User className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl text-white p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Üdvözöljük az Elira platformon! 👋</h1>
              <p className="text-white/90 mb-4">Örülünk, hogy csatlakozott! Fedezze fel a kurzusainkat és kezdje el tanulási útját.</p>
              <div className="flex space-x-4">
                <Button variant="secondary" className="text-primary">Ajánlott kurzusok</Button>
                <Button variant="whiteOutline">Profilom kitöltése</Button>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300" 
                alt="Learning" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Teendők</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Profil befejezése</h3>
                <p className="text-sm text-neutral-500">Adja meg tanulási preferenciáit a személyre szabott élményért</p>
              </div>
              <Button size="sm">Befejezés</Button>
            </div>
            <div className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="h-8 w-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mr-4">
                <Search className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Első kurzus felfedezése</h3>
                <p className="text-sm text-neutral-500">Fedezze fel a kurzusokat és iratkozzon fel az elsőre</p>
              </div>
              <Button size="sm">Felfedezés</Button>
            </div>
          </div>
        </div>

        {/* Recommended Courses */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajánlott kurzusok</h2>
            <a href="#" className="text-primary hover:underline text-sm font-medium">Összes megtekintése</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="relative">
                  <img 
                    src={`https://images.unsplash.com/photo-${1550000000000 + item * 100}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300`} 
                    alt="Course" 
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-tertiary text-tertiary-foreground text-xs font-bold px-2 py-1 rounded">Népszerű</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-neutral-200 mr-2"></div>
                    <span className="text-sm text-neutral-600">BME</span>
                  </div>
                  <h3 className="font-bold mb-1">Programozás alapjai Python nyelven</h3>
                  <p className="text-sm text-neutral-500 mb-4">Kezdő • 8 hét • Magyar nyelven</p>
                  <Button className="w-full">Megtekintés</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Learning */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Kezdjen el tanulni</h2>
            <a href="#" className="text-primary hover:underline text-sm font-medium">Összes megtekintése</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="flex bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="w-1/3">
                  <img 
                    src={`https://images.unsplash.com/photo-${1560000000000 + item * 100}?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200`} 
                    alt="Learning path" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4">
                  <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">Tanulási út</span>
                  <h3 className="font-bold mt-2 mb-1">Webfejlesztés mesterfokon</h3>
                  <p className="text-sm text-neutral-500 mb-2">10 kurzus • 6 hónap</p>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mb-3">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">0/10 kurzus teljesítve</span>
                    <Button size="sm" variant="outline">Folytatás</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;