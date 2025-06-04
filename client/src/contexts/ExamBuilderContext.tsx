import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Quiz, QuizQuestion, QuizQuestionOption } from '@shared/schema';

// Types for the context
export interface ExamBuilderState {
  currentCourse: any | null;
  currentExam: Quiz | null;
  questions: (QuizQuestion & { options?: QuizQuestionOption[] })[];
  isLoading: boolean;
  error: string | null;
  editingQuestion: QuizQuestion | null;
  showQuestionEditor: boolean;
  showExamSettings: boolean;
  validationResult: any | null;
}

export type ExamBuilderAction =
  | { type: 'SET_CURRENT_COURSE'; payload: any }
  | { type: 'SET_CURRENT_EXAM'; payload: Quiz }
  | { type: 'SET_QUESTIONS'; payload: (QuizQuestion & { options?: QuizQuestionOption[] })[] }
  | { type: 'ADD_QUESTION'; payload: QuizQuestion & { options?: QuizQuestionOption[] } }
  | { type: 'UPDATE_QUESTION'; payload: QuizQuestion & { options?: QuizQuestionOption[] } }
  | { type: 'DELETE_QUESTION'; payload: number }
  | { type: 'REORDER_QUESTIONS'; payload: (QuizQuestion & { options?: QuizQuestionOption[] })[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_EDITING_QUESTION'; payload: QuizQuestion | null }
  | { type: 'TOGGLE_QUESTION_EDITOR'; payload?: boolean }
  | { type: 'TOGGLE_EXAM_SETTINGS'; payload?: boolean }
  | { type: 'SET_VALIDATION_RESULT'; payload: any }
  | { type: 'RESET_STATE' };

const initialState: ExamBuilderState = {
  currentCourse: null,
  currentExam: null,
  questions: [],
  isLoading: false,
  error: null,
  editingQuestion: null,
  showQuestionEditor: false,
  showExamSettings: false,
  validationResult: null,
};

function examBuilderReducer(state: ExamBuilderState, action: ExamBuilderAction): ExamBuilderState {
  switch (action.type) {
    case 'SET_CURRENT_COURSE':
      return { ...state, currentCourse: action.payload };
    
    case 'SET_CURRENT_EXAM':
      return { ...state, currentExam: action.payload };
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'ADD_QUESTION':
      return { ...state, questions: [...state.questions, action.payload] };
    
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q => 
          q.id === action.payload.id ? action.payload : q
        )
      };
    
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload)
      };
    
    case 'REORDER_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_EDITING_QUESTION':
      return { ...state, editingQuestion: action.payload };
    
    case 'TOGGLE_QUESTION_EDITOR':
      return { 
        ...state, 
        showQuestionEditor: action.payload !== undefined ? action.payload : !state.showQuestionEditor 
      };
    
    case 'TOGGLE_EXAM_SETTINGS':
      return { 
        ...state, 
        showExamSettings: action.payload !== undefined ? action.payload : !state.showExamSettings 
      };
    
    case 'SET_VALIDATION_RESULT':
      return { ...state, validationResult: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

const ExamBuilderContext = createContext<{
  state: ExamBuilderState;
  dispatch: React.Dispatch<ExamBuilderAction>;
} | null>(null);

export function ExamBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(examBuilderReducer, initialState);

  return (
    <ExamBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamBuilderContext.Provider>
  );
}

export function useExamBuilder() {
  const context = useContext(ExamBuilderContext);
  if (!context) {
    throw new Error('useExamBuilder must be used within an ExamBuilderProvider');
  }
  return context;
}