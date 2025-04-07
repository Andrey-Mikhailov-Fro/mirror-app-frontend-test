import { useEffect, useState, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import PostsStore from "../stores/PostsStore";
import SettingsStore from "../stores/LayoutSettingsStore";
import PostCard from "./PostCard";
import { layoutVariants } from "./layoutVariants";
import { navigationVariants } from "./NavigationVariants";
import { useTranslation } from "react-i18next";

const LoadingErrorEmpty = ({
  isLoading,
  error,
  empty,
}: {
  isLoading?: boolean;
  error?: string | null;
  empty?: boolean;
}) => {
  const { t } = useTranslation();

  if (isLoading) return <p>{t("errors.loading")}</p>;
  if (error)
    return (
      <p>
        {t(error.includes("настроек") ? "errors.settingsError" : "errors.postsError", {
          message: error,
        })}
      </p>
    );
  if (empty) return <p>{t("errors.noPost")}</p>;
  return null;
};

const PostList = observer(() => {
  const [page, setPage] = useState(PostsStore.currentPage);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (SettingsStore.settings && page !== PostsStore.currentPage) {
      const scrollPosition = containerRef.current?.scrollTop || 0;
      PostsStore.fetchPosts(page).then(() => {
        if (containerRef.current && SettingsStore.settings?.navigation === "load-more") {
          containerRef.current.scrollTop = scrollPosition;
        }
      });
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    const maxPages = Math.ceil(PostsStore.totalPosts / PostsStore.postsPerPage);
    if (newPage >= 1 && newPage <= maxPages) {
      setPage(newPage);
    }
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const settings = SettingsStore.settings;
  const posts = PostsStore.posts;

  const layoutPosts = useMemo(() => {
    if (!settings || !posts.length) return [];
    const { getPosts } = layoutVariants[settings.layout.current];
    return PostsStore.accumulateMode
      ? posts
      : getPosts(posts, settings.layout.params);
  }, [settings, posts]);

  if (
    !settings ||
    !posts.length ||
    PostsStore.isLoading ||
    SettingsStore.isLoading
  ) {
    return (
      <LoadingErrorEmpty
        isLoading={PostsStore.isLoading || SettingsStore.isLoading}
        error={SettingsStore.error || PostsStore.error}
        empty={!posts.length || !settings}
      />
    );
  }

  const { current, params } = settings.layout;
  const { template, navigation } = settings;
  const style = layoutVariants[current].getStyle(params);
  const totalPages = Math.ceil(PostsStore.totalPosts / PostsStore.postsPerPage);

  return (
    <div className="post-list-container" ref={containerRef}>
      <div className={`post-list post-list--${current}`} style={style}>
        {layoutPosts.map((post) => (
          <PostCard key={post.id} post={post} variant={template} />
        ))}
      </div>
      {navigationVariants[navigation].render({
        currentPage: PostsStore.currentPage,
        totalPages,
        onPageChange: handlePageChange,
        onLoadMore: PostsStore.accumulateMode ? handleLoadMore : undefined,
      })}
    </div>
  );
});

export default PostList;
