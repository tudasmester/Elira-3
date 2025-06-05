# Component Documentation - Elira Platform

## Frontend Component Architecture

The Elira platform follows a modular component architecture with clear separation of concerns and reusable UI components.

## Core Layout Components

### Layout Component
**Location:** `client/src/components/Layout.tsx`

Main application layout wrapper that provides consistent structure across all pages.

**Features:**
- Responsive navigation header
- User authentication status
- Admin panel access
- Mobile-friendly hamburger menu
- Footer with links and information

**Props:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}
```

**Usage:**
```tsx
<Layout>
  <PageContent />
</Layout>
```

### AdminGuard Component
**Location:** `client/src/components/AdminGuard.tsx`

Route protection component that restricts access to admin-only functionality.

**Features:**
- JWT token validation
- Admin role verification
- Automatic redirect for unauthorized users
- Loading states during verification

**Props:**
```typescript
interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

**Implementation:**
```tsx
export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { data: adminStatus, isLoading } = useQuery({
    queryKey: ['/api/admin/check'],
    retry: false
  });

  if (isLoading) return <LoadingSpinner />;
  if (!adminStatus?.isAdmin) return fallback || <Redirect to="/auth" />;
  
  return <>{children}</>;
}
```

## Course Management Components

### CourseOutlineBuilder Component
**Location:** `client/src/pages/CourseOutlineBuilder.tsx`

Main course creation and editing interface for administrators.

**Features:**
- Course metadata management
- Module creation and organization
- Lesson management with drag-and-drop
- Real-time content validation
- Publishing controls

**State Management:**
```typescript
interface CourseBuilderState {
  course: Course | null;
  modules: Module[];
  selectedModule: Module | null;
  isEditing: boolean;
  isDirty: boolean;
}
```

**Key Functions:**
- `handleCourseUpdate()` - Update course information
- `addModule()` - Create new course module
- `reorderModules()` - Drag and drop reordering
- `publishCourse()` - Publish course for students

### LessonEditor Component
**Location:** `client/src/components/LessonEditor.tsx`

Comprehensive lesson editing interface with integrated quiz management.

**Features:**
- Multi-tab interface (Content, Quizzes, Settings)
- Rich text editing for lesson content
- Video URL integration
- File upload support
- Integrated quiz creation and management

**Tab Structure:**
```typescript
type TabType = 'content' | 'quizzes' | 'settings';

const tabs = [
  { id: 'content', label: 'Tartalom', icon: FileText },
  { id: 'quizzes', label: 'Kvízek', icon: HelpCircle },
  { id: 'settings', label: 'Beállítások', icon: Settings }
];
```

**Props:**
```typescript
interface LessonEditorProps {
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: Lesson) => void;
}
```

## Quiz System Components

### QuizManager Component
**Location:** `client/src/components/QuizManager.tsx`

Integrated quiz management within the lesson editor workflow.

**Features:**
- Quiz creation and editing
- Question management
- Multiple question types support
- Quiz settings configuration
- Preview functionality

**Question Types Supported:**
```typescript
const questionTypes = [
  { value: 'multiple_choice', label: 'Feleletválasztós' },
  { value: 'true_false', label: 'Igaz/Hamis' },
  { value: 'short_text', label: 'Rövid szöveg' },
  { value: 'long_text', label: 'Hosszú szöveg' },
  { value: 'file_upload', label: 'Fájl feltöltés' }
];
```

**State Structure:**
```typescript
interface QuizManagerState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  questions: QuizQuestion[];
  isCreating: boolean;
  activeTab: 'list' | 'create' | 'edit';
}
```

### QuestionEditor Component
**Location:** `client/src/components/QuestionEditor.tsx`

Individual question creation and editing interface.

**Features:**
- Dynamic question type rendering
- Option management for multiple choice
- Point allocation
- Question reordering
- Rich text support for questions

**Question Creation Flow:**
```typescript
const createQuestion = async (questionData: CreateQuestionData) => {
  // 1. Validate question data
  const validatedData = questionSchema.parse(questionData);
  
  // 2. Create question
  const question = await createQuizQuestion(validatedData);
  
  // 3. Create options if multiple choice
  if (questionData.type === 'multiple_choice') {
    await createQuestionOptions(question.id, questionData.options);
  }
  
  // 4. Update UI state
  refetchQuestions();
};
```

## Authentication Components

### AuthForm Component
**Location:** `client/src/components/AuthForm.tsx`

Unified authentication form supporting both login and registration.

**Features:**
- Toggle between login/register modes
- Form validation with Zod schemas
- Social authentication integration
- Password strength indicators
- Error handling and display

**Form Schema:**
```typescript
const authSchema = z.object({
  email: z.string().email('Érvényes email címet adjon meg'),
  password: z.string().min(8, 'A jelszó legalább 8 karakter legyen'),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional()
});
```

