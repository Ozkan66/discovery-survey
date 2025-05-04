// Centrale types/interfaces voor de Discovery-Survey front-end

export interface SurveyTheme {
  id: string;
  name: string;
  subthemes: SurveySubtheme[];
}

export interface SurveySubtheme {
  id: string;
  name: string;
  statements: SurveyStatement[];
}

export interface SurveyStatement {
  id: string;
  text: string;
}

export interface SurveyResponse {
  statementId: string;
  value: number;
  comment?: string;
}

export interface ContextFormData {
  gender: string;
  age: number;
  schoolType: string;
  // ...andere velden
}
