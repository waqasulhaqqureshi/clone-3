export type Theme = "light" | "dark";

export function formatClock(date: Date) {
  const hour = date.getHours();
  const month = date.toLocaleString("en", { month: "long" });
  const shortMonth = date.toLocaleString("en", { month: "short" });

  return {
    time: `${hour % 12 || 12}:${String(date.getMinutes()).padStart(2, "0")}${hour < 12 ? "am" : "pm"}`,
    date: `${date.getDate()} ${month}, ${date.getFullYear()}`,
    shortDate: `${date.getDate()} ${shortMonth}`,
  };
}

export function readTheme(): Theme {
  try {
    return localStorage.getItem("rishi-mode") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked; the UI stays usable for this visit.
  }
}
