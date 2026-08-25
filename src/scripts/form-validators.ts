import { CONFIG } from "./form-types.js";

export const validators = {
  name: (v: string) =>
    v.length < 2
      ? "Il nome deve contenere almeno 2 caratteri."
      : !/^[\p{L}\s.'-]+$/u.test(v)
        ? "Il nome contiene caratteri non validi."
        : "",
  email: (v: string) =>
    !v
      ? "L'email è richiesta."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? "Indirizzo email non valido."
        : "",
  subject: (v: string) => (!v ? "Seleziona un'opzione valida." : ""),
  message: (v: string) =>
    v.length < 10
      ? "Il messaggio è troppo corto (min. 10 caratteri)."
      : v.length > CONFIG.MAX_MESSAGE_LENGTH
        ? "Il messaggio supera la lunghezza massima consentita."
        : "",
};
