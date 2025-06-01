import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Upload, 
  Eye, 
  Save, 
  FileText,
  Video,
  Image,
  File,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Form validation schemas
const lessonSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Lesson title is required"),
  description: z.string().min(1, "Lesson description is required"),
  content: z.string().min(1, "Lesson content is required"),
  videoUrl: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(0, "Duration must be positive").optional(),
  order: z.number().min(0),
  materials: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.enum(["pdf", "video", "image", "document"])
  })).default([])
});

const moduleSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, "Module title is required"),
  description: z.string().min(1, "Module description is required"),
  order: z.number().min(0),
  lessons: z.array(lessonSchema).default([])
});

const courseFormSchema = z.object({
  title: z.string().min(1, "Course title is required"),
  description: z.string().min(1, "Course description is required"),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  imageUrl: z.string().url("Valid image URL is required"),
  price: z.number().min(0, "Price must be positive"),
  originalPrice: z.number().min(0, "Original price must be positive").optional(),
  universityId: z.number().min(1, "University selection is required"),
  instructorName: z.string().min(1, "Instructor name is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  category: z.string().min(1, "Category is required"),
  duration: z.number().min(1, "Duration is required"),
  language: z.string().default("hu"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).default([]),
  modules: z.array(moduleSchema).default([])
});

type CourseFormData = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  courseId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CourseForm({ courseId, onSuccess, onCancel }: CourseFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Fetch course data for editing
  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ["/api/admin/courses", courseId],
    enabled: !!courseId,
  });

  // Fetch universities for dropdown
  const { data: universities = [] } = useQuery({
    queryKey: ["/api/admin/universities"],
  });

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      imageUrl: "",
      price: 0,
      universityId: 0,
      instructorName: "",
      level: "beginner",
      category: "",
      duration: 0,
      language: "hu",
      status: "draft",
      tags: [],
      modules: []
    }
  });

  const { fields: moduleFields, append: appendModule, remove: removeModule, move: moveModule } = useFieldArray({
    control: form.control,
    name: "modules"
  });

  // Load course data into form when editing
  useEffect(() => {
    if (course && courseId) {
      form.reset({
        title: course.title || "",
        description: course.description || "",
        shortDescription: course.shortDescription || "",
        imageUrl: course.imageUrl || "",
        price: course.price || 0,
        originalPrice: course.originalPrice || undefined,
        universityId: course.universityId || 0,
        instructorName: course.instructorName || "",
        level: course.level || "beginner",
        category: course.category || "",
        duration: course.duration || 0,
        language: course.language || "hu",
        status: course.status || "draft",
        tags: course.tags || [],
        modules: course.modules || []
      });
    }
  }, [course, courseId, form]);

  // Save course mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const url = courseId ? `/api/admin/courses/${courseId}` : "/api/admin/courses";
      const method = courseId ? "PUT" : "POST";
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Course ${courseId ? "updated" : "created"} successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to ${courseId ? "update" : "create"} course: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CourseFormData) => {
    saveMutation.mutate(data);
  };

  const addModule = () => {
    appendModule({
      title: "",
      description: "",
      order: moduleFields.length,
      lessons: []
    });
  };

  const addTag = () => {
    if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  if (isCourseLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {courseId ? "Edit Course" : "Create New Course"}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="Enter course title"
                    />
                    {form.formState.errors.title && (
                      <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      {...form.register("category")}
                      placeholder="e.g. Programming, Design"
                    />
                    {form.formState.errors.category && (
                      <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    {...form.register("shortDescription")}
                    placeholder="Brief course overview (max 200 characters)"
                    maxLength={200}
                  />
                  {form.formState.errors.shortDescription && (
                    <p className="text-sm text-red-500">{form.formState.errors.shortDescription.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Detailed course description"
                    rows={6}
                  />
                  {form.formState.errors.description && (
                    <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (HUF) *</Label>
                    <Input
                      id="price"
                      type="number"
                      {...form.register("price", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (optional)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      {...form.register("originalPrice", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      {...form.register("duration", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    {form.formState.errors.duration && (
                      <p className="text-sm text-red-500">{form.formState.errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="universityId">University *</Label>
                    <Controller
                      name="universityId"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select university" />
                          </SelectTrigger>
                          <SelectContent>
                            {universities.map((uni: any) => (
                              <SelectItem key={uni.id} value={uni.id.toString()}>
                                {uni.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.universityId && (
                      <p className="text-sm text-red-500">{form.formState.errors.universityId.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Level *</Label>
                    <Controller
                      name="level"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructorName">Instructor *</Label>
                    <Input
                      id="instructorName"
                      {...form.register("instructorName")}
                      placeholder="Instructor name"
                    />
                    {form.formState.errors.instructorName && (
                      <p className="text-sm text-red-500">{form.formState.errors.instructorName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Course Image URL *</Label>
                  <Input
                    id="imageUrl"
                    {...form.register("imageUrl")}
                    placeholder="https://example.com/image.jpg"
                  />
                  {form.formState.errors.imageUrl && (
                    <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.watch("tags").map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ModuleManager
              form={form}
              moduleFields={moduleFields}
              addModule={addModule}
              removeModule={removeModule}
              moveModule={moveModule}
            />
          </TabsContent>

          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Upload course materials, resources, and supplementary files. Students will have access to these materials throughout the course.
                  </AlertDescription>
                </Alert>
                {/* File upload functionality would be implemented here */}
                <div className="mt-4 p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">File upload functionality coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Publication Status</Label>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Controller
                    name="language"
                    control={form.control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hu">Hungarian</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-6 border-t">
          <Button
            type="submit"
            disabled={saveMutation.isPending}
            className="min-w-32"
          >
            {saveMutation.isPending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {courseId ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>

      {/* Course Preview Dialog */}
      <CoursePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        courseData={form.getValues()}
      />
    </div>
  );
}

// Module Manager Component
interface ModuleManagerProps {
  form: any;
  moduleFields: any[];
  addModule: () => void;
  removeModule: (index: number) => void;
  moveModule: (from: number, to: number) => void;
}

function ModuleManager({ form, moduleFields, addModule, removeModule, moveModule }: ModuleManagerProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Modules</CardTitle>
        <Button type="button" onClick={addModule} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {moduleFields.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No modules yet. Add your first module to get started.
          </div>
        ) : (
          moduleFields.map((module, moduleIndex) => (
            <ModuleCard
              key={module.id}
              form={form}
              moduleIndex={moduleIndex}
              onRemove={() => removeModule(moduleIndex)}
              onMoveUp={moduleIndex > 0 ? () => moveModule(moduleIndex, moduleIndex - 1) : undefined}
              onMoveDown={moduleIndex < moduleFields.length - 1 ? () => moveModule(moduleIndex, moduleIndex + 1) : undefined}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

// Module Card Component
interface ModuleCardProps {
  form: any;
  moduleIndex: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function ModuleCard({ form, moduleIndex, onRemove, onMoveUp, onMoveDown }: ModuleCardProps) {
  const { fields: lessonFields, append: appendLesson, remove: removeLesson } = useFieldArray({
    control: form.control,
    name: `modules.${moduleIndex}.lessons`
  });

  const addLesson = () => {
    appendLesson({
      title: "",
      description: "",
      content: "",
      videoUrl: "",
      duration: 0,
      order: lessonFields.length,
      materials: []
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <Input
              {...form.register(`modules.${moduleIndex}.title`)}
              placeholder="Module title"
              className="font-medium"
            />
          </div>
          <div className="flex items-center gap-1">
            {onMoveUp && (
              <Button type="button" onClick={onMoveUp} variant="ghost" size="sm">
                <ArrowUp className="w-4 h-4" />
              </Button>
            )}
            {onMoveDown && (
              <Button type="button" onClick={onMoveDown} variant="ghost" size="sm">
                <ArrowDown className="w-4 h-4" />
              </Button>
            )}
            <Button type="button" onClick={onRemove} variant="ghost" size="sm" className="text-red-500">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Textarea
          {...form.register(`modules.${moduleIndex}.description`)}
          placeholder="Module description"
          rows={2}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Lessons</h4>
            <Button type="button" onClick={addLesson} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </div>
          
          {lessonFields.map((lesson, lessonIndex) => (
            <Card key={lesson.id} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <Input
                    {...form.register(`modules.${moduleIndex}.lessons.${lessonIndex}.title`)}
                    placeholder="Lesson title"
                    className="flex-1 mr-2"
                  />
                  <Button
                    type="button"
                    onClick={() => removeLesson(lessonIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Input
                    {...form.register(`modules.${moduleIndex}.lessons.${lessonIndex}.videoUrl`)}
                    placeholder="Video URL (optional)"
                  />
                  <Input
                    {...form.register(`modules.${moduleIndex}.lessons.${lessonIndex}.duration`, { valueAsNumber: true })}
                    type="number"
                    placeholder="Duration (minutes)"
                  />
                </div>
                
                <Textarea
                  {...form.register(`modules.${moduleIndex}.lessons.${lessonIndex}.description`)}
                  placeholder="Lesson description"
                  rows={2}
                  className="mb-3"
                />
                
                <Textarea
                  {...form.register(`modules.${moduleIndex}.lessons.${lessonIndex}.content`)}
                  placeholder="Lesson content"
                  rows={3}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Course Preview Component
interface CoursePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  courseData: CourseFormData;
}

function CoursePreview({ isOpen, onClose, courseData }: CoursePreviewProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Course Preview</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            {courseData.imageUrl ? (
              <img 
                src={courseData.imageUrl} 
                alt={courseData.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-500">No image</div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">{courseData.title || "Course Title"}</h2>
            <p className="text-gray-600 mb-4">{courseData.shortDescription || "Course description"}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <span>Level: {courseData.level}</span>
              <span>Duration: {courseData.duration} hours</span>
              <span>Price: {courseData.price} HUF</span>
              <span>Instructor: {courseData.instructorName}</span>
            </div>
            
            {courseData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {courseData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Course Content</h3>
            {courseData.modules.length > 0 ? (
              <div className="space-y-3">
                {courseData.modules.map((module, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium">{module.title || `Module ${index + 1}`}</h4>
                    <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    {module.lessons.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="text-sm">
                            • {lesson.title || `Lesson ${lessonIndex + 1}`}
                            {lesson.duration && <span className="text-gray-500"> ({lesson.duration} min)</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No modules added yet</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Full Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {courseData.description || "No description provided"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}