import React, { useState, useCallback, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
  SortableContext as SortableContextType,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Users,
  Target,
  Copy,
  Eye,
  Save,
  Undo,
  Redo,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { queryClient, apiRequest } from '@/lib/queryClient';

interface CourseStructureItem {
  id: string;
  type: 'course' | 'module' | 'lesson' | 'sublesson';
  title: string;
  description?: string;
  estimatedDuration?: number; // in minutes
  prerequisites?: string[];
  isExpanded?: boolean;
  children?: CourseStructureItem[];
  order: number;
  parentId?: string;
}

interface HierarchicalCourseBuilderProps {
  courseId: number;
  initialStructure?: CourseStructureItem[];
  onSave?: (structure: CourseStructureItem[]) => void;
}

// History management for undo/redo
interface HistoryState {
  structure: CourseStructureItem[];
  timestamp: number;
}

const MAX_HISTORY_SIZE = 50;

// Sortable Item Component
function SortableItem({ 
  item, 
  level = 0,
  onToggleExpand,
  onEdit,
  onDelete,
  onDuplicate,
  onAddChild,
  selectedItems,
  onToggleSelect,
}: {
  item: CourseStructureItem;
  level?: number;
  onToggleExpand: (id: string) => void;
  onEdit: (item: CourseStructureItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onAddChild: (parentId: string, type: CourseStructureItem['type']) => void;
  selectedItems: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeColor = (type: CourseStructureItem['type']) => {
    switch (type) {
      case 'course': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'module': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'lesson': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'sublesson': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  const canHaveChildren = item.type !== 'sublesson';
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${level > 0 ? 'ml-8' : ''} mb-2`}
    >
      <Card className={`${selectedItems.has(item.id) ? 'ring-2 ring-blue-500' : ''} ${isDragging ? 'shadow-lg' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>

            {/* Selection Checkbox */}
            <input
              type="checkbox"
              checked={selectedItems.has(item.id)}
              onChange={() => onToggleSelect(item.id)}
              className="rounded"
            />

            {/* Expand/Collapse Button */}
            {canHaveChildren && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleExpand(item.id)}
                className="p-1 h-6 w-6"
              >
                {item.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
                <h4 className="font-medium truncate">{item.title}</h4>
                {item.estimatedDuration && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.estimatedDuration}p
                  </Badge>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {item.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(item)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(item.id)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {canHaveChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const nextType = item.type === 'course' ? 'module' : 
                                   item.type === 'module' ? 'lesson' : 'sublesson';
                    onAddChild(item.id, nextType);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(item.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children */}
      {item.isExpanded && hasChildren && (
        <div className="mt-2">
          <SortableContext items={item.children!.map(child => child.id)} strategy={verticalListSortingStrategy}>
            {item.children!.map((child) => (
              <SortableItem
                key={child.id}
                item={child}
                level={level + 1}
                onToggleExpand={onToggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onAddChild={onAddChild}
                selectedItems={selectedItems}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </SortableContext>
        </div>
      )}
    </div>
  );
}

// Item Editor Dialog
function ItemEditor({
  item,
  isOpen,
  onClose,
  onSave,
}: {
  item: CourseStructureItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: CourseStructureItem) => void;
}) {
  const [formData, setFormData] = useState<Partial<CourseStructureItem>>({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const handleSave = () => {
    if (item && formData.title) {
      onSave({ ...item, ...formData } as CourseStructureItem);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.type} szerkesztése</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Cím</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Add meg a címet"
            />
          </div>
          <div>
            <Label htmlFor="description">Leírás</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add meg a leírást"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="duration">Becsült időtartam (perc)</Label>
            <Input
              id="duration"
              type="number"
              value={formData.estimatedDuration || ''}
              onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
              placeholder="Perc"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Mégse
            </Button>
            <Button onClick={handleSave}>
              Mentés
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HierarchicalCourseBuilder({
  courseId,
  initialStructure = [],
  onSave,
}: HierarchicalCourseBuilderProps) {
  const [structure, setStructure] = useState<CourseStructureItem[]>(initialStructure);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<CourseStructureItem | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-save every 30 seconds
  useEffect(() => {
    if (isDirty) {
      const autoSaveTimer = setTimeout(() => {
        handleSave();
      }, 30000);
      return () => clearTimeout(autoSaveTimer);
    }
  }, [structure, isDirty]);

  // Save to history
  const saveToHistory = useCallback((newStructure: CourseStructureItem[]) => {
    const newHistoryState: HistoryState = {
      structure: JSON.parse(JSON.stringify(newStructure)),
      timestamp: Date.now(),
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newHistoryState);
      
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }
      
      return newHistory;
    });
    
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1));
  }, [historyIndex]);

  // Update structure with history
  const updateStructure = useCallback((newStructure: CourseStructureItem[]) => {
    setStructure(newStructure);
    setIsDirty(true);
    saveToHistory(newStructure);
  }, [saveToHistory]);

  // Undo/Redo functions
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setStructure(prevState.structure);
      setHistoryIndex(historyIndex - 1);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setStructure(nextState.structure);
      setHistoryIndex(historyIndex + 1);
      setIsDirty(true);
    }
  }, [history, historyIndex]);

  // Find item in structure by ID
  const findItemById = useCallback((structure: CourseStructureItem[], id: string): CourseStructureItem | null => {
    for (const item of structure) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findItemById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Toggle expand/collapse
  const toggleExpand = useCallback((id: string) => {
    const updateItem = (items: CourseStructureItem[]): CourseStructureItem[] => {
      return items.map(item => {
        if (item.id === id) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };
    
    updateStructure(updateItem(structure));
  }, [structure, updateStructure]);

  // Add new item
  const addItem = useCallback((parentId: string | null, type: CourseStructureItem['type']) => {
    const newItem: CourseStructureItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: `Új ${type}`,
      description: '',
      estimatedDuration: 30,
      order: 0,
      isExpanded: true,
      children: type !== 'sublesson' ? [] : undefined,
      parentId: parentId || undefined,
    };

    if (!parentId) {
      // Add to root
      updateStructure([...structure, { ...newItem, order: structure.length }]);
    } else {
      // Add to parent
      const updateItems = (items: CourseStructureItem[]): CourseStructureItem[] => {
        return items.map(item => {
          if (item.id === parentId) {
            const children = item.children || [];
            return {
              ...item,
              children: [...children, { ...newItem, order: children.length }],
              isExpanded: true,
            };
          }
          if (item.children) {
            return { ...item, children: updateItems(item.children) };
          }
          return item;
        });
      };
      
      updateStructure(updateItems(structure));
    }
  }, [structure, updateStructure]);

  // Delete item
  const deleteItem = useCallback((id: string) => {
    const removeItem = (items: CourseStructureItem[]): CourseStructureItem[] => {
      return items
        .filter(item => item.id !== id)
        .map(item => ({
          ...item,
          children: item.children ? removeItem(item.children) : undefined,
        }));
    };
    
    updateStructure(removeItem(structure));
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  }, [structure, updateStructure]);

  // Duplicate item
  const duplicateItem = useCallback((id: string) => {
    const item = findItemById(structure, id);
    if (!item) return;

    const duplicateWithNewIds = (item: CourseStructureItem): CourseStructureItem => {
      const newItem = {
        ...item,
        id: `${item.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${item.title} (másolat)`,
        children: item.children?.map(duplicateWithNewIds),
      };
      return newItem;
    };

    const newItem = duplicateWithNewIds(item);
    
    if (!item.parentId) {
      updateStructure([...structure, { ...newItem, order: structure.length }]);
    } else {
      const updateItems = (items: CourseStructureItem[]): CourseStructureItem[] => {
        return items.map(parentItem => {
          if (parentItem.id === item.parentId) {
            const children = parentItem.children || [];
            return {
              ...parentItem,
              children: [...children, { ...newItem, order: children.length }],
            };
          }
          if (parentItem.children) {
            return { ...parentItem, children: updateItems(parentItem.children) };
          }
          return parentItem;
        });
      };
      
      updateStructure(updateItems(structure));
    }
  }, [structure, updateStructure, findItemById]);

  // Handle edit
  const handleEdit = useCallback((item: CourseStructureItem) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  }, []);

  // Save edited item
  const handleSaveEdit = useCallback((updatedItem: CourseStructureItem) => {
    const updateItems = (items: CourseStructureItem[]): CourseStructureItem[] => {
      return items.map(item => {
        if (item.id === updatedItem.id) {
          return updatedItem;
        }
        if (item.children) {
          return { ...item, children: updateItems(item.children) };
        }
        return item;
      });
    };
    
    updateStructure(updateItems(structure));
  }, [structure, updateStructure]);

  // Toggle item selection
  const toggleSelect = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  // Save structure
  const handleSave = useCallback(async () => {
    try {
      // Here you would implement the actual save logic to your backend
      if (onSave) {
        onSave(structure);
      }
      
      toast({
        title: "Mentés sikeres",
        description: "A kurzus struktúra sikeresen mentve.",
      });
      
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Mentési hiba",
        description: "A kurzus struktúra mentése sikertelen.",
        variant: "destructive",
      });
    }
  }, [structure, onSave, toast]);

  // Drag and drop handlers
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    // Implementation for drag and drop reordering would go here
    // This is a simplified version - full implementation would handle
    // moving items between different levels and parents
    
    const activeIndex = structure.findIndex(item => item.id === active.id);
    const overIndex = structure.findIndex(item => item.id === over.id);
    
    if (activeIndex !== -1 && overIndex !== -1) {
      updateStructure(arrayMove(structure, activeIndex, overIndex));
    }
  }, [structure, updateStructure]);

  // Get all item IDs for DnD context
  const getAllIds = useCallback((items: CourseStructureItem[]): string[] => {
    let ids: string[] = [];
    items.forEach(item => {
      ids.push(item.id);
      if (item.children) {
        ids = ids.concat(getAllIds(item.children));
      }
    });
    return ids;
  }, []);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Kurzus struktúra</h2>
          {isDirty && (
            <Badge variant="outline" className="text-orange-600">
              Nem mentett változások
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <Undo className="h-4 w-4 mr-1" />
            Visszavonás
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <Redo className="h-4 w-4 mr-1" />
            Újra
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => addItem(null, 'module')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Modul hozzáadása
          </Button>
          <Button onClick={handleSave} disabled={!isDirty}>
            <Save className="h-4 w-4 mr-1" />
            Mentés
          </Button>
        </div>
      </div>

      {/* Structure Tree */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={getAllIds(structure)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {structure.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onToggleExpand={toggleExpand}
                onEdit={handleEdit}
                onDelete={deleteItem}
                onDuplicate={duplicateItem}
                onAddChild={addItem}
                selectedItems={selectedItems}
                onToggleSelect={toggleSelect}
              />
            ))}
            
            {structure.length === 0 && (
              <Card className="p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Üres kurzus struktúra</h3>
                  <p className="mb-4">Kezdd el modulok hozzáadásával a kurzus felépítését.</p>
                  <Button onClick={() => addItem(null, 'module')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Első modul hozzáadása
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* Bulk Actions */}
      {selectedItems.size > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedItems.size} elem kiválasztva</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectedItems.forEach(id => deleteItem(id));
                  setSelectedItems(new Set());
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Törlés
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems(new Set())}
              >
                Kiválasztás megszüntetése
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Item Editor */}
      <ItemEditor
        item={editingItem}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}