### UserProfile Component
**Location:** `client/src/components/UserProfile.tsx`

User profile management and settings interface.

**Features:**
- Profile information editing
- Password change functionality
- Profile image upload
- Subscription management
- Account settings

## UI Component Library

### Form Components

#### FormField Component
Standardized form field wrapper with validation support.

```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

#### ValidatedInput Component
Input component with integrated validation and error display.

```typescript
interface ValidatedInputProps extends InputProps {
  validation?: ZodSchema;
  onValidation?: (isValid: boolean) => void;
}
```

### Data Display Components

#### CourseCard Component
**Location:** `client/src/components/CourseCard.tsx`

Reusable course display card for lists and grids.

**Features:**
- Course thumbnail display
- Price and discount information
- Enrollment status
- Quick action buttons
- Responsive design

**Props:**
```typescript
interface CourseCardProps {
  course: Course;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
  onEnroll?: (courseId: number) => void;
}
```

#### DataTable Component
**Location:** `client/src/components/DataTable.tsx`

Generic data table with sorting, filtering, and pagination.

**Features:**
- Column configuration
- Sort and filter controls
- Pagination support
- Row selection
- Action buttons

**Configuration:**
```typescript
interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}
```

### Modal Components

#### ConfirmDialog Component
Reusable confirmation dialog for destructive actions.

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}
```

#### LoadingModal Component
Loading state modal for long-running operations.

```typescript
interface LoadingModalProps {
  isOpen: boolean;
  message?: string;
  progress?: number;
}
```

## Hook Documentation

### Custom Hooks

#### useAuth Hook
**Location:** `client/src/hooks/useAuth.tsx`

Authentication state management hook.

```typescript
interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
}
```

#### useAdmin Hook
Administrative functionality hook.

```typescript
interface UseAdminReturn {
  isAdmin: boolean;
  isLoading: boolean;
  adminData: AdminData | null;
}
```

#### useCourseBuilder Hook
Course building functionality hook.

```typescript
interface UseCourseBuilderReturn {
  course: Course | null;
  modules: Module[];
  lessons: Lesson[];
  createModule: (data: CreateModuleData) => Promise<Module>;
  updateModule: (id: number, data: UpdateModuleData) => Promise<Module>;
  deleteModule: (id: number) => Promise<void>;
  reorderModules: (moduleIds: number[]) => Promise<void>;
}
```

#### useQuizBuilder Hook
Quiz creation and management hook.

```typescript
interface UseQuizBuilderReturn {
  quizzes: Quiz[];
  questions: QuizQuestion[];
  createQuiz: (data: CreateQuizData) => Promise<Quiz>;
  updateQuiz: (id: number, data: UpdateQuizData) => Promise<Quiz>;
  deleteQuiz: (id: number) => Promise<void>;
  createQuestion: (data: CreateQuestionData) => Promise<QuizQuestion>;
  updateQuestion: (id: number, data: UpdateQuestionData) => Promise<QuizQuestion>;
  deleteQuestion: (id: number) => Promise<void>;
}
```

## State Management Patterns

### React Query Integration

#### Query Configuration
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.status === 401) return false;
        return failureCount < 3;
      }
    }
  }
});
```

#### Mutation Patterns
```typescript
const useCreateCourse = () => {
  return useMutation({
    mutationFn: (courseData: CreateCourseData) => 
      apiRequest('POST', '/api/admin/courses', courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({ title: 'Kurzus sikeresen létrehozva' });
    },
    onError: (error) => {
      toast({ 
        title: 'Hiba történt', 
        description: error.message,
        variant: 'destructive' 
      });
    }
  });
};
```

### Local State Management

#### Form State Pattern
```typescript
const useFormState = <T>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = (field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (schema: ZodSchema<T>) => {
    try {
      schema.parse(values);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Partial<Record<keyof T, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof T] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  return { values, errors, isDirty, updateField, validate, setValues };
};
```

## Error Handling Patterns

### Component Error Boundaries
```typescript
class ComponentErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
```

### API Error Handling
```typescript
const apiRequest = async (method: string, url: string, data?: any) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: data ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Hálózati hiba történt');
    }
    throw error;
  }
};
```

## Performance Optimization

### Component Memoization
```typescript
const ExpensiveComponent = React.memo(({ data, onUpdate }: Props) => {
  return <ComplexRender data={data} onUpdate={onUpdate} />;
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id;
});
```

### Lazy Loading
```typescript
const LazyAdminPanel = React.lazy(() => import('./AdminPanel'));
const LazyQuizBuilder = React.lazy(() => import('./QuizBuilder'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/admin" component={LazyAdminPanel} />
        <Route path="/quiz-builder" component={LazyQuizBuilder} />
      </Switch>
    </Suspense>
  );
}
```

This component documentation provides comprehensive coverage of the frontend architecture, component patterns, and implementation details for the Elira platform.