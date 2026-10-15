// DataMind Core Types

export type AutonomyLevel = 0 | 1 | 2 | 3 | 4;

export interface AutonomyLevelInfo {
  level: AutonomyLevel;
  name: string;
  tagline: string;
  description: string;
  assistanceRatio: number; // 0 to 100%
  color: string;
  badgeClass: string;
}

export type UserRole = 'student' | 'researcher' | 'analyst' | 'educator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  avatarColor?: string;
  institution?: string;
  joinedDate: string;
  targetLearningGoal?: string;
  isGuest?: boolean;
}

export interface DatasetColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'date';
  missingCount: number;
  uniqueCount: number;
  stats?: {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    stdDev?: number;
    topValues?: { value: string; count: number }[];
  };
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  rowCount: number;
  columnCount: number;
  missingValueCount: number;
  duplicateRowCount: number;
  columns: DatasetColumn[];
  rows: Record<string, any>[];
  source: 'sample' | 'uploaded';
}

export type ExplanationStyle = 
  | 'procedural' 
  | 'formula' 
  | 'analogical' 
  | 'visual' 
  | 'causal';

export interface StyleOption {
  id: ExplanationStyle;
  name: string;
  iconName: string;
  shortDescription: string;
  cognitiveTarget: string;
}

export interface TopicExplanation {
  topicId: string;
  topicTitle: string;
  category: 'cleaning' | 'statistics' | 'visualization' | 'modeling' | 'reasoning';
  summary: string;
  styles: Record<ExplanationStyle, {
    title: string;
    content: string;
    diagramType?: string;
    diagramData?: any;
    keyTakeaway: string;
  }>;
  assumptions: string[];
  limitations: string[];
}

export interface CausalNode {
  id: string;
  label: string;
  category: 'treatment' | 'outcome' | 'confounder' | 'mediator' | 'decision';
  description: string;
  x: number;
  y: number;
}

export interface CausalEdge {
  from: string;
  to: string;
  label?: string;
  strength?: 'strong' | 'moderate' | 'hypothesized';
  isConfounding?: boolean;
}

export interface CausalScenario {
  id: string;
  title: string;
  domain: string;
  hypothesis: string;
  observedPattern: string;
  plausibleInterpretation: string;
  nodes: CausalNode[];
  edges: CausalEdge[];
  assumptions: string[];
  alternativeExplanations: string[];
  evidenceNeeded: string[];
  limitations: string[];
  deepReasoningLevels: {
    level: number;
    title: string;
    explanation: string;
  }[];
}

export interface PracticeTask {
  id: string;
  title: string;
  category: 'cleaning' | 'statistics' | 'visualization' | 'reasoning';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  context: string;
  question: string;
  options?: string[];
  correctOptionIndex?: number;
  correctAnswerText?: string;
  explanation: string;
  hints: string[];
  stepByStepSolution: string[];
  directSolution: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'task_attempt' | 'task_completed' | 'level_change' | 'dataset_loaded' | 'explanation_viewed' | 'imputation_applied';
  title: string;
  detail: string;
  autonomyLevel: AutonomyLevel;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  suggestedFollowUps?: string[];
  reasoningSnippet?: string;
}

export interface TestResult {
  id: string;
  name: string;
  category: 'csv' | 'dial' | 'explanation' | 'quality' | 'theme';
  status: 'passed' | 'failed' | 'running' | 'pending';
  executionTimeMs?: number;
  message?: string;
  details?: string;
}
