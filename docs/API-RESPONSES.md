# ListenME MCP Server -- API Response Reference

> **Test environment:** agentId=69, taskId=160 (ended, 33 completed feedback), taskId=163 (active, 14 participants)
>
> All responses were captured from live API calls on 2026-02-20.
> Timestamps are Unix epoch seconds.

---

## Table of Contents

1. [listenme_get_task_types](#1-listenme_get_task_types)
2. [listenme_list_tasks](#2-listenme_list_tasks)
3. [listenme_get_task_detail](#3-listenme_get_task_detail)
4. [listenme_get_task_reward_list](#4-listenme_get_task_reward_list)
5. [listenme_get_task_log](#5-listenme_get_task_log)
6. [listenme_get_feedback_overview](#6-listenme_get_feedback_overview)
7. [listenme_get_feedback_list](#7-listenme_get_feedback_list)
8. [listenme_get_feedback_detail](#8-listenme_get_feedback_detail)
9. [listenme_get_topics](#9-listenme_get_topics)
10. [listenme_get_feedback_analysis (analyzeType=1)](#10-listenme_get_feedback_analysis-analyzetype1--response-trend)
11. [listenme_get_feedback_analysis (analyzeType=2)](#11-listenme_get_feedback_analysis-analyzetype2--sentiment-trend)
12. [listenme_get_feedback_analysis (analyzeType=3)](#12-listenme_get_feedback_analysis-analyzetype3--topic-trend)
13. [listenme_get_key_insights](#13-listenme_get_key_insights)
14. [Write/Destructive Tools (not tested)](#14-writedestructive-tools-not-tested)

---

## 1. listenme_get_task_types

**Description:** Returns available task types for a given agent and feature.

**Test call arguments:**
```
agentId = 69
featureId = 4
```

**Response:**

```json
[
  {
    "featureId": 4,
    "taskTypeId": 7,
    "taskTypeVersion": 1,
    "taskTypeName": "productFeedback",
    "unlockMethod": [2, 3, 4, 5],
    "userUnlocked": 0,
    "trialUsedCount": 4,
    "trialLimit": 0,
    "parameters": [
      "domain",
      "question",
      "productUrl",
      "explanation"
    ],
    "analysisCountPerPoint": 10,
    "preAnalysisCount": 30,
    "preListenMeAgentGeneratorLimit": 5,
    "askMeAgentLimit": 20,
    "platformFees": 0.05,
    "unlockCondition": [
      {
        "unlockMethod": 2,
        "tokenAmount": 0.1,
        "tokenSymbol": "USDC",
        "tokenName": "USDC",
        "tokenAddress": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        "chainId": 8453,
        "mainAddress": "0x771d19f02d891b244d92cdb47b9def46d24c1fc3"
      },
      {
        "unlockMethod": 3,
        "currency": "usd",
        "unitPrice": 10,
        "productName": "Product Research"
      },
      {
        "unlockMethod": 4,
        "planName": "Plus",
        "priceId": "price_1SxI0JCYzEkzeA6VVCX989lQ",
        "currency": "usd",
        "displayUnitPrice": 4000,
        "discountRate": 0.8,
        "listenMeAgentGeneratorLimit": 10,
        "includedPoints": 400
      },
      {
        "unlockMethod": 5,
        "planName": "Pro",
        "priceId": "price_1SxI1UCYzEkzeA6V4njYGaa8",
        "currency": "usd",
        "displayUnitPrice": 8000,
        "discountRate": 0.7,
        "listenMeAgentGeneratorLimit": 20,
        "includedPoints": 800
      }
    ],
    "flowiseAgent": [
      {
        "name": "listenMeAgentGenerator",
        "flowsId": "78b7e0f0-c509-4f7b-8c3f-bb7296507acd"
      },
      {
        "name": "listenMeAgentAskAI",
        "flowsId": "f8794f57-7030-4c9e-8ee2-296f3067745e"
      },
      {
        "name": "listenMeAgentCraft",
        "flowsId": "d45ca397-23d9-4f73-88f2-7504628c9d34"
      },
      {
        "name": "listenMeAgentInterview",
        "flowsId": "24e49e7f-8c33-4814-95f7-36bff50f5f83"
      }
    ]
  },
  {
    "featureId": 4,
    "taskTypeId": 7,
    "taskTypeVersion": 2,
    "taskTypeName": "listenMe",
    "unlockMethod": [1],
    "userUnlocked": 0,
    "trialUsedCount": 0,
    "trialLimit": 0,
    "parameters": [
      "domain",
      "productUrl",
      "explanation",
      "question",
      "context",
      "brandName",
      "socialLink",
      "language",
      "idealDurationMin",
      "craftAiChatId",
      "invitationLimit",
      "askMeQuestionTemplate",
      "topics",
      "recruitmentType",
      "criteriaInfo"
    ],
    "analysisCountPerPoint": 10,
    "preAnalysisCount": 30,
    "preListenMeAgentGeneratorLimit": 5,
    "askMeAgentLimit": 20,
    "platformFees": 0.05,
    "unlockCondition": [
      {
        "unlockMethod": 1
      }
    ],
    "flowiseAgent": [
      {
        "name": "listenMeAgentGenerator",
        "flowsId": "78b7e0f0-c509-4f7b-8c3f-bb7296507acd"
      },
      {
        "name": "listenMeAgentAskAI",
        "flowsId": "f8794f57-7030-4c9e-8ee2-296f3067745e"
      },
      {
        "name": "listenMeAgentCraft",
        "flowsId": "d45ca397-23d9-4f73-88f2-7504628c9d34"
      },
      {
        "name": "listenMeAgentInterview",
        "flowsId": "24e49e7f-8c33-4814-95f7-36bff50f5f83"
      }
    ]
  }
]
```

**Notes:**
- Returns an **array** of task type configurations. This agent has two versions: v1 (`productFeedback`) and v2 (`listenMe`).
- `unlockMethod` array indicates how the task type can be unlocked (1=free/internal, 2=crypto, 3=fiat one-time, 4=Plus plan, 5=Pro plan).
- `unlockCondition` provides the pricing/payment details for each unlock method.
- `parameters` lists required fields when creating a task of this type. v2 (`listenMe`) has significantly more parameters including `context`, `brandName`, `topics`, and `criteriaInfo`.
- `flowiseAgent` maps AI agent names to their Flowise flow IDs used for AI-powered interview generation.
- `analysisCountPerPoint` (10) and `preAnalysisCount` (30) control when automated analysis triggers.

---

## 2. listenme_list_tasks

**Description:** Returns a paginated list of tasks for the agent.

**Test call arguments:**
```
agentId = 69
featureId = [4]
scope = "user"
```

**Response:**

```json
{
  "pageNum": 1,
  "pageSize": 20,
  "size": 4,
  "startRow": 1,
  "endRow": 4,
  "total": 4,
  "pages": 1,
  "list": [
    {
      "id": 168,
      "featureId": 4,
      "featureName": "ProductFeedback",
      "taskType": 7,
      "taskTypeVersion": 2,
      "taskName": "Coffee",
      "chainId": null,
      "crowdfundAddress": null,
      "tokenAddress": null,
      "tokenName": null,
      "tokenSymbol": null,
      "totalAmount": null,
      "amount": null,
      "currency": null,
      "description": null,
      "taskStatus": 1,
      "taskStatusCode": 0,
      "userStatus": null,
      "startTime": 1770634800,
      "endTime": 1771689599,
      "extraDescription": null,
      "extraRewardAmount": null,
      "paymentStatus": null,
      "refundableAmount": null,
      "recruitmentType": 1
    },
    {
      "id": 163,
      "featureId": 4,
      "featureName": "ProductFeedback",
      "taskType": 7,
      "taskTypeVersion": 2,
      "taskName": "Candidate in-depth interview",
      "chainId": null,
      "crowdfundAddress": null,
      "tokenAddress": null,
      "tokenName": null,
      "tokenSymbol": null,
      "totalAmount": null,
      "amount": null,
      "currency": null,
      "description": null,
      "taskStatus": 1,
      "taskStatusCode": 0,
      "userStatus": null,
      "startTime": 1770123600,
      "endTime": 1772553599,
      "extraDescription": null,
      "extraRewardAmount": null,
      "paymentStatus": null,
      "refundableAmount": null,
      "recruitmentType": 1
    },
    {
      "id": 160,
      "featureId": 4,
      "featureName": "ProductFeedback",
      "taskType": 7,
      "taskTypeVersion": 2,
      "taskName": "生成式人工智慧採用程度對工作敬業度影響研究問卷",
      "chainId": null,
      "crowdfundAddress": null,
      "tokenAddress": null,
      "tokenName": null,
      "tokenSymbol": null,
      "totalAmount": null,
      "amount": null,
      "currency": null,
      "description": null,
      "taskStatus": 2,
      "taskStatusCode": 0,
      "userStatus": null,
      "startTime": 1769162400,
      "endTime": 1769875199,
      "extraDescription": null,
      "extraRewardAmount": null,
      "paymentStatus": null,
      "refundableAmount": 0,
      "recruitmentType": 1
    },
    {
      "id": 159,
      "featureId": 4,
      "featureName": "ProductFeedback",
      "taskType": 7,
      "taskTypeVersion": 2,
      "taskName": "當AI有了「溫度」：社會呈現感對顧客忠誠影響",
      "chainId": null,
      "crowdfundAddress": null,
      "tokenAddress": null,
      "tokenName": null,
      "tokenSymbol": null,
      "totalAmount": null,
      "amount": null,
      "currency": null,
      "description": null,
      "taskStatus": 3,
      "taskStatusCode": 0,
      "userStatus": null,
      "startTime": 1769079600,
      "endTime": 1798732799,
      "extraDescription": null,
      "extraRewardAmount": null,
      "paymentStatus": null,
      "refundableAmount": null,
      "recruitmentType": 1
    }
  ],
  "prePage": 0,
  "nextPage": 0,
  "isFirstPage": true,
  "isLastPage": true,
  "hasPreviousPage": false,
  "hasNextPage": false,
  "navigatePages": 8,
  "navigatepageNums": [1],
  "navigateFirstPage": 1,
  "navigateLastPage": 1,
  "firstPage": 1,
  "lastPage": 1
}
```

**Notes:**
- Uses **PageHelper-style pagination** (MyBatis PageHelper). The pagination metadata at the top level (`pageNum`, `pageSize`, `total`, `pages`) is standard across all paginated responses.
- `taskStatus` values: `1` = active/ongoing, `2` = ended, `3` = cancelled/archived.
- `taskStatusCode` appears to be a sub-status (0 = normal).
- Token/chain fields (`chainId`, `crowdfundAddress`, `tokenAddress`, etc.) are null for non-crypto reward tasks.
- `refundableAmount` is only present (as `0`) for ended tasks (taskId=160) where rewards have been fully distributed.
- Tasks are returned in **descending order by ID** (newest first).

---

## 3. listenme_get_task_detail

**Description:** Returns the full detail of a single task, including all configuration parameters.

**Test call arguments:**
```
agentId = 69
taskId = 163
scope = "user"
```

**Response:**

```json
{
  "taskId": 163,
  "agentName": "Boxverse Demo",
  "agentImage": "https://testgpex.s3.ap-northeast-1.amazonaws.com/prod/game-article-file/2026/01/22/612a1d7924ae45d4bbdd74780ab7cb48.jpg",
  "name": "Candidate in-depth interview",
  "description": "Go to fill out the Candidate in-depth interview form, answer the feedback questions in the form, and leave your contact information.",
  "extraDescription": null,
  "taskType": 7,
  "taskTypeVersion": 2,
  "taskStatus": 1,
  "taskStatusCode": 0,
  "userStatus": null,
  "startTime": 1770123600,
  "endTime": 1772553599,
  "rewardSendType": "MANUALLY_SEND",
  "createTime": 1770120444,
  "cancelledTime": null,
  "participants": 14,
  "parameters": {
    "domain": "https://listenme.boxverse.ai",
    "productUrl": "https://boxverse.ai",
    "explanation": "針對 BOXVERSE AI 候選人深度訪談 /  A retrospective interview regarding BOXVERSE AI's campaign.",
    "question": [
      "您目前在貴公司主要負責哪些專案或任務？通常扮演什麼角色？",
      "在您目前的工作中，哪部分最讓您感到有成就感？為什麼？",
      "您覺得自己在工作上最大的優勢是什麼？有哪些方面您認為可以再加強？",
      "描述一下您在專案中通常是如何與團隊成員協作的。",
      "在您過去的工作經驗中，是否有遇過與主管或同事的合作問題？您是如何處理的？",
      "您認為目前的工作環境或公司文化有哪方面可以改進？",
      "當您遇到工作瓶頸或挑戰時，通常會怎麼應對？請舉一個具體例子。",
      "是什麼原因讓您考慮轉換目前的工作？（追問：轉換工作的優先考量是什麼？）",
      "您會如何評估一個新的工作機會？哪些因素對您來說最重要？",
      "請分享一個您曾主動學習新技能或解決複雜問題的例子。這個經歷對您有什麼影響？",
      "您認為一個理想的工作團隊或公司氛圍應該是什麼樣子？",
      "您過去是如何確保專案能夠按時並高品質地完成？請分享一個相關經驗。",
      "請描述一個您在壓力下完成任務的經驗。您是如何管理壓力的？",
      "您對未來三到五年的職涯發展有什麼規劃？",
      "除了我們今天討論的內容，還有什麼是您希望我們了解的，關於您的工作態度或個人特質？"
    ],
    "context": {
      "target": "有專業背景的軟體工程師、非專業背景的PM人員、U/UX設計師",
      "objective": "深入了解候選人的人格特質、工作上的態度、轉換工作的原因，以及他們對於工作完成度的要求和時間掌控度。",
      "background": "目前的履歷篩選機制可能導致候選人背景資料與實際不符，且難以評估人格特質、工作積極性與完成度，希望透過深度訪談來彌補這些資訊落差。"
    },
    "brandName": "BOXVERSE AI",
    "socialLink": {
      "x": "",
      "discord": "",
      "telegram": ""
    },
    "language": "tw",
    "idealDurationMin": 20,
    "askMeQuestionTemplate": [
      "請評估候選人在專案中展現的團隊協作與溝通能力？",
      "候選人對於新技術與知識的學習意願與主動性為何？",
      "候選人面對工作挑戰或失敗時，展現的應變能力與解決問題的策略為何？",
      "候選人尋求職涯轉換的核心動機，與本公司提供的發展機會契合度如何？",
      "從候選人描述的經驗中，如何判斷其對工作品質與時程管理的重視程度？",
      "候選人是否具備自我反思能力，並能具體說明個人優勢與待改進之處？",
      "候選人在壓力下完成任務的經驗，如何展現其情緒管理與抗壓性？",
      "候選人對未來職涯的規劃，是否與本職位能提供的成長路徑一致？"
    ],
    "topics": [
      {
        "topic": "人格特質與工作態度",
        "labels": [
          "積極主動性",
          "責任感",
          "學習意願",
          "抗壓性",
          "情緒穩定度",
          "溝通表達能力",
          "團隊合作精神",
          "自我驅動力",
          "解決問題態度"
        ]
      },
      {
        "topic": "轉換動機與職涯規劃",
        "labels": [
          "轉換原因 (個人/環境)",
          "職涯目標清晰度",
          "對新工作期望",
          "薪資福利考量",
          "學習成長機會",
          "工作與生活平衡",
          "對公司文化的偏好",
          "長期發展潛力"
        ]
      },
      {
        "topic": "工作成果與時間管理",
        "labels": [
          "專案達成率",
          "時間管理技巧",
          "成果品質要求",
          "效率意識",
          "跨部門協調能力",
          "任務優先排序",
          "應對突發狀況",
          "自我檢視與改進",
          "專案交付能力"
        ]
      },
      {
        "topic": "專業能力與問題解決",
        "labels": [
          "技術深度 (軟體工程師)",
          "產品思維 (PM)",
          "使用者體驗洞察 (U/UX)",
          "跨領域知識",
          "創新能力",
          "問題分析能力",
          "實務經驗豐富度",
          "解決方案提出能力",
          "持續學習新知"
        ]
      },
      {
        "topic": "其他",
        "labels": [
          "新興議題",
          "非預期意見",
          "研究新洞察",
          "薪資預期",
          "公司規模偏好",
          "工作地點考量",
          "對產業趨勢的看法",
          "個人興趣與工作結合"
        ]
      }
    ],
    "recruitmentType": 1,
    "criteriaInfo": []
  },
  "transactionHashList": [],
  "rewardInfo": null,
  "extraTaskInfo": null,
  "preAnalysisCount": 30,
  "analysisCountPerPoint": 10,
  "paymentStatus": null,
  "refundableAmount": null,
  "rewardListDisputeStatus": 0,
  "taskRewardType": null,
  "askMeAvailableUsageCount": 10,
  "@type": "social"
}
```

**Notes:**
- This is the **richest response** in the API -- it contains the full task configuration nested inside `parameters`.
- `parameters.question` is the array of interview questions the AI agent asks respondents.
- `parameters.context` provides `target` (audience), `objective`, and `background` -- used by the AI to guide the interview flow.
- `parameters.topics` defines the topic/label taxonomy for classifying feedback responses. Each topic has a list of labels that the AI uses for tagging.
- `parameters.askMeQuestionTemplate` contains pre-defined "Ask AI" question templates for the task owner.
- `participants` (14) is the current count of people who have started/completed the survey.
- `rewardSendType: "MANUALLY_SEND"` means rewards are distributed manually by the task owner (vs. automatic).
- `askMeAvailableUsageCount` (10) is the remaining quota for the "Ask AI" feature.
- `@type: "social"` indicates this is a social/interview-type task.

---

## 4. listenme_get_task_reward_list

**Description:** Returns the list of participants who completed the task, along with their contact info and reward status.

**Test call arguments:**
```
agentId = 69
taskId = 160
```

**Response (truncated -- showing first 3 of 33 items):**

```json
[
  {
    "accountName": null,
    "walletAddress": null,
    "userId": null,
    "userContact": {
      "general": {
        "email": null,
        "phone": null,
        "wallet": "redacted-email@example.com"
      },
      "social": {
        "x": null,
        "facebook": null,
        "linkedIn": null,
        "instagram": null,
        "tikTok": null,
        "lineId": null,
        "discord": "redacted-user",
        "userDefined": null
      }
    },
    "countryCode": "tw",
    "feedbackScore": null,
    "surveyCompleteTime": 1769164353
  },
  {
    "accountName": null,
    "walletAddress": null,
    "userId": null,
    "userContact": {
      "general": {
        "email": null,
        "phone": null,
        "wallet": "user001"
      },
      "social": {
        "x": null,
        "facebook": null,
        "linkedIn": null,
        "instagram": null,
        "tikTok": null,
        "lineId": null,
        "discord": "user001",
        "userDefined": null
      }
    },
    "countryCode": "tw",
    "feedbackScore": null,
    "surveyCompleteTime": 1769396058
  },
  {
    "accountName": null,
    "walletAddress": null,
    "userId": null,
    "userContact": {
      "general": {
        "email": null,
        "phone": null,
        "wallet": "user002"
      },
      "social": {
        "x": null,
        "facebook": null,
        "linkedIn": null,
        "instagram": null,
        "tikTok": null,
        "lineId": null,
        "discord": "user002",
        "userDefined": null
      }
    },
    "countryCode": "tw",
    "feedbackScore": null,
    "surveyCompleteTime": 1769396408
  }
]
```

> ... **30 more items** in the full response (33 total participants).

**Notes:**
- Returns a **flat array** (no pagination wrapper) of all participants.
- `userContact` is split into `general` (email, phone, wallet) and `social` (x, facebook, linkedIn, etc.).
- For anonymous respondents, the `wallet` field is used as a general identifier (may contain usernames, emails, or custom handles).
- Some participants have `null` for both `general` and `social` contact, meaning they did not provide any contact info.
- `feedbackScore` is null for all items in this dataset -- scoring was not enabled for this task.
- `surveyCompleteTime` is a Unix timestamp indicating when the participant finished the survey.
- `accountName`, `walletAddress`, and `userId` are null for non-registered/anonymous participants.

---

## 5. listenme_get_task_log

**Description:** Returns the task operation log.

**Test call arguments:**
```
agentId = 69
taskId = 160
```

**Response (error):**

```
Error: API error 400: {"code":10102,"msg":"Wrong parameter.","data":null}
```

**Notes:**
- This endpoint returned a **400 error** with code `10102` ("Wrong parameter").
- This is a known **gateway-level limitation**. The task log endpoint may require additional parameters not currently exposed through the MCP tool, or the endpoint may not be available for ended tasks.
- Error code `10102` is a general parameter validation failure from the backend gateway.

---

## 6. listenme_get_feedback_overview

**Description:** Returns aggregate statistics about feedback collection for a task.

**Test call arguments:**
```
taskId = 160
```

**Response:**

```json
{
  "total": 40,
  "diffOfTotal": 40,
  "mainIssue": "Other",
  "unanalyzedCount": 0,
  "inWhiteList": 0,
  "analyzeStatus": 0,
  "completedCount": 33,
  "invalidCount": 7,
  "partialCount": 0,
  "averageDuration": 208.61,
  "lastestSurveyCompleteTime": 1769483547
}
```

**Notes:**
- `total` (40) is the total number of survey sessions started; `completedCount` (33) is how many were fully completed.
- `invalidCount` (7) means 7 responses were flagged as invalid (too short, off-topic, etc.).
- `partialCount` (0) tracks partially completed surveys.
- `averageDuration` (208.61) is the mean interview duration in **seconds** (~3.5 minutes).
- `mainIssue: "Other"` indicates the dominant topic across all feedback is the "Other" category.
- `analyzeStatus: 0` -- analysis is not currently running (0 = idle, other values may indicate in-progress analysis).
- `unanalyzedCount: 0` -- all responses have been analyzed.
- `diffOfTotal` appears to equal `total` here; it may represent the delta since last check.
- `lastestSurveyCompleteTime` is the Unix timestamp of the most recent completed survey.

---

## 7. listenme_get_feedback_list

**Description:** Returns a paginated list of individual feedback entries with their full Q&A conversation threads.

**Test call arguments:**
```
taskId = 160
pageNum = 1
pageSize = 2
```

**Response:**

```json
{
  "pageNum": 1,
  "pageSize": 2,
  "size": 2,
  "startRow": 1,
  "endRow": 2,
  "total": 33,
  "pages": 17,
  "list": [
    {
      "id": 415,
      "feedbackType": [1],
      "summary": "受訪者表示作為花藝師，在工作中未使用生成式AI工具，並質疑是否符合受訪條件。這反映出AI工具在某些職業中的不適用性，可能導致參與意願降低，並突顯工作性質與AI之間的匹配問題。",
      "surveyStatus": 3,
      "durationSeconds": 38,
      "countryCode": "tw",
      "isExcluded": false,
      "isHighlighted": false,
      "feedback": [
        {
          "feedbackElementId": "fdbd4da9-5882-4a9d-ac03-75c6aaa08b4b_1769483510",
          "question": "哈囉！很高興能跟你聊聊。我想先從一個輕鬆的問題開始：你在現在的工作裡，有沒有特別常用到哪些生成式AI工具呢？大概都用了多久了呀？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769483510
        },
        {
          "feedbackElementId": "1d19e3d4-905a-483a-b4fb-0409870149e2_1769483547",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "目前是花藝師在工作中不會使用到 AI ，應該不符合你們受訪的對象？",
          "feedbackFileUrl": null,
          "labels": [
            "使用頻率",
            "應用廣度",
            "導入階段"
          ],
          "createTime": 1769483547
        },
        {
          "feedbackElementId": "aca0e862-44c6-4c29-955c-5402854f1286_1769483547",
          "question": "訪談到此已完成，感謝您的配合。",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769483547
        }
      ],
      "createTime": 1769483510,
      "userCriteria": null,
      "feedbackScore": null,
      "feedbackScoreSummary": null
    },
    {
      "id": 414,
      "feedbackType": [1],
      "summary": "使用者偏好AI工具如ChatGPT和Wolfram Alpha，因其快速生成題目並提升出題效率，從一天縮短至兩小時。\r\n痛點是AI難度判斷不準，但可透過校正解決。\r\n決策基準包括AI解放時間，讓教學更專注於技巧傳授，並提升團隊合作如分享prompt。\r\n此外，主動學習差異化教學，建議公司提供培訓課程以增強使用動機。",
      "surveyStatus": 3,
      "durationSeconds": 1021,
      "countryCode": "tw",
      "isExcluded": false,
      "isHighlighted": false,
      "feedback": [
        {
          "feedbackElementId": "2c029b0b-fa33-4819-9673-4f2ca5254d19_1769424853",
          "question": "哈囉！很高興有機會和您聊聊。想先請問一下，您在現在的工作上，主要都用哪些生成式AI工具呢？這些工具您大概都用了多久了呀？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769424853
        },
        {
          "feedbackElementId": "c775ec90-2141-4f71-a407-b04b46aacaff_1769425057",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "我目前在連鎖補習班擔任數學老師，ChatGPT 跟 Wolfram Alpha，大概一年。ChatGPT 用來出題目和設計教案，Wolfram 用來驗算和生成解題步驟。",
          "feedbackFileUrl": null,
          "labels": [
            "使用工具種類",
            "使用時間長度",
            "應用廣度"
          ],
          "createTime": 1769425057
        },
        {
          "feedbackElementId": "14c6040f-3c02-42c4-91a2-4c7ae31ebed9_1769425057",
          "question": "哇，連數學老師都會用到 AI 工具，真是越來越普及了呢！聽起來 ChatGPT 幫您設計教案和出題目，Wolfram Alpha 則在驗算解題步驟上提供協助，真的很實用。那想再請教您，這些生成式 AI 工具在您日常教學工作中，具體帶來了哪些方便或讓您工作效率更高的地方呢？有沒有什麼讓您印象深刻的例子可以分享一下？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425057
        },
        {
          "feedbackElementId": "ad75d349-3bbc-4010-bbe5-9f3a7b1cafab_1769425268",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "出模擬考題的時間從一整天變成兩小時。以前要翻好幾本參考書湊題目，現在跟AI說要什麼單元、什麼難度、什麼題型，他就能生成，我再挑選調整。上個月出了一份三年級的福習考，AI 幫我生成了一百多題，我挑了四十題，超有效率。",
          "feedbackFileUrl": null,
          "labels": [
            "時間節省",
            "任務自動化",
            "產出品質提升"
          ],
          "createTime": 1769425268
        },
        {
          "feedbackElementId": "6eab2b7a-f0f8-4915-8771-2230fcee2086_1769425268",
          "question": "哇，從一整天縮短到兩小時，這效率提升真的非常驚人耶！而且還能快速生成大量題目，讓您有更多選擇，聽起來真的很省時省力。聽到您分享這麼棒的經驗，我很好奇，您個人對於現在工作中有生成式AI工具的加入，整體感覺是比較正面、負面，還是覺得還好呢？為什麼會有這樣的感覺呢？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425268
        },
        {
          "feedbackElementId": "6c297ce1-6da2-443f-bf5c-edc347aa5530_1769425487",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "非常正向。出題是最花時間的工作，AI解放了這塊，我可以把心思放在解題技巧的教學上。",
          "feedbackFileUrl": null,
          "labels": [
            "時間節省",
            "工作壓力",
            "創新啟發"
          ],
          "createTime": 1769425487
        },
        {
          "feedbackElementId": "d29ff41c-bd85-4016-9c14-f73996a4ae6c_1769425487",
          "question": "太棒了！聽起來 AI 真的幫您省下好多心力，讓您可以更專注在教學的核心價值上。不過啊，任何工具在使用上可能都會遇到一些小狀況。想問問您，在使用生成式 AI 工具的這段時間，有沒有遇到什麼讓您覺得比較挑戰或不太順利的地方呢？這些小挑戰會不會影響到您的心情，或是工作效率呢？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425487
        },
        {
          "feedbackElementId": "fc445125-30cb-4581-8cbd-ed011c0d4ac5_1769425529",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "AI出的題目有時候難度判斷不準，他說是中等但其實很難。但用久了就知道怎麼校正。",
          "feedbackFileUrl": null,
          "labels": [
            "學習曲線",
            "錯誤減少"
          ],
          "createTime": 1769425529
        },
        {
          "feedbackElementId": "615f0256-6aa1-48b1-81c7-6dcc74c6ed5e_1769425529",
          "question": "嗯，的確，AI在某些判斷上還是需要我們人工介入調整，很高興您找到了校正的方法。不過，有沒有那種情況是，您覺得用了生成式AI工具反而讓您的工作量變大，或是給您帶來壓力的呢？可以跟我們分享一下當時是什麼樣的情境嗎？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425529
        },
        {
          "feedbackElementId": "c1b457f3-7b9c-4885-84cf-43a0a326e363_1769425572",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "沒有。補習班的工作壓力主要來自學生成績和家長期待，AI 在這方面幫了大忙，不會增加壓力。",
          "feedbackFileUrl": null,
          "labels": [
            "工作壓力",
            "資源優化"
          ],
          "createTime": 1769425572
        },
        {
          "feedbackElementId": "fe44986b-d3bc-4512-9f99-4b01f51d2e3c_1769425572",
          "question": "聽起來 AI 真的讓您的工作更順暢了，沒有增加額外負擔，這真是太好了！那我想再請教一下，您覺得當您開始使用生成式 AI 工具之後，您跟同事或教學團隊之間的合作方式，有沒有因此產生什麼變化呢？是讓大家溝通更順利了，還是有出現一些新的狀況或摩擦呢？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425572
        },
        {
          "feedbackElementId": "2fd7a1e6-965c-4043-82f1-713c9ffe6fe6_1769425620",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "跟其他老師會分享出題的 prompt，大家互相借用。班主任也開始要求我們用 AI 來提升教材品質。整體來說協作變更好了。",
          "feedbackFileUrl": null,
          "labels": [
            "知識共享",
            "團隊互動",
            "溝通效率"
          ],
          "createTime": 1769425620
        },
        {
          "feedbackElementId": "46d41d94-13d9-4596-8da0-3bd422fb6cbe_1769425620",
          "question": "哇，聽起來生成式 AI 不只讓您個人效率提升，也讓團隊的合作模式變得更棒了呢！大家互相分享 prompt，一起提升教材品質，這真的很棒。那我想再好奇問問，為了能更有效地運用這些生成式 AI 工具，您自己有沒有主動去學習或嘗試過什麼新的工作方法或技能呢？還有啊，您這麼努力背後，主要的原因是什麼呢？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425620
        },
        {
          "feedbackElementId": "6392ef1b-c628-4895-94a5-97e083debefc_1769425772",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "有研究怎麼用 AI 做差異化教學的題目，比如同一個概念生成不同難度的版本。動機是想讓教學更精準，學生程度差異大的時候特別有用。",
          "feedbackFileUrl": null,
          "labels": [
            "自主學習",
            "技能提升",
            "個人化使用"
          ],
          "createTime": 1769425772
        },
        {
          "feedbackElementId": "d50a58f1-3e73-46f0-9c7a-bb31662314b3_1769425772",
          "question": "哇，這真的是一個很棒的應用方向！能夠根據學生的程度生成不同難度的題目，聽起來對教學真的很有幫助，也更符合個別化的需求。那我想請問，如果滿分是五分，您會給生成式 AI 工具在「提升您工作敬業度」這方面打幾分呢？為什麼會給這個分數呢？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425772
        },
        {
          "feedbackElementId": "2df5307f-e62f-4b95-a943-546170b5d356_1769425820",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "5分。以前覺得出題是苦差事，現在反而變成有趣的事情，會想嘗試各種新的題型。對教學更有熱情。",
          "feedbackFileUrl": null,
          "labels": [
            "工作壓力",
            "創新啟發"
          ],
          "createTime": 1769425820
        },
        {
          "feedbackElementId": "686fa645-96c0-4a2f-a56f-626e67db15ff_1769425820",
          "question": "聽到您這麼說，真的很替您開心耶！能把原本的苦差事變成有趣的挑戰，甚至對教學更有熱情，真是太棒了。那既然生成式AI對您有這麼大的幫助，從您的角度來看，您覺得公司在推廣或優化這些AI工具的使用上，還可以做些什麼改變，或是提供哪些支援，才能讓更多老師在使用上更有動力、也更投入呢？",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425820
        },
        {
          "feedbackElementId": "fa1eed7e-2136-40f5-aec0-c193baaaddca_1769425874",
          "question": null,
          "feedbackType": 1,
          "feedbackOfText": "我覺得可以開設教學課程，可以讓大家更清楚知道怎麼使用他。",
          "feedbackFileUrl": null,
          "labels": [
            "培訓機制",
            "學習資源"
          ],
          "createTime": 1769425874
        },
        {
          "feedbackElementId": "b47b333a-9d3a-4554-b7e0-e443dd1232ff_1769425874",
          "question": "訪談到此已完成，感謝您的配合。",
          "feedbackType": null,
          "feedbackOfText": null,
          "feedbackFileUrl": null,
          "labels": [],
          "createTime": 1769425874
        }
      ],
      "createTime": 1769424853,
      "userCriteria": null,
      "feedbackScore": null,
      "feedbackScoreSummary": null
    }
  ],
  "prePage": 0,
  "nextPage": 2,
  "isFirstPage": true,
  "isLastPage": false,
  "hasPreviousPage": false,
  "hasNextPage": true,
  "navigatePages": 8,
  "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8],
  "navigateFirstPage": 1,
  "navigateLastPage": 8,
  "firstPage": 1,
  "lastPage": 8
}
```

**Notes:**
- The `feedback` array inside each list item contains the **complete Q&A conversation** between the AI interviewer and the respondent.
- Conversation elements alternate between questions (`question` is set, `feedbackOfText` is null) and responses (`question` is null, `feedbackOfText` contains the user's answer).
- `feedbackType: [1]` on the list item indicates text feedback. The `feedbackType` on individual elements: `null` = AI question, `1` = text response.
- `labels` are only populated on **response** elements (not questions) -- these are AI-assigned topic labels from the task's taxonomy.
- `surveyStatus: 3` means the survey is completed.
- `durationSeconds` varies dramatically: 38 seconds for the short disqualified florist vs. 1021 seconds (~17 minutes) for the in-depth math teacher interview.
- `summary` is an AI-generated summary of the entire conversation.
- `isExcluded` / `isHighlighted` are boolean flags the task owner can set for filtering.
- The last element in each feedback conversation is always the closing message: "訪談到此已完成，感謝您的配合。"
- Total of 33 completed feedback items across 17 pages (pageSize=2).

---

## 8. listenme_get_feedback_detail

**Description:** Returns the full detail for a single feedback entry (individual respondent).

**Test call arguments:**
```
taskId = 160
feedbackLogId = 414
```

**Response:**

```json
{
  "id": 414,
  "feedbackType": [1],
  "summary": "使用者偏好AI工具如ChatGPT和Wolfram Alpha，因其快速生成題目並提升出題效率，從一天縮短至兩小時。\r\n痛點是AI難度判斷不準，但可透過校正解決。\r\n決策基準包括AI解放時間，讓教學更專注於技巧傳授，並提升團隊合作如分享prompt。\r\n此外，主動學習差異化教學，建議公司提供培訓課程以增強使用動機。",
  "surveyStatus": 3,
  "durationSeconds": 1021,
  "countryCode": "tw",
  "isExcluded": false,
  "isHighlighted": false,
  "feedback": [
    {
      "feedbackElementId": "2c029b0b-fa33-4819-9673-4f2ca5254d19_1769424853",
      "question": "哈囉！很高興有機會和您聊聊。想先請問一下，您在現在的工作上，主要都用哪些生成式AI工具呢？這些工具您大概都用了多久了呀？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769424853
    },
    {
      "feedbackElementId": "c775ec90-2141-4f71-a407-b04b46aacaff_1769425057",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "我目前在連鎖補習班擔任數學老師，ChatGPT 跟 Wolfram Alpha，大概一年。ChatGPT 用來出題目和設計教案，Wolfram 用來驗算和生成解題步驟。",
      "feedbackFileUrl": null,
      "labels": [
        "使用工具種類",
        "使用時間長度",
        "應用廣度"
      ],
      "createTime": 1769425057
    },
    {
      "feedbackElementId": "14c6040f-3c02-42c4-91a2-4c7ae31ebed9_1769425057",
      "question": "哇，連數學老師都會用到 AI 工具，真是越來越普及了呢！聽起來 ChatGPT 幫您設計教案和出題目，Wolfram Alpha 則在驗算解題步驟上提供協助，真的很實用。那想再請教您，這些生成式 AI 工具在您日常教學工作中，具體帶來了哪些方便或讓您工作效率更高的地方呢？有沒有什麼讓您印象深刻的例子可以分享一下？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425057
    },
    {
      "feedbackElementId": "ad75d349-3bbc-4010-bbe5-9f3a7b1cafab_1769425268",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "出模擬考題的時間從一整天變成兩小時。以前要翻好幾本參考書湊題目，現在跟AI說要什麼單元、什麼難度、什麼題型，他就能生成，我再挑選調整。上個月出了一份三年級的福習考，AI 幫我生成了一百多題，我挑了四十題，超有效率。",
      "feedbackFileUrl": null,
      "labels": [
        "時間節省",
        "任務自動化",
        "產出品質提升"
      ],
      "createTime": 1769425268
    },
    {
      "feedbackElementId": "6eab2b7a-f0f8-4915-8771-2230fcee2086_1769425268",
      "question": "哇，從一整天縮短到兩小時，這效率提升真的非常驚人耶！而且還能快速生成大量題目，讓您有更多選擇，聽起來真的很省時省力。聽到您分享這麼棒的經驗，我很好奇，您個人對於現在工作中有生成式AI工具的加入，整體感覺是比較正面、負面，還是覺得還好呢？為什麼會有這樣的感覺呢？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425268
    },
    {
      "feedbackElementId": "6c297ce1-6da2-443f-bf5c-edc347aa5530_1769425487",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "非常正向。出題是最花時間的工作，AI解放了這塊，我可以把心思放在解題技巧的教學上。",
      "feedbackFileUrl": null,
      "labels": [
        "時間節省",
        "工作壓力",
        "創新啟發"
      ],
      "createTime": 1769425487
    },
    {
      "feedbackElementId": "d29ff41c-bd85-4016-9c14-f73996a4ae6c_1769425487",
      "question": "太棒了！聽起來 AI 真的幫您省下好多心力，讓您可以更專注在教學的核心價值上。不過啊，任何工具在使用上可能都會遇到一些小狀況。想問問您，在使用生成式 AI 工具的這段時間，有沒有遇到什麼讓您覺得比較挑戰或不太順利的地方呢？這些小挑戰會不會影響到您的心情，或是工作效率呢？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425487
    },
    {
      "feedbackElementId": "fc445125-30cb-4581-8cbd-ed011c0d4ac5_1769425529",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "AI出的題目有時候難度判斷不準，他說是中等但其實很難。但用久了就知道怎麼校正。",
      "feedbackFileUrl": null,
      "labels": [
        "學習曲線",
        "錯誤減少"
      ],
      "createTime": 1769425529
    },
    {
      "feedbackElementId": "615f0256-6aa1-48b1-81c7-6dcc74c6ed5e_1769425529",
      "question": "嗯，的確，AI在某些判斷上還是需要我們人工介入調整，很高興您找到了校正的方法。不過，有沒有那種情況是，您覺得用了生成式AI工具反而讓您的工作量變大，或是給您帶來壓力的呢？可以跟我們分享一下當時是什麼樣的情境嗎？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425529
    },
    {
      "feedbackElementId": "c1b457f3-7b9c-4885-84cf-43a0a326e363_1769425572",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "沒有。補習班的工作壓力主要來自學生成績和家長期待，AI 在這方面幫了大忙，不會增加壓力。",
      "feedbackFileUrl": null,
      "labels": [
        "工作壓力",
        "資源優化"
      ],
      "createTime": 1769425572
    },
    {
      "feedbackElementId": "fe44986b-d3bc-4512-9f99-4b01f51d2e3c_1769425572",
      "question": "聽起來 AI 真的讓您的工作更順暢了，沒有增加額外負擔，這真是太好了！那我想再請教一下，您覺得當您開始使用生成式 AI 工具之後，您跟同事或教學團隊之間的合作方式，有沒有因此產生什麼變化呢？是讓大家溝通更順利了，還是有出現一些新的狀況或摩擦呢？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425572
    },
    {
      "feedbackElementId": "2fd7a1e6-965c-4043-82f1-713c9ffe6fe6_1769425620",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "跟其他老師會分享出題的 prompt，大家互相借用。班主任也開始要求我們用 AI 來提升教材品質。整體來說協作變更好了。",
      "feedbackFileUrl": null,
      "labels": [
        "知識共享",
        "團隊互動",
        "溝通效率"
      ],
      "createTime": 1769425620
    },
    {
      "feedbackElementId": "46d41d94-13d9-4596-8da0-3bd422fb6cbe_1769425620",
      "question": "哇，聽起來生成式 AI 不只讓您個人效率提升，也讓團隊的合作模式變得更棒了呢！大家互相分享 prompt，一起提升教材品質，這真的很棒。那我想再好奇問問，為了能更有效地運用這些生成式 AI 工具，您自己有沒有主動去學習或嘗試過什麼新的工作方法或技能呢？還有啊，您這麼努力背後，主要的原因是什麼呢？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425620
    },
    {
      "feedbackElementId": "6392ef1b-c628-4895-94a5-97e083debefc_1769425772",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "有研究怎麼用 AI 做差異化教學的題目，比如同一個概念生成不同難度的版本。動機是想讓教學更精準，學生程度差異大的時候特別有用。",
      "feedbackFileUrl": null,
      "labels": [
        "自主學習",
        "技能提升",
        "個人化使用"
      ],
      "createTime": 1769425772
    },
    {
      "feedbackElementId": "d50a58f1-3e73-46f0-9c7a-bb31662314b3_1769425772",
      "question": "哇，這真的是一個很棒的應用方向！能夠根據學生的程度生成不同難度的題目，聽起來對教學真的很有幫助，也更符合個別化的需求。那我想請問，如果滿分是五分，您會給生成式 AI 工具在「提升您工作敬業度」這方面打幾分呢？為什麼會給這個分數呢？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425772
    },
    {
      "feedbackElementId": "2df5307f-e62f-4b95-a943-546170b5d356_1769425820",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "5分。以前覺得出題是苦差事，現在反而變成有趣的事情，會想嘗試各種新的題型。對教學更有熱情。",
      "feedbackFileUrl": null,
      "labels": [
        "工作壓力",
        "創新啟發"
      ],
      "createTime": 1769425820
    },
    {
      "feedbackElementId": "686fa645-96c0-4a2f-a56f-626e67db15ff_1769425820",
      "question": "聽到您這麼說，真的很替您開心耶！能把原本的苦差事變成有趣的挑戰，甚至對教學更有熱情，真是太棒了。那既然生成式AI對您有這麼大的幫助，從您的角度來看，您覺得公司在推廣或優化這些AI工具的使用上，還可以做些什麼改變，或是提供哪些支援，才能讓更多老師在使用上更有動力、也更投入呢？",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425820
    },
    {
      "feedbackElementId": "fa1eed7e-2136-40f5-aec0-c193baaaddca_1769425874",
      "question": null,
      "feedbackType": 1,
      "feedbackOfText": "我覺得可以開設教學課程，可以讓大家更清楚知道怎麼使用他。",
      "feedbackFileUrl": null,
      "labels": [
        "培訓機制",
        "學習資源"
      ],
      "createTime": 1769425874
    },
    {
      "feedbackElementId": "b47b333a-9d3a-4554-b7e0-e443dd1232ff_1769425874",
      "question": "訪談到此已完成，感謝您的配合。",
      "feedbackType": null,
      "feedbackOfText": null,
      "feedbackFileUrl": null,
      "labels": [],
      "createTime": 1769425874
    }
  ],
  "createTime": 1769424853,
  "userCriteria": null,
  "feedbackScore": null,
  "feedbackScoreSummary": null
}
```

**Notes:**
- This is the **single-respondent version** of the feedback list response -- same shape as one item in `listenme_get_feedback_list`, but without the pagination wrapper.
- The `feedback` array contains 19 elements: 9 AI questions + 9 user responses + 1 closing message.
- The `feedbackElementId` format is `{uuid}_{unixTimestamp}`, which uniquely identifies each conversation turn.
- `durationSeconds: 1021` (~17 minutes) for a 9-question interview, averaging about 2 minutes per exchange.
- The `summary` field is a multi-line AI-generated summary with key takeaways organized by theme (preferences, pain points, decision criteria, suggestions).
- `userCriteria`, `feedbackScore`, and `feedbackScoreSummary` are all null here -- these would be populated if scoring criteria were configured for the task.

---

## 9. listenme_get_topics

**Description:** Returns the topic distribution and keywords extracted from all feedback for a task.

**Test call arguments:**
```
taskId = 160
```

**Response:**

```json
[
  {
    "topic": "Other",
    "amount": 33,
    "sentiment": "中性",
    "keywords": [
      "ai 會幻覺",
      "邊界條件",
      "正向",
      "內部 ai 助理",
      "焦慮",
      "品質下降",
      "notion ai",
      "prompt engineering",
      "壓力",
      "ai",
      "資安考量",
      "責任歸屬",
      "ai 使用政策",
      "ai 整理重點",
      "資料外洩風險",
      "效率",
      "教學",
      "備課",
      "稽核報告",
      "效率提升",
      "生成測試案例",
      "boilerplate code",
      "工作中不會使用到",
      "文件產出速度",
      "ai 字幕",
      "機密",
      "壓力變小",
      "全職講師",
      "資安風險",
      "法遵",
      "時間大幅減少",
      "寫規格書的效率",
      "claude code",
      "專業判斷",
      "整理市場新聞摘要",
      "翻譯外文報告",
      "內部 ai 工具",
      "超額報酬",
      "風險高",
      "canva ai",
      "寫作時間大概省了四成",
      "chatgpt",
      "microsoft copilot",
      "負向",
      "工作負擔",
      "分析圖片",
      "受訪的對象",
      "wolfram alpha",
      "hatgpt plus",
      "工作壓力減輕",
      "管理挑戰",
      "壓力更大",
      "資訊洩漏",
      "資安政策",
      "個別化教材",
      "深度洞察",
      "公信力",
      "gamma",
      "會議紀錄",
      "資料外洩",
      "黑箱模型",
      "ai 對市場的理解太淺",
      "學習新知",
      "公司強推 ai",
      "模型黑箱",
      "claude",
      "github copilot",
      "出題",
      "ai 幫我整理文獻",
      "自信心提升",
      "結束訪談",
      "prd",
      "花藝師",
      "寫公文",
      "kpi",
      "chatgpt enterprise",
      "ai 功能",
      "風險管理",
      "花材",
      "客戶資料",
      "中立偏負向",
      "產品資訊查詢",
      "review 工作",
      "信用風險",
      "寫複雜 sql",
      "ai 工具",
      "ai code",
      "cursor",
      "業績沒有直接影響",
      "教學熱情",
      "midjourney",
      "課程規劃",
      "維持競爭力",
      "錯誤判斷",
      "生成式 ai",
      "使用上限用滿",
      "團隊規範",
      "canva",
      "客戶資訊",
      "特教老師",
      "debug",
      "聯絡簿評語",
      "整理會議紀錄",
      "學習單",
      "發想",
      "ai 全程輔助",
      "ci/cd pipeline",
      "五分",
      "prompt",
      "極度正向"
    ]
  }
]
```

**Notes:**
- Returns an **array of topic objects**. In this case, all 33 feedback responses are categorized under a single "Other" topic because the task (taskId=160) was created before the multi-topic taxonomy was introduced.
- `amount` (33) matches the `completedCount` from the feedback overview.
- `sentiment: "中性"` (neutral) is the overall sentiment across all feedback for this topic.
- `keywords` is a large flat array of extracted keywords/phrases from all conversations -- these represent the key terms respondents used. The list includes:
  - AI tool names: `chatgpt`, `claude`, `github copilot`, `cursor`, `wolfram alpha`, `midjourney`, `canva ai`, `notion ai`, `microsoft copilot`
  - Sentiment indicators: `正向` (positive), `負向` (negative), `極度正向` (extremely positive), `中立偏負向` (neutral-negative)
  - Concern themes: `資安考量` (security concerns), `資料外洩` (data leakage), `黑箱模型` (black box model), `責任歸屬` (accountability)
  - Benefit themes: `效率提升` (efficiency improvement), `時間大幅減少` (significant time reduction), `自信心提升` (confidence boost)

---

## 10. listenme_get_feedback_analysis (analyzeType=1 -- Response Trend)

**Description:** Returns time-series data for response counts (total, valid, invalid, partial) over time.

**Test call arguments:**
```
taskId = 160
analyzeType = 1
```

**Response:**

```json
{
  "timestamp": [
    1770912000,
    1770998400,
    1771084800,
    1771171200,
    1771257600,
    1771344000,
    1771430400
  ],
  "labels": [
    "全部回覆",
    "有效回覆",
    "無效回覆",
    "不完整回覆"
  ],
  "datasets": [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
}
```

**Notes:**
- This is a **chart data format** designed for time-series visualization.
- `timestamp` contains Unix epoch timestamps (daily intervals). Each entry in `datasets` corresponds to one timestamp.
- `labels` define the four data series: "全部回覆" (all replies), "有效回覆" (valid replies), "無效回覆" (invalid replies), "不完整回覆" (incomplete replies).
- Each `datasets[i]` is an array of 4 values matching the 4 labels, for the day at `timestamp[i]`.
- All values are `0` here because taskId=160 has ended and these timestamps are from a future date range -- the data window may have shifted past the task's active period.

---

## 11. listenme_get_feedback_analysis (analyzeType=2 -- Sentiment Trend)

**Description:** Returns time-series data for sentiment distribution (positive, neutral, negative) over time.

**Test call arguments:**
```
taskId = 160
analyzeType = 2
```

**Response:**

```json
{
  "timestamp": [],
  "labels": [
    "正面",
    "中性",
    "負面"
  ],
  "datasets": []
}
```

**Notes:**
- Same chart data format as analyzeType=1, but tracks sentiment categories: "正面" (positive), "中性" (neutral), "負面" (negative).
- Both `timestamp` and `datasets` are empty arrays, indicating no sentiment trend data is available for this time window.
- The empty result is consistent with analyzeType=1 -- the analysis window does not overlap with the task's active collection period.

---

## 12. listenme_get_feedback_analysis (analyzeType=3 -- Topic Trend)

**Description:** Returns time-series data for topic distribution over time.

**Test call arguments:**
```
taskId = 160
analyzeType = 3
```

**Response:**

```json
{
  "timestamp": [],
  "labels": [
    "Other"
  ],
  "datasets": []
}
```

**Notes:**
- Same chart data format, tracking topic distribution over time.
- `labels` contains `["Other"]` matching the single topic from `listenme_get_topics`.
- Empty datasets for the same date-range reason as the other analyzeType responses.
- For tasks with the multi-topic taxonomy (like taskId=163), `labels` would contain all configured topic names.

---

## 13. listenme_get_key_insights

**Description:** Returns the AI-generated key insights summary for all feedback collected in a task, along with supporting reference quotes.

**Test call arguments:**
```
taskId = 160
```

**Response (reference array truncated):**

```json
{
  "keyInsights": "**摘要**\n本研究探討生成式人工智慧對科技業員工工作敬業度的影響。分析顯示，AI 工具提升工作效率，但也帶來潛在負面影響，如壓力增加和擔憂被取代。\n\n**主要發現**\n多數回饋顯示，使用 AI 工具超過三個月後，員工工作效率顯著提升，例如加速程式撰寫、報告生成和會議紀錄整理，讓員工能專注於高價值任務，部分用戶因此感到成就感增加。然而，部分用戶提到負面影響，包括 AI 生成內容需額外審查、隱性工作量上升，以及對職位安全的焦慮。多數回饋強調，敬業度因人而異，受工作挑戰性和公司政策影響。\n\n**AI洞察**\nAI 作為輔助工具，能正向提升敬業度，但需注意風險，如資安疑慮和過度依賴。多數用戶建議，公司應制定明確政策，提供培訓和資源，以最大化 AI 益處並減輕負面影響。",
  "count": 33,
  "updateTime": 1770102674,
  "analysisStatus": 2,
  "reference": [
    {
      "feedbackOfText": "極度負向。從資安角度來看，生成式 AI 是一個巨大的資料外洩風險點。員工可能不小心把機密資訊餵給外部 AI，後果不堪設想。",
      "labels": [
        "工作壓力",
        "焦慮感",
        "倫理考量"
      ],
      "feedbackLogId": 408,
      "feedbackElementId": "546c1824-91df-4409-ad4a-f1cf2f02d420_1769417353",
      "createTime": 1769417353
    },
    {
      "feedbackOfText": "負向。稽核的專業價值在於獨立性和專業判斷，用 AI 產出的東西有公信力嗎？被稽核單位會質疑我們的專業。",
      "labels": [
        "團隊互動",
        "合作障礙",
        "專業成長",
        "知識共享",
        "工作壓力"
      ],
      "feedbackLogId": 407,
      "feedbackElementId": "8c114a80-9815-4597-b191-4a43880c002c_1769417130",
      "createTime": 1769417130
    },
    {
      "feedbackOfText": "負向。基金操作績效是要對受益人負責的，我不可能把這種責任交給一個我不理解的黑箱模型。",
      "labels": [
        "AI依賴性",
        "決策輔助"
      ],
      "feedbackLogId": 406,
      "feedbackElementId": "9da755d8-a6c8-4ecf-886a-11d321d9ea3c_1769416951",
      "createTime": 1769416951
    }
  ]
}
```

> The `reference` array contains **23 total items**. Only the first 3 are shown above. The remaining 20 references follow the same structure with varying `feedbackOfText`, `labels`, `feedbackLogId`, `feedbackElementId`, and `createTime` values.

**Notes:**
- `keyInsights` is a **Markdown-formatted string** with sections: Summary, Main Findings, and AI Insights. This is the AI-generated synthesis of all 33 completed feedback responses.
- `count: 33` confirms the number of feedback responses that were analyzed.
- `analysisStatus: 2` indicates the analysis is complete (2 = completed; other values may indicate pending/in-progress).
- `updateTime` (1770102674) is when the insights were last generated/updated.
- Each `reference` item links back to a specific feedback element via `feedbackLogId` and `feedbackElementId`, allowing drill-down from the summary to the original respondent conversation.
- References include the full `feedbackOfText` quote and the AI-assigned `labels` for that response.
- The references span a range of sentiments (from "極度正向" / extremely positive to "極度負向" / extremely negative), giving a balanced view of the data behind the insights.

---

## 14. CRUD Tools — Tested Responses

Task create/update/delete were tested on 2026-02-20 with agentId=69.

### listenme_create_task

**Test call arguments:**
```json
{
  "aiAgentId": 69,
  "featureId": 4,
  "taskTypeId": 7,
  "name": "MCP Test Survey",
  "parameters": {
    "domain": "https://listenme.boxverse.ai",
    "productUrl": "https://example.com",
    "explanation": "Testing MCP create task",
    "question": [
      "What do you think about this product?",
      "Any suggestions for improvement?"
    ],
    "language": "en",
    "recruitmentType": 1
  }
}
```

**Response (success text):**
```
Task created successfully. Task ID: 172
```

**Notes:**
- Returns the new task ID as an integer
- Task is created with `taskStatus=1` (active) by default
- The task detail can immediately be read via `listenme_get_task_detail`
- Nested `parameters` object is sent as JSON body; signing uses `convertToString()` format matching Java `LinkedTreeMap.toString().replace(" ", "")`

**Created task detail (verified via `listenme_get_task_detail`):**
```json
{
  "taskId": 172,
  "agentName": "Boxverse Demo",
  "name": "MCP Test Survey",
  "taskType": 7,
  "taskTypeVersion": 1,
  "taskStatus": 1,
  "participants": 0,
  "parameters": {
    "domain": "https://listenme.boxverse.ai",
    "productUrl": "https://example.com",
    "explanation": "Testing MCP create task",
    "question": [
      "What do you think about this product?",
      "Any suggestions for improvement?"
    ],
    "language": "en",
    "recruitmentType": 1
  },
  "rewardInfo": null,
  "rewardSendType": "MANUALLY_SEND"
}
```

---

### listenme_update_task

**Test call arguments:**
```json
{
  "aiAgentId": 69,
  "featureId": 4,
  "taskId": 172,
  "taskTypeId": 7,
  "name": "MCP Test Survey (Updated)",
  "parameters": {
    "domain": "https://listenme.boxverse.ai",
    "productUrl": "https://example.com/v2",
    "explanation": "Testing MCP update task",
    "question": [
      "What do you think about this product?",
      "Any suggestions for improvement?",
      "Would you recommend it to a friend?"
    ],
    "language": "en",
    "recruitmentType": 1
  }
}
```

**Response (success text):**
```
Task 172 updated successfully.
```

**Notes:**
- The `parameters` must include ALL fields, not just changed ones (full replace)
- Verified changes: name updated, productUrl changed, 3rd question added
- Same signing logic as create — nested objects use `convertToString()` format

**Updated task detail (verified):**
```
name:       MCP Test Survey (Updated)
productUrl: https://example.com/v2
questions:  3 items
  [1] What do you think about this product?
  [2] Any suggestions for improvement?
  [3] Would you recommend it to a friend?
```

---

### listenme_delete_task

**Test call arguments:**
```json
{
  "aiAgentId": 69,
  "featureId": 4,
  "taskId": 172
}
```

**Response (success text):**
```
Task 172 deleted/cancelled successfully.
```

**Notes:**
- Active tasks (status=1) are **cancelled** (set to status=3), not permanently deleted
- Draft tasks may be fully deleted (status=4)
- Cancelled tasks are excluded from default list queries but can still be read via `get_task_detail`
- Verified: `taskStatus` changed to 3 (cancelled) after delete

---

## 15. Other Write Tools (not destructively tested)

The following write tools were not tested to avoid side effects on live data.

### listenme_manual_submit

**Description:** Manually submit a task for verification and reward distribution.

**Expected response:** `"Task {taskId} submitted successfully."`

### listenme_refund_task

**Description:** Request a refund for a task with refundable amount.

**Expected response:** `"Refund requested for task {taskId}."`

### listenme_reward_review

**Description:** Approve or reject the reward distribution list.

**Expected response:** `"Reward review for task {taskId}: approved."` or `"... rejected."`

### listenme_generate_key_insights

**Description:** Triggers async AI key insights generation. Poll with `listenme_get_key_insights` until `analysisStatus=2`.

**Expected response:** `"Key insights generation started for task {taskId}. Use listenme_get_key_insights to check progress."`

### listenme_update_feedback_log

**Description:** Highlight or exclude feedback items from analysis.

**Expected response:** `"Updated {count} feedback log(s) for task {taskId}."`

---

## Appendix: Common Response Patterns

### Pagination Wrapper (PageHelper)

All paginated endpoints use the following wrapper structure:

| Field | Type | Description |
|-------|------|-------------|
| `pageNum` | number | Current page number (1-based) |
| `pageSize` | number | Items per page |
| `size` | number | Actual items returned on this page |
| `total` | number | Total items across all pages |
| `pages` | number | Total number of pages |
| `list` | array | The actual data items |
| `isFirstPage` | boolean | Whether this is the first page |
| `isLastPage` | boolean | Whether this is the last page |
| `hasNextPage` | boolean | Whether a next page exists |
| `hasPreviousPage` | boolean | Whether a previous page exists |

### Error Response Format

```json
{"code": 10102, "msg": "Wrong parameter.", "data": null}
```

| Field | Type | Description |
|-------|------|-------------|
| `code` | number | Error code (10102 = parameter validation failure) |
| `msg` | string | Human-readable error message |
| `data` | null | Always null on error |

### Feedback Element Structure

Each element in a `feedback` conversation array follows this pattern:

| Field | Type | Description |
|-------|------|-------------|
| `feedbackElementId` | string | Unique ID in format `{uuid}_{unixTimestamp}` |
| `question` | string/null | AI interviewer's question (null for user responses) |
| `feedbackType` | number/null | `null` for questions, `1` for text responses |
| `feedbackOfText` | string/null | User's text response (null for AI questions) |
| `feedbackFileUrl` | string/null | URL to uploaded file (if any) |
| `labels` | array | AI-assigned topic labels (empty for questions) |
| `createTime` | number | Unix timestamp of this element |

### Task Status Codes

| `taskStatus` | Meaning |
|--------------|---------|
| 1 | Active / Ongoing |
| 2 | Ended |
| 3 | Cancelled / Archived |

### Survey Status Codes

| `surveyStatus` | Meaning |
|-----------------|---------|
| 3 | Completed |

### Analysis Status Codes

| `analysisStatus` | Meaning |
|-------------------|---------|
| 0 | Idle / Not running |
| 2 | Completed |
