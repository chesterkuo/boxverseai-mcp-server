import { getTaskTypesTool } from "./getTaskTypes.js";
import { createTaskTool } from "./createTask.js";
import { updateTaskTool } from "./updateTask.js";
import { deleteTaskTool } from "./deleteTask.js";
import { listTasksTool } from "./listTasks.js";
import { getTaskDetailTool } from "./getTaskDetail.js";
import { getTaskLogTool } from "./getTaskLog.js";
import { getTaskRewardListTool } from "./getTaskRewardList.js";
import { manualSubmitTaskTool } from "./manualSubmitTask.js";
import { refundTaskTool } from "./refundTask.js";
import { rewardReviewTool } from "./rewardReview.js";
import { getFeedbackOverviewTool } from "./getFeedbackOverview.js";
import { getFeedbackListTool } from "./getFeedbackList.js";
import { getTopicsTool } from "./getTopics.js";
import { getFeedbackAnalysisTool } from "./getFeedbackAnalysis.js";
import { getKeyInsightsTool } from "./getKeyInsights.js";
import { generateKeyInsightsTool } from "./generateKeyInsights.js";
import { getFeedbackDetailTool } from "./getFeedbackDetail.js";
import { updateFeedbackLogTool } from "./updateFeedbackLog.js";
export const allTools = [
    // Group A: Task Management (wallet API)
    getTaskTypesTool,
    createTaskTool,
    updateTaskTool,
    deleteTaskTool,
    listTasksTool,
    getTaskDetailTool,
    getTaskLogTool,
    getTaskRewardListTool,
    manualSubmitTaskTool,
    refundTaskTool,
    rewardReviewTool,
    // Group B: Feedback & Analysis (AI API)
    getFeedbackOverviewTool,
    getFeedbackListTool,
    getTopicsTool,
    getFeedbackAnalysisTool,
    getKeyInsightsTool,
    generateKeyInsightsTool,
    getFeedbackDetailTool,
    updateFeedbackLogTool,
];
