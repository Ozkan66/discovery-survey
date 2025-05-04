export interface Survey {
  themes: Theme[];
}

export interface Theme {
  id: string;
  name: string;
  subthemes: Subtheme[];
}

export interface Subtheme {
  id: string;
  name: string;
  statements: Statement[];
}

export interface Statement {
  id: string;
  text: string;
  painpoint: string;
}
