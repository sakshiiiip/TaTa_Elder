import { AssistantResponse, ConversationMessage } from '../types';
import { DoctorBookingManager } from './doctorBookingManager';
import { BillPaymentManager } from './billPaymentManager';

function buildSystemPrompt(userLanguage: string): string {
  let languageInstruction = '';
  if (userLanguage.includes('Hindi') || userLanguage.includes('हिंदी')) {
    languageInstruction = `CRITICAL LANGUAGE RULE:
The user selected Hindi (हिंदी).
YOU MUST RESPOND ENTIRELY IN HINDI (Devanagari script).
DO NOT mix English sentences or English words unless standard medical specialty terms like डॉक्टर.
DO NOT use Hinglish. Everything in response, clarifying_question, suggested_next_step, and helpful_tip MUST BE 100% HINDI.
Keep sentences short, polite, respectful, and easy for senior citizens to understand.`;
  } else if (userLanguage.includes('Marathi') || userLanguage.includes('मराठी')) {
    languageInstruction = `CRITICAL LANGUAGE RULE:
The user selected Marathi (मराठी).
YOU MUST RESPOND ENTIRELY IN MARATHI (मराठी).
DO NOT mix English sentences. Keep sentences short, respectful, and simple for seniors.`;
  } else if (userLanguage.includes('Tamil') || userLanguage.includes('தமிழ்')) {
    languageInstruction = `CRITICAL LANGUAGE RULE:
The user selected Tamil (தமிழ்).
YOU MUST RESPOND ENTIRELY IN TAMIL (தமிழ்).
DO NOT mix English sentences. Keep sentences short, respectful, and simple for seniors.`;
  } else if (userLanguage.includes('Telugu') || userLanguage.includes('తెలుగు')) {
    languageInstruction = `CRITICAL LANGUAGE RULE:
The user selected Telugu (తెలుగు).
YOU MUST RESPOND ENTIRELY IN TELUGU (తెలుగు).
DO NOT mix English sentences. Keep sentences short, respectful, and simple for seniors.`;
  } else if (userLanguage.includes('Bengali') || userLanguage.includes('বাংলা')) {
    languageInstruction = `CRITICAL LANGUAGE RULE:
The user selected Bengali (বাংলা).
YOU MUST RESPOND ENTIRELY IN BENGALI (বাংলা).
DO NOT mix English sentences. Keep sentences short, respectful, and simple for seniors.`;
  } else {
    languageInstruction = `CRITICAL LANGUAGE RULE:
The user selected English.
YOU MUST RESPOND ENTIRELY IN CLEAR, POLITE ENGLISH.
DO NOT use Hindi words or Hinglish phrases. Keep sentences short, warm, and easy for senior citizens.`;
  }

  return `
You are "Sahaay", a calm, empathetic, and intelligent voice assistant helping elderly senior citizens book medical appointments, pay utility bills, and get digital assistance.

${languageInstruction}

### CONVERSATION FLOW FOR DOCTOR BOOKING:
When the user expresses an intent to book a doctor (e.g., "book a doctor", "I need an appointment", "find a doctor"), guide them through a step-by-step sequential dialogue to gather all necessary details.

Follow this EXACT sequential question flow:
1. Specialty / Doctor Type:
   - Ask which type of doctor they need (e.g., General Physician, Dermatologist, Cardiologist).
2. Location / Place:
   - Ask which area, city, or clinic location they prefer.
3. Preferred Date and Time:
   - Ask what date and time work best for them.
4. Consultation Mode:
   - Ask if they prefer an in-person clinic visit or an online consultation.
5. Confirmation:
   - Summarize all details (Doctor Type, Location, Date/Time, Visit Mode) and ask the user to confirm.
6. When the user confirms (e.g. "yes", "confirm", "sure"):
   - Acknowledge warmly that the appointment is confirmed.

### CONVERSATION FLOW FOR PAY BILLS:
When the user expresses an intent to pay a bill (e.g., "pay my bill", "recharge my phone", "pay electricity"):
Guide them step-by-step through a sequential dialogue. Ask ONLY ONE question at a time.

1. Bill Category / Type (if not specified):
   - Ask which bill they would like to pay (Electricity, Water, or Mobile Recharge).
2. Account Identifier / Details:
   - For Electricity: Ask for their Consumer or Account ID.
   - For Water: Ask for their Water Consumer / Meter Number.
   - For Mobile Recharge: Ask for the 10-digit mobile number to recharge.
3. Provider / Operator (if applicable):
   - Ask for their service provider or operator (e.g., Adani Electricity, Tata Power, Jio, Airtel).
4. Amount:
   - Ask how much amount they would like to pay or recharge.
5. Confirmation:
   - Summarize details (Amount, Bill Type, Provider, Account ID) and ask to proceed to payment.
6. When the user confirms:
   - Acknowledge warmly that the payment has been processed successfully.

### CONVERSATIONAL RULES:
- Ask ONLY ONE question at a time to keep the voice interface clear and simple.
- Strictly adhere to the selected language: If English, 100% English. If Hindi, 100% Hindi. Never mix Hindi and English.
- Keep responses short, empathetic, clear, and voice-friendly.
- If an input is unclear, ambiguous, or incomplete, ask a polite clarifying question instead of failing.
- NEVER expose technical jargon, stack traces, or HTTP codes to the user.
- NEVER use markdown formatting (no asterisks, no bullet points, no bold). Only plain sentences separated by commas or periods.

### KNOWN INTENTS:
BOOK_APPOINTMENT, PAY_BILL, FILL_FORM, EXPLAIN_TERM, ASK_QUESTION, EMERGENCY_HELP, VOCAL_ANCHOR, REPAIR, GENERAL

You MUST return ONLY valid JSON matching this schema:
{
  "intent": "PAY_BILL",
  "goal": "Short description of goal",
  "response": "Your main spoken response (single question or confirmation, plain text without markdown, in the chosen language)",
  "needs_clarification": true or false,
  "clarifying_question": "Single question string if asking for info, or null",
  "suggested_next_step": "Short helper tip for user or null",
  "helpful_tip": "Optional brief safety or preparation tip or null"
}
`.trim();
}

