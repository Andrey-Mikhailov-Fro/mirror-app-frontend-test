import { makeAutoObservable, runInAction } from "mobx";
import { Post } from "../types/post";
import { ACCUMULATE_NAVIGATION_TYPES } from "../types/layout";
import SettingsStore from "./LayoutSettingsStore";

const API_URL = "http://localhost:4000";

interface ApiResponse {
  data: Post[];
  total: number;
}

const fetchPostsFromApi = async (
  page: number,
  limit: number
): Promise<ApiResponse> => {
  const response = await fetch(
    `${API_URL}/posts?_expand=user&_page=${page}&_limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Ошибка постов: ${response.status}`);
  }

  const data: Post[] = await response.json();
  const total = parseInt(response.headers.get("X-Total-Count") || "0", 10);
  return { data, total };
};

class PostsStore {
  posts: Post[] = [];
  currentPage: number = 1;
  postsPerPage: number = 0;
  totalPosts: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get accumulateMode(): boolean {
    return SettingsStore.settings
      ? ACCUMULATE_NAVIGATION_TYPES.includes(SettingsStore.settings.navigation)
      : false;
  }

  async fetchPosts(page: number = 1): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const { data, total } = await fetchPostsFromApi(page, this.postsPerPage);

      runInAction(() => {
        if (this.accumulateMode && page > 1) {
          this.posts = [...this.posts, ...data];
        } else {
          this.posts = data;
        }
        this.currentPage = page;
        this.totalPosts = total;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error =
          error instanceof Error ? error.message : "Неизвестная ошибка";

        if (process.env.NODE_ENV !== "production") {
          console.error("Ошибка загрузки постов:", error);
        }

        this.isLoading = false;
      });
    }
  }

  setPostsPerPage(count: number): void {
    if (count >= 0) {
      this.postsPerPage = count;
    }
  }

  reset(): void {
    this.posts = [];
    this.currentPage = 1;
    this.postsPerPage = 0;
    this.totalPosts = 0;
    this.isLoading = false;
    this.error = null;
  }

  clearPosts(): void {
    this.posts = [];
    this.currentPage = 1;
    this.totalPosts = 0;
  }

  resetError(): void {
    this.error = null;
  }
}

export default new PostsStore();
