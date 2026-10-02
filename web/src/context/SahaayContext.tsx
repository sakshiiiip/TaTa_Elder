import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  UserProfile,
  DoctorBookingState,
  TransactionRecord,
  BillPayment,
  ConversationMessage,
  AssistantResponse,
  VoiceState,
  VoiceInteractionState,
  VocalAnchorAction,
  AppSettings,
  BillCategoryType,
} from '../types';
import { BrowserSpeechRecognizer, BrowserTextToSpeech } from '../services/voiceEngine';
import { GeminiLlmService } from '../services/geminiService';
import { VocalAnchorProcessor } from '../services/vocalAnchorProcessor';
import { DoctorBookingManager } from '../services/doctorBookingManager';
import { BillPaymentManager } from '../services/billPaymentManager';
import { getStrings } from '../localization/strings';

interface SahaayContextType {
  // State
  currentTab: number;
  setCurrentTab: (tab: number) => void;
  userProfile: UserProfile;
  bookedAppointment: DoctorBookingState | null;
  transactions: TransactionRecord[];
  paidBills: BillPayment[];
  voiceState: VoiceState;
  engineState: VoiceInteractionState;
  isWakeWordActive: boolean;
  transcript: string;
  conversation: ConversationMessage[];
  currentResponse: AssistantResponse | null;
  isSpeaking: boolean;
  currentLanguage: string;
  settings: AppSettings;
  activeFeedbackMessage: string | null;

  // Actions
  setLanguage: (lang: string) => void;
  startListening: () => void;
  stopListening: () => void;
  retryLastTranscript: () => void;
  resetVoiceState: () => void;
  activateWakeWord: () => void;
  deactivateWakeWord: () => void;
  processUserInput: (text: string) => Promise<void>;
  speakCurrentResponse: () => void;
  speakText: (text: string, force?: boolean) => void;
  stopSpeaking: () => void;
  toggleTts: () => void;
  setSpeechRate: (rate: number) => void;
  clearConversation: () => void;
  updateAppointment: (state: DoctorBookingState) => void;
  cancelAppointment: () => void;
  updateUserProfile: (profile: UserProfile) => void;
  recordBillPayment: (payment: BillPayment) => void;
  recordTransaction: (transaction: TransactionRecord) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  showFeedback: (msg: string | null) => void;
}

const INITIAL_PROFILE: UserProfile = {
  fullName: 'Ashutosh Pandey',
  age: '68',
  contactNumber: '+91 98765 12345',
  emergencyContactName: 'Rahul (Son)',
  emergencyContactPhone: '+91 98765 43210',
  address: 'Bandra West, Mumbai',
};

const INITIAL_APPOINTMENT: DoctorBookingState = {
  specialty: 'Cardiologist',
  location: 'Bandra Medical Clinic',
  dateTime: 'Tomorrow at 5:00 PM',
  mode: 'in-person clinic visit',
  isConfirmed: true,
};

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-EL-9021',
    category: 'ELECTRICITY',
    provider: 'Adani Electricity',
    identifier: '102938475',
    amount: '1450',
    status: 'Successful',
    timestamp: '14 Aug 2026, 02:45 PM',
    billType: 'ELECTRICITY',
  },
  {
    id: 'TXN-MB-8412',
    category: 'MOBILE',
    provider: 'Jio Prepaid',
    identifier: '9876512345',
    amount: '299',
    status: 'Successful',
    timestamp: '11 Aug 2026, 07:15 PM',
    billType: 'MOBILE',
  },
  {
    id: 'TXN-DOC-7730',
    category: 'DOCTOR',
    provider: 'Bandra Medical Clinic (Dr. Sharma)',
    identifier: 'DOC-BK-8821',
    amount: '800',
    status: 'Successful',
    timestamp: '08 Aug 2026, 10:30 AM',
    doctorSpecialty: 'Cardiologist',
  },
  {
    id: 'TXN-WT-6109',
    category: 'WATER',
    provider: 'Municipal Corporation Water Board',
    identifier: 'WB-8839201',
    amount: '480',
    status: 'Successful',
    timestamp: '02 Aug 2026, 11:20 AM',
    billType: 'WATER',
  },
];

