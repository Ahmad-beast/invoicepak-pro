export type FeedbackType = 'bug' | 'feature' | 'general';
export type FeedbackStatus = 'new' | 'read';

export interface Feedback {
  id: string;
  userId: string;
  userEmail: string;
  message: string;
  type: FeedbackType;
  status: FeedbackStatus;
  createdAt: Date;
}
