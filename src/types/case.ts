export interface Case {
  id: string;
  type: string;
  title: string;
  description: string;
  location: string;
  severity: 'mild' | 'moderate' | 'severe';
  imageUrl: string;
  raised: number;
  goal: number;
  createdAt: Date;
  userId: string;
  status: 'open' | 'closed';
}