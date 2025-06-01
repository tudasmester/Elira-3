import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Filter, X, Clock, Star, BookOpen, Users, 
  GraduationCap, TrendingUp, Calendar, ChevronDown,
  SlidersHorizontal, MapPin, Globe, Award
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { EliraSearchLoader } from "@/components/EliraLoader";

interface SearchFilters {
  category: string[];
  level: string[];
  duration: string[];
  university: string[];
  language: string[];
  price: string[];
  rating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchResult {
  id: string;
  type: 'course' | 'discussion' | 'content';
  title: string;
  description: string;
  category: string;
  level: string;
  duration?: string;
  university?: string;
  rating?: number;
  price?: number;
  imageUrl?: string;
  enrollmentCount?: number;
  lastUpdated?: string;
}

const SearchSystem: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    level: [],
    duration: [],
    university: [],
    language: [],
    price: [],
    rating: 0,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const availableFilters = {
    categories: [
      "Informatika", "Üzleti tudományok", "Mérnöki tudományok", 
      "Orvostudomány", "Jog", "Természettudományok", "Társadalomtudományok",
      "Művészetek", "Pszichológia", "Marketing", "Pénzügyek"
    ],
    levels: ["Kezdő", "Haladó", "Szakértő", "Minden szint"],
    durations: ["1-4 hét", "1-3 hónap", "3-6 hónap", "6+ hónap"],
    universities: [
      "ELTE", "BME", "SZTE", "DE", "PTE", "Corvinus", 
      "Óbudai Egyetem", "Semmelweis Egyetem"
    ],
    languages: ["Magyar", "Angol", "Német", "Francia"],
    priceRanges: ["Ingyenes", "0-50.000 Ft", "50.000-100.000 Ft", "100.000+ Ft"],
    sortOptions: [
      { value: 'relevance', label: 'Relevancia' },
      { value: 'rating', label: 'Értékelés' },
      { value: 'enrollment', label: 'Népszerűség' },
      { value: 'recent', label: 'Legújabb' },
      { value: 'alphabetical', label: 'Ábécé' },
      { value: 'price', label: 'Ár' }
    ]
  };

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedSearchQuery, filters],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) return [];
      
      const searchParams = new URLSearchParams({
        q: debouncedSearchQuery,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            acc[key] = value.join(',');
          } else if (typeof value === 'string' && value) {
            acc[key] = value;
          } else if (typeof value === 'number' && value > 0) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      });

      const response = await fetch(`/api/search?${searchParams}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    },
    enabled: debouncedSearchQuery.length > 0
  });

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      if (Array.isArray(prev[filterType])) {
        const currentArray = prev[filterType] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        return { ...prev, [filterType]: newArray };
      }
      return { ...prev, [filterType]: value };
    });
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      level: [],
      duration: [],
      university: [],
      language: [],
      price: [],
      rating: 0,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      if (typeof filter === 'string' && filter !== 'relevance') return count + 1;
      if (typeof filter === 'number' && filter > 0) return count + 1;
      return count;
    }, 0);
  };

  const renderSearchResult = (result: SearchResult) => (
    <motion.div
      key={result.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {result.type === 'course' ? 'Kurzus' : 
                   result.type === 'discussion' ? 'Beszélgetés' : 'Tartalom'}
                </Badge>
                {result.university && (
                  <Badge variant="outline" className="text-xs">
                    {result.university}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg mb-1">{result.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {result.description}
              </CardDescription>
            </div>
            {result.imageUrl && (
              <img 
                src={result.imageUrl} 
                alt={result.title}
                className="w-16 h-16 rounded-lg object-cover ml-4"
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              {result.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{result.rating.toFixed(1)}</span>
                </div>
              )}
              
              {result.enrollmentCount && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{result.enrollmentCount.toLocaleString()}</span>
                </div>
              )}
              
              {result.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{result.duration}</span>
                </div>
              )}
            </div>
            
            {result.price !== undefined && (
              <div className="font-medium text-green-600">
                {result.price === 0 ? 'Ingyenes' : `${result.price.toLocaleString()} Ft`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Keresés a platformon
        </h1>
        <p className="text-gray-600">
          Találja meg a megfelelő kurzusokat, tartalmakat és beszélgetéseket
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Keresés kurzusok, tartalmak és beszélgetések között..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 text-lg"
          />
        </div>
      </div>

      {/* Filter Toggle and Active Filters */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Szűrők
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>

        {getActiveFilterCount() > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-1" />
            Szűrők törlése
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Kategória</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableFilters.categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.category.includes(category)}
                          onCheckedChange={() => handleFilterChange('category', category)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Szint</Label>
                  <div className="space-y-2">
                    {availableFilters.levels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level}`}
                          checked={filters.level.includes(level)}
                          onCheckedChange={() => handleFilterChange('level', level)}
                        />
                        <Label htmlFor={`level-${level}`} className="text-sm">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Időtartam</Label>
                  <div className="space-y-2">
                    {availableFilters.durations.map((duration) => (
                      <div key={duration} className="flex items-center space-x-2">
                        <Checkbox
                          id={`duration-${duration}`}
                          checked={filters.duration.includes(duration)}
                          onCheckedChange={() => handleFilterChange('duration', duration)}
                        />
                        <Label htmlFor={`duration-${duration}`} className="text-sm">
                          {duration}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* University Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Egyetem</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableFilters.universities.map((university) => (
                      <div key={university} className="flex items-center space-x-2">
                        <Checkbox
                          id={`university-${university}`}
                          checked={filters.university.includes(university)}
                          onCheckedChange={() => handleFilterChange('university', university)}
                        />
                        <Label htmlFor={`university-${university}`} className="text-sm">
                          {university}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Ár</Label>
                  <div className="space-y-2">
                    {availableFilters.priceRanges.map((priceRange) => (
                      <div key={priceRange} className="flex items-center space-x-2">
                        <Checkbox
                          id={`price-${priceRange}`}
                          checked={filters.price.includes(priceRange)}
                          onCheckedChange={() => handleFilterChange('price', priceRange)}
                        />
                        <Label htmlFor={`price-${priceRange}`} className="text-sm">
                          {priceRange}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Rendezés</Label>
                  <Select 
                    value={filters.sortBy} 
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters.sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <div className="space-y-4">
        {searchQuery && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Keresési eredmények "{searchQuery}" kifejezésre
            </h2>
            {searchResults && (
              <span className="text-gray-600">
                {searchResults.length} találat
              </span>
            )}
          </div>
        )}

        {isLoading && searchQuery && (
          <EliraSearchLoader />
        )}

        {searchResults && searchResults.length === 0 && searchQuery && !isLoading && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nem találtunk eredményt
            </h3>
            <p className="text-gray-600">
              Próbáljon meg más keresési kifejezést vagy módosítsa a szűrőket
            </p>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map(renderSearchResult)}
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Kezdjen el keresni
            </h3>
            <p className="text-gray-600">
              Adjon meg egy keresési kifejezést a kurzusok, tartalmak és beszélgetések között való kereséshez
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSystem;