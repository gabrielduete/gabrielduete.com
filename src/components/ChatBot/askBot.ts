// Lightweight decoupled bridge between the selection toolbar and the ChatBot
// widget. The toolbar dispatches an event with the selected text; the ChatBot
// listens, opens itself, and asks the model about the snippet.

export const ASK_BOT_EVENT = 'chatbot:ask'

export function askBot(text: string): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<string>(ASK_BOT_EVENT, { detail: text }))
}
