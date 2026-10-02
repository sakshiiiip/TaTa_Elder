import { AssistantResponse, ConversationMessage, DoctorBookingState } from '../types';

const DOCTOR_INTENT_KEYWORDS = [
  'doctor', 'appointment', 'book a doctor', 'see a doctor',
  'consult a doctor', 'medical appointment', 'physician',
  'dermatologist', 'cardiologist', 'pediatrician', 'dentist',
  'orthopedic', 'neurologist', 'gynecologist', 'ent specialist',
  'eye specialist', 'clinic', 'hospital', 'dr', 'dr.'
];

const KNOWN_SPECIALTIES = [
  'General Physician', 'Dermatologist', 'Cardiologist',
  'Pediatrician', 'Dentist', 'Orthopedic', 'Neurologist',
  'Gynecologist', 'ENT Specialist', 'Eye Specialist',
  'Psychiatrist', 'Oncologist', 'Urologist', 'Gastroenterologist',
  'Physiotherapist', 'Diabetologist', 'Surgeon'
];

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const DoctorBookingManager = {
  isDoctorBookingIntent(transcript: string, conversation: ConversationMessage[]): boolean {
    const lowerTranscript = transcript.toLowerCase();
    if (DOCTOR_INTENT_KEYWORDS.some(k => lowerTranscript.includes(k))) {
      return true;
    }

    const lastAssistantMsg = [...conversation]
      .reverse()
      .find(m => m.role === 'ASSISTANT')?.text.toLowerCase();

    if (lastAssistantMsg) {
      if (
        lastAssistantMsg.includes('type of doctor') ||
        lastAssistantMsg.includes('area, city, or clinic') ||
        lastAssistantMsg.includes('date and time') ||
        lastAssistantMsg.includes('in-person clinic visit or an online') ||
        lastAssistantMsg.includes('confirm this booking') ||
        lastAssistantMsg.includes('appointment details')
      ) {
        return true;
      }
    }

    return false;
  },

  extractState(conversation: ConversationMessage[], currentTranscript: string): DoctorBookingState {
    const state: DoctorBookingState = {
      specialty: null,
      location: null,
      dateTime: null,
      mode: null,
      isConfirmed: false,
    };

    let lastQuestion = '';

    for (const msg of conversation) {
      if (msg.role === 'USER') {
        this.parseUserUtterance(msg.text, lastQuestion, state);
      } else {
        lastQuestion = msg.text.toLowerCase();
      }
    }

    this.parseUserUtterance(currentTranscript, lastQuestion, state);

    return state;
  },

  parseUserUtterance(text: string, lastQuestion: string, state: DoctorBookingState): void {
    const lower = text.toLowerCase().trim();

    // 1. Confirmation check
    if (lastQuestion.includes('confirm this booking') || lastQuestion.includes('like me to confirm')) {
      if (
        lower.includes('yes') || lower.includes('confirm') || lower.includes('sure') ||
        lower.includes('ha') || lower.includes('haa') || lower.includes('yep') ||
        lower.includes('proceed') || lower.includes('ok') || lower.includes('okay') ||
        lower.includes('correct')
      ) {
        state.isConfirmed = true;
        return;
      }
    }

    // 2. Specialty Extraction
    for (const spec of KNOWN_SPECIALTIES) {
      if (lower.includes(spec.toLowerCase())) {
        state.specialty = spec;
        break;
      }
    }

    if (!state.specialty) {
      if (
        lower.includes('general physician') || lower.includes('physician') ||
        lower.includes('general doctor') || lower.includes('normal doctor') ||
        lower.includes('family doctor')
      ) {
        state.specialty = 'General Physician';
      } else if (lower.includes('skin') || lower.includes('derma')) {
        state.specialty = 'Dermatologist';
      } else if (lower.includes('heart') || lower.includes('cardio')) {
        state.specialty = 'Cardiologist';
      } else if (lower.includes('child') || lower.includes('kid') || lower.includes('pedia')) {
        state.specialty = 'Pediatrician';
      } else if (lower.includes('teeth') || lower.includes('tooth') || lower.includes('dental')) {
        state.specialty = 'Dentist';
      } else if (lower.includes('bone') || lower.includes('joint') || lower.includes('ortho')) {
        state.specialty = 'Orthopedic';
      } else if (lower.includes('eye') || lower.includes('vision') || lower.includes('opt')) {
        state.specialty = 'Eye Specialist';
      } else if (lower.includes('ear') || lower.includes('nose') || lower.includes('throat')) {
        state.specialty = 'ENT Specialist';
      } else if (lastQuestion.includes('type of doctor')) {
        const cleaned = text
          .replace(/^(i want|i need|book a|book an|please book)\s+/i, '')
          .trim();
        if (cleaned && !cleaned.includes('in-person') && !cleaned.includes('online')) {
          state.specialty = capitalizeWords(cleaned);
        }
      }
    }

    // 3. Consultation Mode
    if (
      lower.includes('in-person') || lower.includes('in person') ||
      lower.includes('clinic visit') || lower.includes('visit') ||
      lower.includes('offline') || lower.includes('hospital visit')
    ) {
      state.mode = 'in-person clinic visit';
    } else if (
      lower.includes('online') || lower.includes('video') ||
      lower.includes('teleconsult') || lower.includes('virtual') ||
      lower.includes('phone call')
    ) {
      state.mode = 'online consultation';
    } else if (lastQuestion.includes('in-person clinic visit or an online')) {
      if (lower.includes('first') || lower.includes('clinic') || lower.includes('hospital')) {
        state.mode = 'in-person clinic visit';
      } else if (lower.includes('second') || lower.includes('call') || lower.includes('video')) {
        state.mode = 'online consultation';
      }
    }

    // 4. Location
    if (!state.location) {
      const locMatch = text.match(/\b(in|at|near|around)\s+([A-Za-z0-9\s]{3,30}?)(?=\s+(for|at|on|tomorrow|today|next|in-person|online|visit)|$)/i);
      if (locMatch) {
        const candidate = locMatch[2].trim();
        const isTimeLike = /(?:\d{1,2}(?::\d{2})?\s*(?:am|pm)|tomorrow|today|morning|evening|night|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(candidate);
        if (!isTimeLike && candidate.toLowerCase() !== 'person' && candidate.toLowerCase() !== 'line' && candidate.length > 2) {
          state.location = capitalizeWords(candidate);
        }
      } else if (lastQuestion.includes('area, city, or clinic') || lastQuestion.includes('location do you prefer')) {
        const cleaned = text.replace(/^(in|at|near|i prefer|i want|prefer)\s+/i, '').trim();
        if (
          cleaned &&
          !/tomorrow|today|pm|am/i.test(cleaned)
        ) {
          state.location = capitalizeWords(cleaned);
        }
      }
    }

    // 5. Date & Time
    const timePatterns = [
      /\b(tomorrow|today|tonight|next\s+\w+|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i,
      /\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i,
      /\b\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(\s+at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?)?/i,
      /\b(morning|afternoon|evening|night)\b/i,
    ];

    for (const pattern of timePatterns) {
      const match = text.match(pattern);
      if (match) {
        state.dateTime = match[0].trim();
        break;
      }
    }

    if (!state.dateTime && (lastQuestion.includes('date and time') || lastQuestion.includes('work best for you'))) {
      state.dateTime = text.trim();
    }
  },

  getNextStepResponse(state: DoctorBookingState, userLanguage: string = 'English (India)'): AssistantResponse {
    const isHindi = userLanguage.includes('Hindi') || userLanguage.includes('हिंदी');

    // Step 1: Specialty
    if (!state.specialty) {
      const q = isHindi
        ? 'आप किस प्रकार के डॉक्टर को बुक करना चाहते हैं? (जैसे जनरल फिजिशियन, त्वचा रोग विशेषज्ञ, हृदय रोग विशेषज्ञ)'
        : 'Which type of doctor would you like to book? (e.g., General Physician, Dermatologist, Cardiologist)';
      const step = isHindi
        ? 'डॉक्टर का प्रकार बताएं, जैसे जनरल फिजिशियन या त्वचा रोग विशेषज्ञ।'
        : 'Say the type of doctor you need, like General Physician or Dermatologist.';
      return {
        intent: 'BOOK_APPOINTMENT',
        goal: 'Ask doctor specialty',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 2: Location
    if (!state.location) {
      const q = isHindi
        ? 'आप कौन सा क्षेत्र, शहर या क्लिनिक स्थान पसंद करते हैं?'
        : 'Which area, city, or clinic location do you prefer?';
      const step = isHindi
        ? 'अपना पसंदीदा इलाका या क्लिनिक बताएं, जैसे बांद्रा या सेंट्रल क्लिनिक।'
        : 'Mention your preferred area or city, for example Bandra or Central Clinic.';
      return {
        intent: 'BOOK_APPOINTMENT',
        goal: 'Ask preferred location',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 3: Date and Time
    if (!state.dateTime) {
      const q = isHindi
        ? 'आपके लिए कौन सा दिन और समय सबसे अच्छा रहेगा?'
        : 'What date and time work best for you?';
      const step = isHindi
        ? 'अपना समय बताएं, जैसे कल शाम 5 बजे या सोमवार सुबह।'
        : 'Mention your preferred time, like tomorrow at 5 PM or Monday morning.';
      return {
        intent: 'BOOK_APPOINTMENT',
        goal: 'Ask preferred date and time',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 4: Consultation Mode
    if (!state.mode) {
      const q = isHindi
        ? 'क्या आप क्लिनिक जाकर दिखाना चाहते हैं या ऑनलाइन परामर्श पसंद करेंगे?'
        : 'Would you prefer an in-person clinic visit or an online consultation?';
      const step = isHindi
        ? 'क्लिनिक विजिट या ऑनलाइन परामर्श कहें।'
        : 'Say in-person clinic visit or online consultation.';
      return {
        intent: 'BOOK_APPOINTMENT',
        goal: 'Ask consultation mode',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 5: Confirmation
    if (!state.isConfirmed) {
      const summary = isHindi
        ? `मैंने आपका विवरण दर्ज कर लिया है: ${state.location} में ${state.specialty}, ${state.dateTime} को ${state.mode} के लिए। क्या मैं यह अपॉइंटमेंट पक्की कर दूँ?`
        : `I have noted your appointment details: ${state.specialty} in ${state.location} on ${state.dateTime} for an ${state.mode}. Would you like me to confirm this booking?`;
      const step = isHindi
        ? 'पुष्टि करने के लिए हाँ कहें, या बदलाव बताएं।'
        : 'Say yes to confirm, or tell me if you want to change any detail.';
      return {
        intent: 'BOOK_APPOINTMENT',
        goal: 'Confirm appointment details',
        response: summary,
        needsClarification: true,
        clarifyingQuestion: summary,
        suggestedNextStep: step,
      };
    }

    // Completed
    const confirmedMsg = isHindi
      ? `आपकी ${state.specialty} के लिए ${state.location} में ${state.dateTime} (${state.mode}) की अपॉइंटमेंट पक्की हो गई है! क्या मैं आपकी किसी और चीज़ में मदद कर सकता हूँ?`
      : `Your appointment for ${state.specialty} in ${state.location} on ${state.dateTime} (${state.mode}) has been confirmed! Is there anything else I can help you with?`;
    return {
      intent: 'BOOK_APPOINTMENT',
      goal: 'Appointment confirmed',
      response: confirmedMsg,
      needsClarification: false,
      clarifyingQuestion: null,
      suggestedNextStep: isHindi
        ? 'आप कोई अन्य सवाल या स्वास्थ्य सलाह पूछ सकते हैं।'
        : 'You can ask for another appointment or any health guidance.',
      helpfulTip: isHindi
        ? 'कृपया 10 मिनट पहले पहुंचें अथवा ऑनलाइन परामर्श के लिए इंटरनेट तैयार रखें।'
        : 'Please arrive 10 minutes early or ensure your internet connection is ready for online consultation.',
    };
  },
};
