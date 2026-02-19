export interface TaskTypeItem {
  featureId: number;
  taskTypeId: number;
  taskTypeName: string;
  taskTypeVersion: number;
  taskTypeDescription: string;
  unlockMethod: number[];
  userUnlocked: number;
  trialUsedCount: number;
  trialLimit: number;
  parameters: string[];
  unlockCondition: unknown[];
  analysisCountPerPoint: number;
  preAnalysisCount: number;
  flowiseAgent: unknown[];
  flowsId: string;
  preListenMeAgentGeneratorLimit: number;
  askMeAgentLimit: number;
  platformFees: number;
}

export interface TaskItem {
  id: number;
  featureId: number;
  featureName: string;
  taskType: number;
  taskName: string;
  taskTypeVersion: number;
  chainId: string;
  tokenName: string;
  tokenSymbol: string;
  amount: number;
  description: string;
  taskStatus: number;
  userStatus: {
    status: number;
    reason: number;
  };
  startTime: number;
  endTime: number;
  extraDescription?: string;
  extraRewardAmount?: number;
  paymentStatus: number;
  refundableAmount: number;
  recruitmentType: number;
}

export interface TaskDetail {
  taskId: number;
  name: string;
  taskType: number;
  description: string;
  startTime: number;
  endTime: number;
  status: number;
  rewardAmount: number;
  rewardSymbol: string;
  rewardLimit: number;
  rewardSendType: string;
  rewardSendTime: number;
  createTime: number;
  cancelledTime: number;
  participants: string;
  parameters: Record<string, unknown>;
  transactionHashList: string[];
}

export interface TaskLogItem {
  id: number;
  action: string;
  description: string;
  createTime: number;
}

export interface RewardListItem {
  accountName: string;
  walletAddress: string;
  userId: number;
  userContact: {
    general: {
      email: string;
      phone: string;
      wallet: string;
    };
    social: {
      x: string;
      facebook: string;
      linkedIn: string;
      instagram: string;
      tikTok: string;
      lineId: string;
      discordId: string;
      userdefined: string;
    };
  };
  feedbackScore: number;
  surveyCompleteTime: number;
}

export interface CreateTaskParams {
  taskTypeId: number;
  name: string;
  parameters: Record<string, unknown>;
  startTime?: number;
  endTime?: number;
  rewardInfo?: Record<string, unknown>;
  extraDescription?: string;
  isPublished?: boolean;
  extraRewardSettings?: unknown[];
  taskRewardType?: number;
  aaWalletBalance?: string;
}
