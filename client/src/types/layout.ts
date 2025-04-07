import { CardVariant } from "./post";

export interface LayoutParams {
  grid: {
    columns: number;
    rows: number;
  };
  masonry: {
    columns: number;
    rows: number;
  };
}

export type LayoutType = "grid" | "masonry";

export type NavigationType = "pagination" | "load-more";

export interface Settings {
  layout: {
    current: LayoutType;
    params: LayoutParams;
  };
  template: CardVariant;
  navigation: NavigationType;
}

export const ACCUMULATE_NAVIGATION_TYPES: NavigationType[] = ["load-more"];

export const LAYOUT_DISPLAY_NAMES: Record<LayoutType, string> = {
  grid: "layout.grid",
  masonry: "layout.masonry",
};

export const TEMPLATE_DISPLAY_NAMES: Record<CardVariant, string> = {
  classic: "template.classic",
  hover: "template.hover",
};

export const NAVIGATION_DISPLAY_NAMES: Record<NavigationType, string> = {
  pagination: "navigation.pagination",
  "load-more": "navigation.loadMore",
};
