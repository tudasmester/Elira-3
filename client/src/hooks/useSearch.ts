import { useState, useEffect, useRef } from 'react';
import { courses } from '@/data/courses';
import { degrees } from '@/data/degrees';
import { universities } from '@/data/universities';
import type { SearchResult } from '@/components/SearchResults';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Generate search results based on query
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Simulate API search delay
    searchTimeout.current = setTimeout(() => {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      
      // Search courses
      const courseResults = courses
        .filter(course => {
          return (
            course.title.toLowerCase().includes(normalizedQuery) ||
            course.description.toLowerCase().includes(normalizedQuery) ||
            course.category.toLowerCase().includes(normalizedQuery)
          );
        })
        .map(course => {
          return {
            id: course.id,
            title: course.title,
            type: 'course' as const,
            category: course.category,
            universityName: course.university,
            imageUrl: course.imageUrl
          };
        });
      
      // Search degrees
      const degreeResults = degrees
        .filter(degree => {
          return (
            degree.name.toLowerCase().includes(normalizedQuery) ||
            degree.description.toLowerCase().includes(normalizedQuery)
          );
        })
        .map(degree => {
          const universityObj = universities.find(u => u.id === degree.universityId);
          const degreeLevel = {
            'bachelor': 'Alapképzés',
            'master': 'Mesterképzés',
            'phd': 'Doktori képzés',
            'specialization': 'Szakirányú továbbképzés',
            'advanced-vocational': 'Felsőoktatási szakképzés'
          }[degree.level] || degree.level;
          
          return {
            id: degree.id,
            title: degree.name,
            type: 'degree' as const,
            level: degreeLevel,
            universityName: universityObj?.name,
            imageUrl: degree.imageUrl
          };
        });
      
      // Combine and limit results
      const combinedResults = [...courseResults, ...degreeResults].slice(0, 8);
      setResults(combinedResults);
      setIsLoading(false);
    }, 300); // 300ms delay for performance
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
      setIsSearchOpen(true);
    } else {
      setResults([]);
      setIsSearchOpen(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  return {
    query,
    setQuery,
    results,
    isLoading,
    isSearchOpen,
    setIsSearchOpen,
    closeSearch,
    openSearch
  };
};