export const CONFIG = {
  LOCK_KEY: "zeller_industries_form_lock",
  SUCCESS_KEY: "zeller_industries_form_submitted",
  LOCK_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours (1 day) cooldown
  MIN_FILL_TIME_SECONDS: 3,
  MAX_MESSAGE_LENGTH: 5000,
  DEBOUNCE_MS: 200,
};

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  privacy: boolean;
  "bot-field": string;
  submission_speed: number;
}
