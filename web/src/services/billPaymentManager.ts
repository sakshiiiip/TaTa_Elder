import { AssistantResponse, BillCategoryType, ConversationMessage } from '../types';

export interface PaymentFlowState {
  billType: BillCategoryType | null;
  accountId: string | null;
  provider: string | null;
  amount: string | null;
  isConfirmed: boolean;
}

const BILL_PAYMENT_INTENT_KEYWORDS = [
  'pay bill', 'pay my bill', 'pay bills', 'bill payment',
  'recharge', 'recharge my phone', 'recharge phone', 'recharge mobile', 'mobile recharge',
  'phone recharge', 'electricity bill', 'water bill', 'bijli bill', 'light bill',
  'current bill', 'phone bill', 'pay electricity', 'pay water', 'pay mobile',
  'electricity payment', 'water payment', 'mobile payment'
];

function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export const BillPaymentManager = {
  isBillPaymentIntent(transcript: string, conversation: ConversationMessage[]): boolean {
    const lowerTranscript = transcript.toLowerCase();
    if (BILL_PAYMENT_INTENT_KEYWORDS.some(k => lowerTranscript.includes(k))) {
      return true;
    }

    const lastAssistantMsg = [...conversation]
      .reverse()
      .find(m => m.role === 'ASSISTANT')?.text.toLowerCase();

    if (lastAssistantMsg) {
      if (
        lastAssistantMsg.includes('which bill would you like to pay') ||
        lastAssistantMsg.includes('consumer or account id') ||
        lastAssistantMsg.includes('water consumer / meter number') ||
        lastAssistantMsg.includes('water consumer') ||
        lastAssistantMsg.includes('mobile number would you like to recharge') ||
        lastAssistantMsg.includes('service provider or operator') ||
        lastAssistantMsg.includes('how much amount would you like to pay') ||
        lastAssistantMsg.includes('should i proceed to payment') ||
        lastAssistantMsg.includes('set up a payment of')
      ) {
        return true;
      }
    }

    return false;
  },

  extractState(conversation: ConversationMessage[], currentTranscript: string): PaymentFlowState {
    const state: PaymentFlowState = {
      billType: null,
      accountId: null,
      provider: null,
      amount: null,
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

  parseUserUtterance(text: string, lastQuestion: string, state: PaymentFlowState): void {
    const lower = text.toLowerCase().trim();

    // 1. Confirmation check
    if (lastQuestion.includes('should i proceed to payment') || lastQuestion.includes('proceed to payment')) {
      if (
        lower.includes('yes') || lower.includes('proceed') || lower.includes('sure') ||
        lower.includes('confirm') || lower.includes('ha') || lower.includes('haa') ||
        lower.includes('yep') || lower.includes('ok') || lower.includes('okay') ||
        lower.includes('pay') || lower.includes('correct') || lower.includes('do it')
      ) {
        state.isConfirmed = true;
        return;
      }
    }

    // 2. Bill Type Extraction
    if (!state.billType) {
      if (
        lower.includes('electricity') || lower.includes('bijli') || lower.includes('power') ||
        lower.includes('light bill') || lower.includes('current bill')
      ) {
        state.billType = 'ELECTRICITY';
      } else if (
        lower.includes('water') || lower.includes('pani') || lower.includes('jal') || lower.includes('meter')
      ) {
        state.billType = 'WATER';
      } else if (
        lower.includes('mobile') || lower.includes('recharge') || lower.includes('phone') ||
        lower.includes('sim') || lower.includes('prepaid') || lower.includes('postpaid')
      ) {
        state.billType = 'MOBILE';
      } else if (lastQuestion.includes('which bill would you like to pay')) {
        if (lower.includes('first') || lower.includes('electric')) {
          state.billType = 'ELECTRICITY';
        } else if (lower.includes('second') || lower.includes('water')) {
          state.billType = 'WATER';
        } else if (lower.includes('third') || lower.includes('mobile') || lower.includes('recharge')) {
          state.billType = 'MOBILE';
        }
      }
    }

    // 3. Provider Extraction
    if (!state.provider) {
      if (lower.includes('adani electricity') || lower.includes('adani')) {
        state.provider = 'Adani Electricity';
      } else if (lower.includes('tata power') || (lower.includes('tata') && state.billType === 'ELECTRICITY')) {
        state.provider = 'Tata Power';
      } else if (lower.includes('msedcl') || lower.includes('mahadiscom')) {
        state.provider = 'MSEDCL';
      } else if (lower.includes('bescom')) {
        state.provider = 'BESCOM';
      } else if (lower.includes('torrent power') || lower.includes('torrent')) {
        state.provider = 'Torrent Power';
      } else if (lower.includes('bses yamuna') || lower.includes('bses rajdhani') || lower.includes('bses')) {
        state.provider = 'BSES';
      } else if (lower.includes('jio')) {
        state.provider = 'Jio';
      } else if (lower.includes('airtel')) {
        state.provider = 'Airtel';
      } else if (lower.includes('vodafone') || lower.includes('idea') || lower.includes('vi')) {
        state.provider = 'Vi';
      } else if (lower.includes('bsnl')) {
        state.provider = 'BSNL';
      } else if (lower.includes('delhi jal board')) {
        state.provider = 'Delhi Jal Board';
      } else if (lower.includes('bmc')) {
        state.provider = 'Municipal Corporation (BMC)';
      } else if (lower.includes('water board') || lower.includes('jal board')) {
        state.provider = 'Municipal Corporation Water Board';
      } else if (lastQuestion.includes('service provider or operator') || lastQuestion.includes('who is your service provider')) {
        const cleaned = text.replace(/^(my provider is|it is|operator is|provider is|is|the provider is)\s+/i, '').trim();
        if (cleaned && !cleaned.toLowerCase().includes('rupees') && !cleaned.toLowerCase().includes('rs')) {
          state.provider = capitalizeWords(cleaned);
        }
      }
    }

    // 4. Account Identifier / Details
    if (!state.accountId) {
      if (state.billType === 'MOBILE' || lower.includes('mobile') || lower.includes('phone') || lower.includes('recharge')) {
        const phoneMatch = text.replace(/\s+/g, '').match(/\b[6-9]\d{9}\b/);
        if (phoneMatch) {
          state.accountId = phoneMatch[0];
          if (!state.billType) state.billType = 'MOBILE';
        } else if (lastQuestion.includes('mobile number would you like to recharge') || lastQuestion.includes('which mobile number')) {
          const digits = text.replace(/\D/g, '');
          if (digits.length >= 10) {
            state.accountId = digits.slice(-10);
          } else if (digits.length > 0) {
            state.accountId = digits;
          }
        }
      } else if (
        lastQuestion.includes('consumer or account id') ||
        lastQuestion.includes('water consumer / meter number') ||
        lastQuestion.includes('consumer') ||
        lastQuestion.includes('account id')
      ) {
        const cleaned = text.replace(/^(my id is|my consumer id is|my account id is|my number is|it is|id is|number is)\s+/i, '').trim();
        if (cleaned && !cleaned.toLowerCase().includes('adani') && !cleaned.toLowerCase().includes('jio')) {
          state.accountId = cleaned;
        }
      } else {
        const idMatch = text.match(/\b(?:id|consumer|meter|account)?\s*[:#]?\s*([A-Z0-9\-]{6,15})\b/i);
        if (idMatch) {
          const candidate = idMatch[1];
          if (
            !/electricity|recharge|tomorrow/i.test(candidate)
          ) {
            state.accountId = candidate;
          }
        }
      }
    }

    // 5. Amount Extraction
    if (!state.amount) {
      const amountRegex = /(?:₹|rs\.?|rupees|amount|for)\s*(\d+(?:\.\d{1,2})?)|(\d+(?:\.\d{1,2})?)\s*(?:₹|rs\.?|rupees)/i;
      const match = text.match(amountRegex);
      if (match) {
        state.amount = match[1] || match[2];
      } else if (lastQuestion.includes('how much amount') || lastQuestion.includes('amount would you like to pay')) {
        const digits = text.replace(/[^\d.]/g, '');
        if (digits) {
          state.amount = digits;
        }
      }
    }
  },

  getNextStepResponse(state: PaymentFlowState, userLanguage: string = 'English (India)'): AssistantResponse {
    const isHindi = userLanguage.includes('Hindi') || userLanguage.includes('हिंदी');

    // Step 1: Bill Category / Type
    if (!state.billType) {
      const q = isHindi
        ? 'आप कौन सा बिल भरना चाहते हैं? (बिजली, पानी या मोबाइल रिचार्ज)'
        : 'Which bill would you like to pay? (Electricity, Water, or Mobile Recharge)';
      const step = isHindi
        ? 'बिजली, पानी या मोबाइल रिचार्ज कहें।'
        : 'Say Electricity, Water, or Mobile Recharge.';
      return {
        intent: 'PAY_BILL',
        goal: 'Ask bill category',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 2: Account Identifier
    if (!state.accountId) {
      let question = isHindi
        ? 'कृपया अपना उपभोक्ता या खाता आईडी (Consumer ID) बताएं।'
        : 'Please tell me your Consumer or Account ID.';
      let hint = isHindi
        ? 'अपनी बिजली उपभोक्ता या खाता संख्या बताएं।'
        : 'Say your electricity consumer or account ID.';

      if (state.billType === 'WATER') {
        question = isHindi
          ? 'कृपया अपना पानी उपभोक्ता या मीटर नंबर बताएं।'
          : 'Please tell me your Water Consumer / Meter Number.';
        hint = isHindi
          ? 'अपना पानी उपभोक्ता नंबर बताएं।'
          : 'Say your water consumer or meter number.';
      } else if (state.billType === 'MOBILE') {
        question = isHindi
          ? 'आप किस 10 अंकों के मोबाइल नंबर पर रिचार्ज करना चाहते हैं?'
          : 'Which mobile number would you like to recharge?';
        hint = isHindi
          ? 'अपना 10 अंकों का मोबाइल नंबर बताएं।'
          : 'Say your 10-digit mobile number.';
      }

      return {
        intent: 'PAY_BILL',
        goal: 'Ask account identifier',
        response: question,
        needsClarification: true,
        clarifyingQuestion: question,
        suggestedNextStep: hint,
      };
    }

    // Step 3: Provider / Operator
    if (!state.provider) {
      const q = isHindi
        ? 'आपकी सेवा प्रदाता कंपनी कौन सी है? (जैसे अडानी इलेक्ट्रिसिटी, टाटा पावर, जियो, एयरटेल)'
        : 'Who is your service provider or operator? (e.g., Adani Electricity, Tata Power, Jio, Airtel)';
      const step = isHindi
        ? 'अपनी प्रदाता कंपनी या ऑपरेटर का नाम बताएं।'
        : 'Say your service provider or telecom operator.';
      return {
        intent: 'PAY_BILL',
        goal: 'Ask service provider',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 4: Amount
    if (!state.amount) {
      const q = isHindi
        ? 'आप कितनी राशि का भुगतान या रिचार्ज करना चाहते हैं?'
        : 'How much amount would you like to pay or recharge?';
      const step = isHindi
        ? 'भुगतान की राशि बताएं, जैसे 500 रुपये।'
        : 'Say the amount to pay, for example 500 rupees.';
      return {
        intent: 'PAY_BILL',
        goal: 'Ask payment amount',
        response: q,
        needsClarification: true,
        clarifyingQuestion: q,
        suggestedNextStep: step,
      };
    }

    // Step 5: Confirmation
    if (!state.isConfirmed) {
      const billTitle = isHindi
        ? (state.billType === 'ELECTRICITY' ? 'बिजली का बिल' : state.billType === 'WATER' ? 'पानी का बिल' : 'मोबाइल रिचार्ज')
        : (state.billType === 'ELECTRICITY' ? 'Electricity Bill' : state.billType === 'WATER' ? 'Water Bill' : 'Mobile Recharge');
      const summary = isHindi
        ? `मैंने आपके ${billTitle} (${state.provider}, आईडी: ${state.accountId}) के लिए ₹${state.amount} का भुगतान तैयार किया है। क्या मैं भुगतान प्रक्रिया आगे बढ़ाऊँ?`
        : `I have set up a payment of ₹${state.amount} for your ${billTitle} (${state.provider}, ID: ${state.accountId}). Should I proceed to payment?`;
      const step = isHindi
        ? 'भुगतान करने के लिए हाँ कहें, या बदलाव बताएं।'
        : 'Say yes to proceed with payment, or tell me if you want to change any detail.';
      return {
        intent: 'PAY_BILL',
        goal: 'Confirm payment details',
        response: summary,
        needsClarification: true,
        clarifyingQuestion: summary,
        suggestedNextStep: step,
      };
    }

    // Completed
    const billTitle = isHindi
      ? (state.billType === 'ELECTRICITY' ? 'बिजली बिल' : state.billType === 'WATER' ? 'पानी बिल' : 'मोबाइल रिचार्ज')
      : (state.billType === 'ELECTRICITY' ? 'Electricity Bill' : state.billType === 'WATER' ? 'Water Bill' : 'Mobile Recharge');
    const confirmedMsg = isHindi
      ? `आपके ${billTitle} (${state.provider}) के लिए ₹${state.amount} का भुगतान सफलतापूर्वक हो गया है! क्या मैं आपकी किसी और चीज़ में सहायता करूँ?`
      : `Your payment of ₹${state.amount} for ${billTitle} (${state.provider}) has been processed successfully! Is there anything else I can help you with?`;
    return {
      intent: 'PAY_BILL',
      goal: 'Payment completed',
      response: confirmedMsg,
      needsClarification: false,
      clarifyingQuestion: null,
      suggestedNextStep: isHindi
        ? 'आप डॉक्टर अपॉइंटमेंट या अन्य बिल भुगतान के लिए कह सकते हैं।'
        : 'You can ask to book a doctor appointment or pay another bill.',
      helpfulTip: isHindi
        ? 'भुगतान की रसीद आपके साहाय इतिहास में दर्ज कर दी गई है।'
        : 'The payment receipt has been recorded in your Sahaay history.',
    };
  },
};
