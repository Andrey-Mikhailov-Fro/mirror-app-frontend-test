import { makeAutoObservable, runInAction } from "mobx";
import { Settings } from "../types/layout";

const API_URL = "http://localhost:4000";

const fetchSettingsFromApi = async (): Promise<Settings> => {
  const response = await fetch(`${API_URL}/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка настроек: ${response.status}`);
  }

  return await response.json();
};

class SettingsStore {
  settings: Settings | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchSettings(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const data = await fetchSettingsFromApi();

      runInAction(() => {
        this.settings = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Неизвестная ошибка";
        if (process.env.NODE_ENV !== "production") {
          console.error("Ошибка загрузки настроек:", error);
        }
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  reset(): void {
    this.settings = null;
    this.isLoading = false;
    this.error = null;
  }

  clearSettings(): void {
    this.settings = null;
  }

  resetError(): void {
    this.error = null;
  }

  updateSettings(newSettings: Settings): void {
    this.settings = newSettings;
  }

  get hasSettings(): boolean {
    return this.settings !== null;
  }
}

export default new SettingsStore();