const SahaayContext = createContext<SahaayContextType | null>(null);

export const SahaayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sahaay_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.fullName || parsed.fullName === 'Ramesh Sharma' || parsed.fullName.includes('Ramesh')) {
          parsed.fullName = 'Ashutosh Pandey';
          localStorage.setItem('sahaay_profile', JSON.stringify(parsed));
        }
        return parsed;
      } catch {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });
  const [bookedAppointment, setBookedAppointment] = useState<DoctorBookingState | null>(() => {
    const saved = localStorage.getItem('sahaay_appointment');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENT;
  });
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    const saved = localStorage.getItem('sahaay_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [paidBills, setPaidBills] = useState<BillPayment[]>([]);

  const [voiceState, setVoiceState] = useState<VoiceState>({ kind: 'Idle' });
  const [engineState, setEngineState] = useState<VoiceInteractionState>({ kind: 'Idle' });
  const [isWakeWordActive, setIsWakeWordActive] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [currentResponse, setCurrentResponse] = useState<AssistantResponse | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('sahaay_lang') || 'English (India)';
  });
  const [activeFeedbackMessage, setActiveFeedbackMessage] = useState<string | null>(null);

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('sahaay_settings');
    return saved
      ? JSON.parse(saved)
      : {
          highContrastText: true,
          voiceFeedback: true,
          simpleMode: false,
          ttsEnabled: true,
          speechRate: 0.85,
        };
  });

  const lastTranscriptRef = useRef<string>('');
  const lastSpokenTextRef = useRef<string>('');
  const lastSuccessfulResponseRef = useRef<AssistantResponse | null>(null);

  const recognizerRef = useRef<BrowserSpeechRecognizer>(new BrowserSpeechRecognizer());
  const ttsRef = useRef<BrowserTextToSpeech>(new BrowserTextToSpeech());

  // Ensure profile name is always updated from legacy Ramesh
  useEffect(() => {
    if (!userProfile.fullName || userProfile.fullName === 'Ramesh Sharma' || userProfile.fullName.includes('Ramesh')) {
      setUserProfile((prev) => ({ ...prev, fullName: 'Ashutosh Pandey' }));
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('sahaay_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('sahaay_appointment', JSON.stringify(bookedAppointment));
  }, [bookedAppointment]);

  useEffect(() => {
    localStorage.setItem('sahaay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('sahaay_lang', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem('sahaay_settings', JSON.stringify(settings));
    ttsRef.current.setSpeechRate(settings.speechRate);
  }, [settings]);

  // Sync TTS speaking state
  useEffect(() => {
    ttsRef.current.setSpeakingChangeListener((speaking) => {
      setIsSpeaking(speaking);
      if (speaking) {
        setEngineState((prev) => (prev.kind !== 'Error' ? { kind: 'Speaking' } : prev));
      } else {
        setEngineState((prev) => (prev.kind === 'Speaking' ? { kind: 'Done' } : prev));
      }
    });
  }, []);

  const showFeedback = useCallback((msg: string | null) => {
    setActiveFeedbackMessage(msg);
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setCurrentLanguage(lang);
    const strings = getStrings(lang);
    if (strings && strings.languageChangedFeedback) {
      ttsRef.current.speak(strings.languageChangedFeedback, lang, true);
    }
  }, []);

  const speakText = useCallback(
    (text: string, force = false) => {
      if (!settings.ttsEnabled && !force) return;
      lastSpokenTextRef.current = text;
      ttsRef.current.speak(text, currentLanguage, force);
    },
    [currentLanguage, settings.ttsEnabled]
  );

  const stopSpeaking = useCallback(() => {
    ttsRef.current.stop();
  }, []);

  const speakCurrentResponse = useCallback(() => {
    if (!currentResponse) return;
    let text = currentResponse.response;
    if (currentResponse.needsClarification && currentResponse.clarifyingQuestion) {
      text += `. ${currentResponse.clarifyingQuestion}`;
    } else if (currentResponse.suggestedNextStep) {
      text += `. ${currentResponse.suggestedNextStep}`;
    }
    speakText(text, true);
  }, [currentResponse, speakText]);

  const toggleTts = useCallback(() => {
    setSettings((s) => {
      const next = !s.ttsEnabled;
      if (!next) {
        ttsRef.current.stop();
      }
      return { ...s, ttsEnabled: next };
    });
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    setSettings((s) => ({ ...s, speechRate: rate }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const updateUserProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
  }, []);

  const recordTransaction = useCallback((tx: TransactionRecord) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const recordBillPayment = useCallback(
    (payment: BillPayment) => {
      setPaidBills((prev) => [payment, ...prev]);
      const record: TransactionRecord = {
        id: payment.id,
        category: payment.type,
        provider: payment.provider,
        identifier: payment.identifier,
        amount: payment.amount,
        status: 'Successful',
        timestamp: payment.timestamp,
        billType: payment.type,
      };
      recordTransaction(record);
    },
    [recordTransaction]
  );

  const updateAppointment = useCallback(
    (state: DoctorBookingState) => {
      setBookedAppointment(state);
      if (state.isConfirmed) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const record: TransactionRecord = {
          id: `TXN-DOC-${Math.floor(10000 + Math.random() * 90000)}`,
          category: 'DOCTOR',
          provider: `${state.location || 'Medical Clinic'} (${state.specialty || 'General Physician'})`,
          identifier: `DOC-BK-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: '800',
          status: 'Successful',
          timestamp: formattedDate,
          doctorSpecialty: state.specialty || undefined,
        };
        recordTransaction(record);
      }
    },
    [recordTransaction]
  );

  const cancelAppointment = useCallback(() => {
    setBookedAppointment(null);
  }, []);

  const handleVocalAnchor = useCallback(
    (action: VocalAnchorAction) => {
      const strings = getStrings(currentLanguage);
      switch (action) {
        case 'REPEAT': {
          let msg = lastSpokenTextRef.current;
          if (!msg) {
            msg = strings.vocalAnchorNoHistory;
          }
          speakText(msg, true);
          const anchorResp: AssistantResponse = {
            intent: 'VOCAL_ANCHOR',
            goal: 'Repeat last response',
            response: msg,
            isVocalAnchor: true,
            vocalAnchorAction: action,
          };
          setCurrentResponse(anchorResp);
          setVoiceState({ kind: 'Done' });
          setEngineState({ kind: 'Done' });
          break;
        }

        case 'STOP': {
          stopSpeaking();
          setVoiceState({ kind: 'Idle' });
          setEngineState({ kind: 'Idle' });
          const anchorResp: AssistantResponse = {
            intent: 'VOCAL_ANCHOR',
            goal: 'Stop',
            response: strings.vocalAnchorStop,
            isVocalAnchor: true,
            vocalAnchorAction: action,
          };
          setCurrentResponse(anchorResp);
          break;
        }

        case 'GO_BACK': {
          stopSpeaking();
          const anchorResp: AssistantResponse = {
            intent: 'VOCAL_ANCHOR',
            goal: 'Go back',
            response: strings.vocalAnchorGoBack,
            isVocalAnchor: true,
            vocalAnchorAction: action,
          };
          setCurrentResponse(anchorResp);
          setVoiceState({ kind: 'Done' });
          setEngineState({ kind: 'Done' });
          // Navigate to Home tab
          setCurrentTab(0);
          break;
        }

        case 'NEXT_STEP': {
          const nextStep = lastSuccessfulResponseRef.current?.suggestedNextStep;
          const msg = nextStep || strings.vocalAnchorNoNextStep;
          speakText(msg, true);
          const anchorResp: AssistantResponse = {
            intent: 'VOCAL_ANCHOR',
            goal: 'Next step',
            response: msg,
            isVocalAnchor: true,
            vocalAnchorAction: action,
          };
          setCurrentResponse(anchorResp);
          setVoiceState({ kind: 'Done' });
          setEngineState({ kind: 'Done' });
          break;
        }
      }
    },
    [speakText, stopSpeaking, currentLanguage]
  );

  const processUserInput = useCallback(
    async (text: string) => {
      if (!text || !text.trim()) return;

      // 1. Vocal Anchor short-circuit
      const anchor = VocalAnchorProcessor.detect(text);
      if (anchor) {
        handleVocalAnchor(anchor);
        return;
      }

      const strings = getStrings(currentLanguage);

      // 2. LLM Pipeline
      setVoiceState({ kind: 'Processing' });
      setEngineState({ kind: 'Processing' });
      setCurrentResponse({
        intent: 'LOADING',
        goal: '',
        response: strings.thinkingStatus,
      });

      const userMsg: ConversationMessage = {
        role: 'USER',
        text,
        timestamp: Date.now(),
      };
      setConversation((prev) => [...prev, userMsg]);

      try {
        const response = await GeminiLlmService.analyze(text, conversation, currentLanguage);
        setCurrentResponse(response);

        if (response.isError) {
          const errMsg = response.errorMessage || response.response;
          setVoiceState({ kind: 'Error', message: errMsg });
          setEngineState({ kind: 'Error', message: errMsg });
        } else {
          if (response.needsClarification && response.clarifyingQuestion) {
            setVoiceState({ kind: 'Done' });
            setEngineState({
              kind: 'WaitingForClarification',
              question: response.clarifyingQuestion,
            });
          } else {
            setVoiceState({ kind: 'Done' });
            setEngineState({ kind: 'Done' });
          }

          const assistantMsg: ConversationMessage = {
            role: 'ASSISTANT',
            text: response.response,
            timestamp: Date.now(),
          };
          setConversation((prev) => [...prev, assistantMsg]);
          lastSuccessfulResponseRef.current = response;

          // Track Doctor Appointment Intent & confirmation
          if (DoctorBookingManager.isDoctorBookingIntent(text, [...conversation, userMsg])) {
            const extracted = DoctorBookingManager.extractState([...conversation, userMsg], text);
            if (extracted.specialty) {
              setBookedAppointment(extracted);
              if (extracted.isConfirmed) {
                updateAppointment(extracted);
              }
            }
          }

          // Track Bill Payment Intent & confirmation
          if (BillPaymentManager.isBillPaymentIntent(text, [...conversation, userMsg])) {
            const paymentState = BillPaymentManager.extractState([...conversation, userMsg], text);
            if (paymentState.isConfirmed && paymentState.billType && paymentState.amount) {
              const payment: BillPayment = {
                id: `BP-${Math.floor(10000 + Math.random() * 90000)}`,
                type: paymentState.billType,
                identifier: paymentState.accountId || '102938475',
                provider: paymentState.provider || (paymentState.billType === 'ELECTRICITY' ? 'Adani Electricity' : paymentState.billType === 'WATER' ? 'Municipal Water Board' : 'Jio'),
                amount: paymentState.amount,
                status: 'Paid Successfully',
                timestamp: 'Just now',
              };
              recordBillPayment(payment);
            }
          }

          // Auto-TTS if enabled
          if (settings.ttsEnabled) {
            let speakable = response.response;
            if (response.needsClarification && response.clarifyingQuestion) {
              speakable += `. ${response.clarifyingQuestion}`;
            } else if (response.suggestedNextStep) {
              speakable += `. ${response.suggestedNextStep}`;
            }
            speakText(speakable, false);
          }
        }
      } catch (err: any) {
        const errorMsg = 'I had trouble processing that request. Please try again.';
        setVoiceState({ kind: 'Error', message: errorMsg });
        setEngineState({ kind: 'Error', message: errorMsg });
      }
    },
    [conversation, currentLanguage, handleVocalAnchor, recordBillPayment, settings.ttsEnabled, speakText, updateAppointment]
  );

  const startListening = useCallback(() => {
    ttsRef.current.stop();
    setTranscript('');
    setVoiceState({ kind: 'Listening' });
    setEngineState({ kind: 'ActiveListening' });

    recognizerRef.current.startListening(currentLanguage, {
      onReadyForSpeech: () => {
        setVoiceState({ kind: 'Listening' });
        setEngineState({ kind: 'ActiveListening' });
      },
      onWakeWordDetected: () => {
        setIsWakeWordActive(true);
        setEngineState({ kind: 'WakeWordListening' });
      },
      onPartialResult: (text) => {
        setTranscript(text);
        setVoiceState({ kind: 'PartialResult', partialText: text });
        setEngineState({ kind: 'PartialResult', partial: text });
      },
      onFinalResult: (text) => {
        setTranscript(text);
        lastTranscriptRef.current = text;
        recognizerRef.current.stopListening();
        processUserInput(text);
      },
      onError: (msg) => {
        setVoiceState({ kind: 'Error', message: msg });
        setEngineState({ kind: 'Error', message: msg });
      },
      onStopped: () => {
        // Stopped
      },
    });
  }, [currentLanguage, processUserInput]);

  const stopListening = useCallback(() => {
    recognizerRef.current.stopListening();
    setVoiceState({ kind: 'Idle' });
    setEngineState({ kind: 'Idle' });
  }, []);

  const retryLastTranscript = useCallback(() => {
    if (lastTranscriptRef.current) {
      processUserInput(lastTranscriptRef.current);
    } else {
      startListening();
    }
  }, [processUserInput, startListening]);

  const resetVoiceState = useCallback(() => {
    setVoiceState({ kind: 'Idle' });
    setEngineState({ kind: 'Idle' });
    setTranscript('');
  }, []);

  const activateWakeWord = useCallback(() => {
    setIsWakeWordActive(true);
    setEngineState({ kind: 'WakeWordListening' });
    startListening();
  }, [startListening]);

  const deactivateWakeWord = useCallback(() => {
    setIsWakeWordActive(false);
    stopListening();
  }, [stopListening]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    setCurrentResponse(null);
    setTranscript('');
    setVoiceState({ kind: 'Idle' });
    setEngineState({ kind: 'Idle' });
    lastTranscriptRef.current = '';
    lastSpokenTextRef.current = '';
    lastSuccessfulResponseRef.current = null;
    ttsRef.current.stop();
  }, []);

  return (
    <SahaayContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        userProfile,
        bookedAppointment,
        transactions,
        paidBills,
        voiceState,
        engineState,
        isWakeWordActive,
        transcript,
        conversation,
        currentResponse,
        isSpeaking,
        currentLanguage,
        settings,
        activeFeedbackMessage,
        setLanguage,
        startListening,
        stopListening,
        retryLastTranscript,
        resetVoiceState,
        activateWakeWord,
        deactivateWakeWord,
        processUserInput,
        speakCurrentResponse,
        speakText,
        stopSpeaking,
        toggleTts,
        setSpeechRate,
        clearConversation,
        updateAppointment,
        cancelAppointment,
        updateUserProfile,
        recordBillPayment,
        recordTransaction,
        updateSettings,
        showFeedback,
      }}
    >
      {children}
    </SahaayContext.Provider>
  );
};

export const useSahaay = (): SahaayContextType => {
  const context = useContext(SahaayContext);
  if (!context) {
    throw new Error('useSahaay must be used within a SahaayProvider');
  }
  return context;
};
