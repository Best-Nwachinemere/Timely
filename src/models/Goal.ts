export interface Goal {
  id: string | number;
  name: string;
  description: string;
  progress: number;
  streak: number;
  achievements: string[];
  // ...other fields...
}