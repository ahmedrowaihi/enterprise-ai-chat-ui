export function speak(text: string) {
  return new Promise<void>((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onend = () => resolve();
    utterance.onerror = (error) => {
      if (error.error === "interrupted") {
        return;
      }
      reject(error);
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSynthesisSupported() {
  return "speechSynthesis" in window;
}
