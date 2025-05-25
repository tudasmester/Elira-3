import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Search } from 'lucide-react';
import { courses } from '@/data/courses';
import { degrees } from '@/data/degrees';
import { Badge } from '@/components/ui/badge';

export interface SearchResult {
  id: number;
  title: string;
  type: 'course' | 'degree';
  category?: string;
  universityName?: string;
  level?: string;
  imageUrl: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  isLoading: boolean;
  onResultClick: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  query, 
  isLoading,
  onResultClick
}) => {
  if (query.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-[70vh] overflow-y-auto z-50"
    >
      <div className="p-2">
        {isLoading ? (
          <div className="p-4 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full mr-2"></div>
            <span className="text-neutral-600">Keresés...</span>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="text-xs font-medium text-neutral-500 px-3 py-2">
              {results.length} találat erre: "{query}"
            </div>
            <div className="space-y-1">
              {results.map((result) => (
                <Link 
                  key={`${result.type}-${result.id}`} 
                  href={result.type === 'course' ? `/course/${result.id}` : `/degree/${result.id}`}
                  onClick={onResultClick}
                >
                  <div className="flex items-start p-2 hover:bg-neutral-50 rounded-md transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-neutral-100">
                      <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-3 flex-grow min-w-0">
                      <div className="flex items-center">
                        {result.type === 'course' ? (
                          <BookOpen className="h-3.5 w-3.5 text-primary mr-1.5" />
                        ) : (
                          <GraduationCap className="h-3.5 w-3.5 text-primary mr-1.5" />
                        )}
                        <span className="text-xs text-primary font-medium">
                          {result.type === 'course' ? 'Kurzus' : 'Diplomaprogram'}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-neutral-800 truncate">{result.title}</h4>
                      <div className="flex items-center mt-1">
                        {result.category && (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-neutral-200 mr-2">
                            {result.category}
                          </Badge>
                        )}
                        {result.universityName && (
                          <span className="text-xs text-neutral-500 truncate">{result.universityName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-3 py-2 border-t border-neutral-100 mt-1">
              <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={onResultClick}>
                <div className="flex items-center justify-center text-sm text-primary hover:text-primary/80 transition-colors cursor-pointer">
                  <Search className="h-3.5 w-3.5 mr-1.5" />
                  <span>További találatok megtekintése</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-neutral-600">Nincs találat erre: "{query}"</p>
            <p className="text-neutral-500 text-sm mt-1">Próbáljon meg más kulcsszavakat használni</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchResults;