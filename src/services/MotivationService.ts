type MotivationCategory = "preSession" | "midSession" | "postSession" | "hypeUp" | "guiltTrip";

export class MotivationService {
  private static messages: Record<MotivationCategory, string[]> = {
    preSession: [],
    midSession: [],
    postSession: [],
    hypeUp: [],
    guiltTrip: [],
  };

  static async loadMessages() {
    if (MotivationService.messages.preSession.length > 0) return;
    const res = await fetch("/assets/motivation_messages.json");
    const data = await res.json();
    MotivationService.messages = data;
  }

  static async getRandom(
    category: MotivationCategory,
    vars?: Record<string, string>
  ): Promise<string> {
    await MotivationService.loadMessages();
    const arr = MotivationService.messages[category] || [];
    if (arr.length === 0) return "Stay motivated!";
    let msg = arr[Math.floor(Math.random() * arr.length)];
    if (vars) {
      Object.entries(vars).forEach(([key, value]) => {
        msg = msg.replace(new RegExp(`{${key}}`, "g"), value);
      });
    }
    return msg;
  }
}