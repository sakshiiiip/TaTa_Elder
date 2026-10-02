export interface UserProfile {
  fullName: string;
  age: string;
  contactNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  address: string;
}

export interface DoctorBookingState {
  specialty: string | null;
  location: string | null;
  dateTime: string | null;
  mode: string | null; // "in-person clinic visit" | "online consultation"
  isConfirmed: boolean;
}

export type BillCategoryType = 'ELECTRICITY' | 'WATER' | 'MOBILE';

export interface BillTypeInfo {
  type: BillCategoryType;
  title: string;
  iconEmoji: string;
  fieldLabel: string;
  defaultProvider: string;
  sampleIdentifier: string;
  defaultAmount: string;
}

export const BILL_TYPES: Record<BillCategoryType, BillTypeInfo> = {
  ELECTRICITY: {
    type: 'ELECTRICITY',
    title: 'Electricity Bill',
    iconEmoji: '⚡',
    fieldLabel: 'Consumer / Account ID',
    defaultProvider: 'Adani Electricity',
    sampleIdentifier: '102938475',
    defaultAmount: '1450',
  },
  WATER: {
    type: 'WATER',
    title: 'Water Bill',
    iconEmoji: '💧',
    fieldLabel: 'Consumer / Connection No.',
    defaultProvider: 'Municipal Corporation Water Board',
    sampleIdentifier: 'WB-8839201',
    defaultAmount: '480',
  },
  MOBILE: {
    type: 'MOBILE',
    title: 'Mobile Recharge',
    iconEmoji: '📱',
    fieldLabel: '10-Digit Mobile Number',
    defaultProvider: 'Jio Prepaid',
    sampleIdentifier: '9876512345',
    defaultAmount: '299',
  },
};

export interface BillPayment {
  id: string;
  type: BillCategoryType;
  identifier: string;
  provider: string;
  amount: string;
  status: string;
  timestamp: string;
}

export type TransactionCategoryType = 'ELECTRICITY' | 'WATER' | 'MOBILE' | 'DOCTOR';

export interface TransactionRecord {
  id: string;
  category: TransactionCategoryType;
  provider: string;
  identifier: string;
  amount: string;
  status: string;
  timestamp: string;
  billType?: BillCategoryType;
  doctorSpecialty?: string;
}

export type MessageRole = 'USER' | 'ASSISTANT';

export interface ConversationMessage {
  role: MessageRole;
  text: string;
  timestamp: number;
}

export type VocalAnchorAction = 'REPEAT' | 'GO_BACK' | 'STOP' | 'NEXT_STEP';

export interface AssistantResponse {
  intent: string;
  goal: string;
  response: string;
  needsClarification?: boolean;
  clarifyingQuestion?: string | null;
  suggestedNextStep?: string | null;
  helpfulTip?: string | null;
  isError?: boolean;
  errorMessage?: string | null;
  isVocalAnchor?: boolean;
  vocalAnchorAction?: VocalAnchorAction | null;
}

export type VoiceStateKind =
  | 'Idle'
  | 'RequestingPermission'
  | 'Listening'
  | 'PartialResult'
  | 'Processing'
  | 'Done'
  | 'Error';

export interface VoiceState {
  kind: VoiceStateKind;
  message?: string;
  partialText?: string;
}

export type VoiceInteractionStateKind =
  | 'Idle'
  | 'WakeWordListening'
  | 'ActiveListening'
  | 'PartialResult'
  | 'Processing'
  | 'WaitingForClarification'
  | 'Speaking'
  | 'Done'
  | 'Error';

export interface VoiceInteractionState {
  kind: VoiceInteractionStateKind;
  partial?: string;
  question?: string;
  message?: string;
}

export interface AppSettings {
  highContrastText: boolean;
  voiceFeedback: boolean;
  simpleMode: boolean;
  ttsEnabled: boolean;
  speechRate: number; // 0.5 to 1.5
}
