export interface FeedbackOverview {
  taskId?: string;
  total: number;
  diffOfTotal: number;
  mainIssue: string;
  unanalyzedCount: number;
  inWhiteList: number;
  analyzeStatus: number;
  completedCount: number;
  invalidCount: number;
  partialCount: number;
  averageDuration: number;
  lastestSurveyCompleteTime: number;
}

export interface FeedbackItem {
  question?: string;
  feedbackType?: number;
  feedbackOfText?: string;
  feedbackFileUrl?: string;
  createTime?: number;
  presignedUrl?: string;
  labels?: string[];
  feedbackElementId?: string;
}

export interface FeedbackListV2Item {
  id: number;
  feedbackType: number[];
  summary?: string;
  surveyStatus: number;
  durationSeconds: number;
  countryCode: string;
  isExcluded: boolean;
  isHighlighted: boolean;
  feedback: FeedbackItem[];
  createTime: number;
  userCriteria: Record<string, unknown>;
  feedbackScore: number;
  feedbackScoreSummary: string;
}

export interface FeedbackTopicItem {
  topic: string;
  amount: number;
  sentiment: string;
  keywords: string[];
}

export interface FeedbackAnalyzeData {
  timestamp: number[];
  labels: string[] | null;
  datasets: number[][];
}

export interface FeedbackKeyInsights {
  keyInsights: string | null;
  count: number | null;
  updateTime: number | null;
  analysisStatus: number;
  reference: {
    feedbackOfText: string;
    feedbackLogId: number;
    feedbackElementId: string;
    createTime: number;
    labels: string[];
  }[];
}
