import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { QuizQuestion, Quiz } from '@shared/schema';

interface ExamBuilderState {
  currentExam: Quiz | null;
  currentCourse: any | null;
  questions: QuizQuestion[];
  editingQuestion: QuizQuestion | null;
  showQuestionEditor: boolean;
  showExamSettings: boolean;
  validationResult: any | null;
  isLoading: boolean;
}

type ExamBuilderAction = 
  | { type: 'SET_CURRENT_EXAM'; payload: Quiz }
  | { type: 'SET_CURRENT_COURSE'; payload: any }
  | { type: 'SET_QUESTIONS'; payload: QuizQuestion[] }
  | { type: 'ADD_QUESTION'; payload: QuizQuestion }
  | { type: 'UPDATE_QUESTION'; payload: QuizQuestion }
  | { type: 'DELETE_QUESTION'; payload: number }
  | { type: 'REORDER_QUESTIONS'; payload: QuizQuestion[] }
  | { type: 'SET_EDITING_QUESTION'; payload: QuizQuestion | null }
  | { type: 'TOGGLE_QUESTION_EDITOR'; payload: boolean }
  | { type: 'TOGGLE_EXAM_SETTINGS'; payload: boolean }
  | { type: 'SET_VALIDATION_RESULT'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: ExamBuilderState = {
  currentExam: null,
  currentCourse: null,
  questions: [],
  editingQuestion: null,
  showQuestionEditor: false,
  showExamSettings: false,
  validationResult: null,
  isLoading: false,
};

function examBuilderReducer(state: ExamBuilderState, action: ExamBuilderAction): ExamBuilderState {
  switch (action.type) {
    case 'SET_CURRENT_EXAM':
      return { ...state, currentExam: action.payload };
    case 'SET_CURRENT_COURSE':
      return { ...state, currentCourse: action.payload };
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
    case 'SET_EDITING_QUESTION':
      return { ...state, editingQuestion: action.payload };
    case 'TOGGLE_QUESTION_EDITOR':
      return { ...state, showQuestionEditor: action.payload };
    case 'TOGGLE_EXAM_SETTINGS':
      return { ...state, showExamSettings: action.payload };
    case 'SET_VALIDATION_RESULT':
      return { ...state, validationResult: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface ExamBuilderContextType {
  state: ExamBuilderState;
  dispatch: React.Dispatch<ExamBuilderAction>;
}

const ExamBuilderContext = createContext<ExamBuilderContextType | undefined>(undefined);

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
  if (context === undefined) {
    throw new Error('useExamBuilder must be used within an ExamBuilderProvider');
  }
  return context;
}