function cleanTtsText(text: string): string {
  return text
    .replace(/\*{1,2}/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .trim();
}

export const GeminiLlmService = {
  async analyze(
    transcript: string,
    conversation: ConversationMessage[] = [],
    userLanguage: string = 'English (India)'
  ): Promise<AssistantResponse> {
    const isHindi = userLanguage.includes('Hindi') || userLanguage.includes('हिंदी');

    if (!transcript || !transcript.trim()) {
      return {
        intent: 'REPAIR',
        goal: 'Prompt user to speak',
        response: isHindi
          ? "मैं सुन नहीं पाया। कृपया दोबारा बोलिए।"
          : "I didn't catch that. Could you please try speaking again?",
        needsClarification: true,
        clarifyingQuestion: isHindi
          ? "मैं सुन नहीं पाया। कृपया दोबारा बोलिए।"
          : "I didn't catch that. Could you please try speaking again?",
      };
    }

    const isDoctorBooking = DoctorBookingManager.isDoctorBookingIntent(transcript, conversation);
    const isBillPayment = BillPaymentManager.isBillPaymentIntent(transcript, conversation);

    // Build history alternating user/model
    const rawMessages: { role: 'user' | 'model'; text: string }[] = [];
    const recent = conversation.slice(-10);
    for (const msg of recent) {
      if (msg.text.trim()) {
        rawMessages.push({
          role: msg.role === 'USER' ? 'user' : 'model',
          text: msg.text,
        });
      }
    }
    rawMessages.push({ role: 'user', text: transcript });

    // Merge consecutive messages with the same role
    const mergedHistory: { role: string; parts: { text: string }[] }[] = [];
    for (const item of rawMessages) {
      if (mergedHistory.length > 0 && mergedHistory[mergedHistory.length - 1].role === item.role) {
        mergedHistory[mergedHistory.length - 1].parts[0].text += `\n${item.text}`;
      } else {
        mergedHistory.push({
          role: item.role,
          parts: [{ text: item.text }],
        });
      }
    }

    const systemInstruction = buildSystemPrompt(userLanguage);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction,
          contents: mergedHistory,
          userLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.fallback) {
          // Fallback to deterministic flow managers
          if (isDoctorBooking) {
            const state = DoctorBookingManager.extractState(conversation, transcript);
            return DoctorBookingManager.getNextStepResponse(state, userLanguage);
          }
          if (isBillPayment) {
            const state = BillPaymentManager.extractState(conversation, transcript);
            return BillPaymentManager.getNextStepResponse(state, userLanguage);
          }
          return {
            intent: 'GENERAL',
            goal: 'Assistance',
            response: isHindi
              ? "मैं आपकी सहायता के लिए तैयार हूँ। क्या आप डॉक्टर अपॉइंटमेंट बुक करना चाहते हैं या बिजली/पानी का बिल भरना चाहते हैं?"
              : "I'm here to help you. Would you like to book a doctor appointment, pay an electricity/water bill, or recharge your mobile?",
          };
        }

        const candidates = data.candidates;
        if (candidates && candidates.length > 0) {
          const text = candidates[0]?.content?.parts?.[0]?.text;
          if (text) {
            return this.parseStructuredResponse(text, transcript, conversation, userLanguage);
          }
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to deterministic flow:', e);
    }

    // Deterministic fallback if API fails
    if (isDoctorBooking) {
      const state = DoctorBookingManager.extractState(conversation, transcript);
      return DoctorBookingManager.getNextStepResponse(state, userLanguage);
    }
    if (isBillPayment) {
      const state = BillPaymentManager.extractState(conversation, transcript);
      return BillPaymentManager.getNextStepResponse(state, userLanguage);
    }

    return {
      intent: 'GENERAL',
      goal: 'Assistance',
      response: isHindi
        ? "मैंने आपका अनुरोध समझ लिया है। क्या आप डॉक्टर अपॉइंटमेंट बुक करना चाहते हैं या बिल भरना चाहते हैं?"
        : "I understood your request. Would you like to schedule a doctor visit or settle utility bills today?",
      suggestedNextStep: isHindi
        ? "आप कह सकते हैं 'डॉक्टर बुक करें' या 'बिजली का बिल भरें'।"
        : "You can say 'Book a doctor' or 'Pay electricity bill'.",
    };
  },

  parseStructuredResponse(
    jsonText: string,
    transcript: string,
    conversation: ConversationMessage[],
    userLanguage: string = 'English (India)'
  ): AssistantResponse {
    const isHindi = userLanguage.includes('Hindi') || userLanguage.includes('हिंदी');
    try {
      let cleaned = jsonText.trim();
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start >= 0 && end > start) {
        cleaned = cleaned.substring(start, end + 1);
      }

      const obj = JSON.parse(cleaned);

      const intent = obj.intent || 'GENERAL';
      const responseText = obj.response?.trim() || '';
      const clarification = obj.clarifying_question?.trim() || null;
      const needsClarification = Boolean(obj.needs_clarification);

      const defaultPrompt = isHindi
        ? (intent === 'PAY_BILL'
            ? 'आप कौन सा बिल भरना चाहते हैं? (बिजली, पानी या मोबाइल रिचार्ज)'
            : intent === 'BOOK_APPOINTMENT'
            ? 'आप किस प्रकार के डॉक्टर को बुक करना चाहते हैं? (जैसे जनरल फिजिशियन, कार्डियोलॉजिस्ट)'
            : 'मैं आपकी क्या मदद कर सकता हूँ?')
        : (intent === 'PAY_BILL'
            ? 'Which bill would you like to pay? (Electricity, Water, or Mobile Recharge)'
            : intent === 'BOOK_APPOINTMENT'
            ? 'Which type of doctor would you like to book? (e.g., General Physician, Dermatologist, Cardiologist)'
            : 'How may I help you today?');

      const finalResponse = responseText || (needsClarification && clarification ? clarification : defaultPrompt);

      return {
        intent,
        goal: obj.goal || 'Assistance',
        response: cleanTtsText(finalResponse),
        needsClarification,
        clarifyingQuestion: clarification ? cleanTtsText(clarification) : null,
        suggestedNextStep: obj.suggested_next_step ? cleanTtsText(obj.suggested_next_step) : null,
        helpfulTip: obj.helpful_tip ? cleanTtsText(obj.helpful_tip) : null,
      };
    } catch (err) {
      console.warn('Failed to parse structured JSON from Gemini:', err);
      if (DoctorBookingManager.isDoctorBookingIntent(transcript, conversation)) {
        const state = DoctorBookingManager.extractState(conversation, transcript);
        return DoctorBookingManager.getNextStepResponse(state, userLanguage);
      }
      if (BillPaymentManager.isBillPaymentIntent(transcript, conversation)) {
        const state = BillPaymentManager.extractState(conversation, transcript);
        return BillPaymentManager.getNextStepResponse(state, userLanguage);
      }
      return {
        intent: 'GENERAL',
        goal: 'Assistance',
        response: isHindi
          ? 'मैंने आपका अनुरोध समझ लिया है। क्या आप थोड़ा और बता सकते हैं?'
          : 'I understood your request. Could you please tell me a little more?',
      };
    }
  },
};
