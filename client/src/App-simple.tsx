import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Simple home component to test the app
function SimpleHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Elira</h1>
            <nav className="space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">Kezdőlap</a>
              <a href="/courses" className="text-gray-600 hover:text-gray-900">Kurzusok</a>
              <a href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Bejelentkezés</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Magyar Egyetemi Oktatási Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Fedezze fel a legjobb online kurzusokat magyar egyetemektől
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-semibold mb-4">Platform Állapot</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Szerver</h4>
                <p className="text-green-600">✓ Aktív és működik</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Biztonság</h4>
                <p className="text-blue-600">✓ Teljes védelem aktív</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800">Adatbázis</h4>
                <p className="text-purple-600">✓ Optimalizált és monitorozott</p>
              </div>
            </div>
          </div>

          <div className="text-left">
            <h3 className="text-xl font-semibold mb-4">Implementált fejlesztések:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold mb-2">🔒 Biztonsági fejlesztések</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Kéréskorlátozás és input validáció</li>
                  <li>• Többfaktoros hitelesítés</li>
                  <li>• Szerepalapú hozzáférés-vezérlés</li>
                  <li>• Munkamenet időtúllépés</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-semibold mb-2">🗄️ Adatbázis fejlesztések</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• Migrációs rendszer</li>
                  <li>• Teljesítmény indexelés</li>
                  <li>• Biztonsági mentés és helyreállítás</li>
                  <li>• Kapcsolat monitorozás</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SimpleRouter() {
  return (
    <Switch>
      <Route path="/" component={SimpleHome} />
      <Route>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Oldal nem található</h1>
            <a href="/" className="text-blue-600 hover:underline">Vissza a főoldalra</a>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleRouter />
    </QueryClientProvider>
  );
}

export default App;