import { Post } from "../types/post";
import { LayoutParams, LayoutType } from "../types/layout";

export const layoutVariants: Record<
  LayoutType,
  {
    getPosts: (posts: Post[], params: LayoutParams) => Post[];
    getStyle: (params: LayoutParams) => React.CSSProperties;
  }
> = {
  grid: {
    getPosts: (posts, params) => {
      const totalItems = params.grid.columns * params.grid.rows;
      return posts.slice(0, totalItems);
    },
    getStyle: (params) => ({
      gridTemplateColumns: `repeat(${params.grid.columns}, 1fr)`,
      gridAutoRows: "minmax(min-content, max-content)",
    }),
  },
  masonry: {
    getPosts: (posts, params) => {
      const totalItems = params.masonry.columns * params.masonry.rows;
      return posts.slice(0, totalItems);
    },
    getStyle: (params) => ({ columnCount: params.masonry.columns }),
  },
};