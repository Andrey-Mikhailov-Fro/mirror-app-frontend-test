import { NavigationType } from "../types/layout";

interface NavigationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLoadMore?: () => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: NavigationProps) => {
  const maxButtons = 7;
  const buttons: (number | string)[] = [];

  if (totalPages < maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i);
    }
  } else {
    buttons.push(1);
    if (currentPage <= 4) {
      buttons.push(2, 3, 4, 5, "...", totalPages);
    } else if (currentPage >= totalPages - 3) {
      buttons.push("...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      buttons.push("...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="pagination">
      {buttons.map((btn, index) => {
        if (btn === "...") {
          const isLeftEllipsis = index < buttons.length / 2;
          const targetPage = isLeftEllipsis
            ? Math.max(1, currentPage - 5)
            : Math.min(totalPages, currentPage + 5);

          return (
            <button
              key={`ellipsis-${index}`}
              className="pagination__button pagination__ellipsis"
              onClick={() => onPageChange(targetPage)}
            >
              <span className="pagination__default">...</span>
              <span className="pagination__hover">{isLeftEllipsis ? "<<" : ">>"}</span>
            </button>
          );
        }

        return (
          <button
            key={btn}
            className={`pagination__button ${btn === currentPage ? "pagination__button--active" : ""}`}
            onClick={() => onPageChange(btn as number)}
          >
            {btn}
          </button>
        );
      })}
    </div>
  );
};

export const navigationVariants: Record<
  NavigationType,
  {
    render: (props: NavigationProps) => JSX.Element | null;
  }
> = {
  pagination: {
    render: ({ currentPage, totalPages, onPageChange }) => (
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    ),
  },
  "load-more": {
    render: ({ currentPage, totalPages, onLoadMore }) => (
      <div className="load-more">
        {currentPage < totalPages && onLoadMore && (
          <button onClick={onLoadMore}>Загрузить еще</button>
        )}
      </div>
    ),
  },
};