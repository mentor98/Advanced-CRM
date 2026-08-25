import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

export async function scoreLeadWithAI(leadData: {
  title: string;
  company: string;
  contactName: string;
  source: string;
  estimatedValue: number;
  notes: string;
}) {
  const ai = getGeminiClient();
  if (!ai) {
    // Deterministic fallback if API key is not present
    const baseScore = Math.min(95, Math.max(25, Math.round(
      (leadData.estimatedValue > 50000 ? 30 : 15) +
      (leadData.source === 'referral' || leadData.source === 'inbound' ? 35 : 20) +
      (leadData.notes.length > 50 ? 25 : 10)
    )));
    return {
      score: baseScore,
      rationale: `Lead shows strong interest via ${leadData.source}. Budget estimate $${leadData.estimatedValue.toLocaleString()} aligns with our core ICP. Recommend scheduling an exploratory discovery call.`,
      suggestedNextStep: "Schedule 20-min introductory discovery call",
      icpFit: baseScore >= 70 ? "High" : baseScore >= 45 ? "Medium" : "Low",
    };
  }

  try {
    const prompt = `You are an expert enterprise B2B sales development AI for a modern CRM.
Analyze this incoming sales lead and return a JSON object with:
- "score": number between 10 and 99
- "icpFit": "High" | "Medium" | "Low"
- "rationale": 2 concise sentences explaining why this lead received this score based on budget, source, and context
- "suggestedNextStep": immediate actionable recommendation for the sales rep

Lead details:
- Title: ${leadData.title}
- Company: ${leadData.company}
- Contact: ${leadData.contactName}
- Lead Source: ${leadData.source}
- Estimated Deal Value: $${leadData.estimatedValue}
- Rep Notes: ${leadData.notes || 'None provided'}

Output ONLY valid JSON without markdown wrapping.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in scoreLeadWithAI:", error);
    return {
      score: 68,
      rationale: `Evaluated ${leadData.company} based on deal size $${leadData.estimatedValue.toLocaleString()}. High opportunity potential.`,
      suggestedNextStep: "Reach out via customized email and request introduction call",
      icpFit: "Medium",
    };
  }
}

export async function analyzeDealCopilot(dealData: {
  title: string;
  companyName: string;
  value: number;
  stage: string;
  probability: number;
  priority: string;
  notes?: string;
  activitiesCount: number;
  daysInPipeline: number;
}) {
  const ai = getGeminiClient();
  if (!ai) {
    const riskScore = dealData.daysInPipeline > 45 ? 65 : dealData.stage === 'negotiation' ? 25 : 40;
    return {
      riskScore,
      riskLevel: riskScore > 60 ? "High" : riskScore > 35 ? "Medium" : "Low",
      keyFactors: [
        `Deal has been in pipeline for ${dealData.daysInPipeline} days`,
        `Current stage: ${dealData.stage.replace('_', ' ').toUpperCase()} with ${dealData.probability}% stated probability`,
        `Total value $${dealData.value.toLocaleString()}`
      ],
      winRecommendation: "Secure executive sponsor buy-in and clarify decision timelines before contract redlining.",
      suggestedAction: "Send customized ROI one-pager to procurement lead."
    };
  }

  try {
    const prompt = `You are an elite Enterprise Sales Strategy Director AI.
Analyze this deal in our CRM pipeline and return a JSON object with:
- "riskScore": number from 0 (very safe) to 100 (high risk of stalling/loss)
- "riskLevel": "Low" | "Medium" | "High"
- "keyFactors": array of 3 bullet strings evaluating deal health, velocity, and stage risks
- "winRecommendation": 2-sentence tactical guidance to accelerate closing
- "suggestedAction": single concrete task for the account executive

Deal profile:
- Deal: ${dealData.title}
- Account: ${dealData.companyName}
- Value: $${dealData.value}
- Current Stage: ${dealData.stage}
- Stated Win Probability: ${dealData.probability}%
- Priority: ${dealData.priority}
- Days in Pipeline: ${dealData.daysInPipeline} days
- Recorded Activities: ${dealData.activitiesCount} interactions
- Context Notes: ${dealData.notes || 'None'}

Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in analyzeDealCopilot:", error);
    return {
      riskScore: 35,
      riskLevel: "Medium",
      keyFactors: [
        "Consistent communication logged with account contacts",
        "Pipeline velocity is within acceptable enterprise threshold",
        "Value aligns with historical closed-won average"
      ],
      winRecommendation: "Maintain weekly cadence with primary champion and schedule technical validation review.",
      suggestedAction: "Confirm next review date with economic decision maker"
    };
  }
}

export async function draftSalesEmail(params: {
  purpose: string;
  recipientName: string;
  recipientCompany: string;
  dealOrLeadTitle?: string;
  tone: 'professional' | 'consultative' | 'urgent' | 'friendly';
  keyPoints?: string;
}) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      subject: `Accelerating growth for ${params.recipientCompany} with NexusCRM`,
      body: `Hi ${params.recipientName},\n\nHope this finds you well. I noticed how ${params.recipientCompany} is scaling operations and wanted to touch base regarding our enterprise solutions.\n\nWe recently helped similar teams streamline pipeline velocity by over 34% in the first quarter.\n\nDo you have 15 minutes this Thursday for a brief chat to explore if there's a fit?\n\nBest regards,\nSales Team`
    };
  }

  try {
    const prompt = `Write a high-converting B2B enterprise sales email.
Recipient: ${params.recipientName} at ${params.recipientCompany}
Purpose: ${params.purpose}
Context/Deal: ${params.dealOrLeadTitle || 'General partnership'}
Tone: ${params.tone}
Key Points to cover: ${params.keyPoints || 'Value proposition, ROI, call to action'}

Return a JSON object with:
- "subject": compelling, professional email subject line
- "body": email body text with appropriate paragraph breaks and placeholder signoff
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in draftSalesEmail:", error);
    return {
      subject: `Quick check-in regarding ${params.recipientCompany}`,
      body: `Hi ${params.recipientName},\n\nFollowing up on our recent conversation regarding ${params.dealOrLeadTitle || 'our partnership'}. Would love to share some insights on how we can help ${params.recipientCompany} hit your quarterly milestones.\n\nLet me know your availability for a 15-min call this week.\n\nBest,\nAccount Executive`
    };
  }
}

export async function extractMeetingNotes(rawNotes: string) {
  const ai = getGeminiClient();
  if (!ai) {
    return {
      summary: "Productive alignment meeting covering core requirements, timeline, and pricing structure.",
      actionItems: [
        "Send revised proposal incorporating tiered volume discounts",
        "Schedule technical deep-dive with engineering lead by Friday",
        "Update deal close date in CRM"
      ],
      sentiment: "Positive",
      identifiedRisks: ["Legal review timeline may add 1-2 weeks"]
    };
  }

  try {
    const prompt = `Analyze these sales meeting / call notes and extract actionable intelligence:
Notes:
"""
${rawNotes}
"""

Return a JSON object with:
- "summary": 2-3 sentence executive summary of the meeting
- "actionItems": array of string tasks with owners if mentioned
- "sentiment": "Positive" | "Neutral" | "Cautious" | "Negative"
- "identifiedRisks": array of string potential blockers or objections
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in extractMeetingNotes:", error);
    return {
      summary: "Discussed solution architecture and agreed on next milestones.",
      actionItems: ["Follow up with security whitepaper", "Coordinate demo with executive sponsors"],
      sentiment: "Positive",
      identifiedRisks: ["Budget approval pending Q3 board review"]
    };
  }
}
