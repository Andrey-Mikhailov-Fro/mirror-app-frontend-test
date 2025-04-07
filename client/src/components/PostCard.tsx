import { observer } from "mobx-react-lite";
import { Post, CardVariant } from "../types/post";
import { useTranslation } from "react-i18next";

type Text = (key: string, options?: { count: number }) => string;

const formatDate = (dateString: string, t: Text): string => {
  const postDate = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 7) {
    if (diffInDays === 0) return t('today');
    if (diffInDays === 1) return t('dayAgo', { count: 1 });
    return t("daysAgoMany", { count: diffInDays });
  }

  return postDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Username = ({ post }: { post: Post }) => (
  <span>{post.user.username}</span>
);
const DateComponent = ({ post, t }: { post: Post, t: Text }) => (
  <span className="post-card__date">{formatDate(post.date, t)}</span>
);
const Caption = ({ post }: { post: Post }) => (
  <div className="post-card__caption">{post.caption}</div>
);
const Likes = ({ post, t }: { post: Post, t: Text }) => (
  <span>{t("likes", { count: post.likes })}</span>
);
const Comments = ({ post, t }: { post: Post, t: Text }) => (
  <span>{t("comments", { count: post.comments })}</span>
);
const UserAndDate = ({ post, t }: { post: Post, t: Text }) => (
    <div className="post-card__user-date">
        <Username post={post} />
        <DateComponent post={post} t={t} />
    </div>
);
const LikesAndComments = ({ post, t }: { post: Post, t: Text }) => (
    <div className="post-card__likes-comments">
        <Likes post={post} t={t} />
        <Comments post={post} t={t} />
    </div>
);

const cardVariants: Record<
  CardVariant,
  {
    header: (({ post, t }: { post: Post, t?: Text }) => JSX.Element);
    body: (({ post, t }: { post: Post, t?: Text }) => JSX.Element);
    footer: (({ post, t }: { post: Post, t?: Text }) => JSX.Element);
  }
> = {
  classic: {
    header: ({ post, t }) => <UserAndDate post={post} t={t as Text} />,
    body: ({ post }) => <Caption post={post} />,
    footer: ({ post, t }) => <LikesAndComments post={post} t={t as Text} />,
  },
  hover: {
    header: ({ post }) => <Caption post={post} />,
    body: ({ post, t }) => <UserAndDate post={post} t={t as Text} />,
    footer: ({ post, t }) => <LikesAndComments post={post} t={t as Text} />,
  },
};

interface PostCardProps {
  post: Post;
  variant?: CardVariant;
}

const PostCard = observer(({ post, variant = "classic" }: PostCardProps) => {
  const { t } = useTranslation();
  const { header, body, footer } = cardVariants[variant];

  return (
    <div className={`post-card post-card--${variant}`}>
        {header({ post, t })}
      <hr />
        {body({ post, t })}
      <hr />
        {footer({ post, t })}
    </div>
  );
});

export default PostCard;