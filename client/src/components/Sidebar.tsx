// src/components/Sidebar.tsx
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import SettingsStore from "../stores/LayoutSettingsStore";
import PostsStore from "../stores/PostsStore";
import {
  LAYOUT_DISPLAY_NAMES,
  TEMPLATE_DISPLAY_NAMES,
  NAVIGATION_DISPLAY_NAMES,
} from "../types/layout";

const Sidebar = observer(() => {
  const { t } = useTranslation();

  const handleRefresh = async () => {
    await SettingsStore.fetchSettings();
    if (SettingsStore.settings) {
      const { current, params } = SettingsStore.settings.layout;
      const postsPerPage =
        current === "grid"
          ? params.grid.columns * params.grid.rows
          : params.masonry.columns * params.masonry.rows;
      PostsStore.setPostsPerPage(postsPerPage);
      PostsStore.clearPosts();
      await PostsStore.fetchPosts(1);
    }
  };

  if (!SettingsStore.settings) return null;

  const { current, params } = SettingsStore.settings.layout;
  const { template, navigation } = SettingsStore.settings;

  return (
    <div className="sidebar">
      <button className="sidebar__refresh" onClick={handleRefresh}>
        {t("sidebar.refresh")}
      </button>
      <ul className="sidebar__list">
        <li>
          <label>{t("sidebar.layout")}</label>
          <input
            type="text"
            value={t(LAYOUT_DISPLAY_NAMES[current])}
            disabled
          />
        </li>
        <li>
          <label>{t("sidebar.template")}</label>
          <input
            type="text"
            value={t(TEMPLATE_DISPLAY_NAMES[template])}
            disabled
          />
        </li>
        <li>
          <label>{t("sidebar.navigation")}</label>
          <input
            type="text"
            value={t(NAVIGATION_DISPLAY_NAMES[navigation])}
            disabled
          />
        </li>
        {current === "grid" && (
          <>
            <li>
              <label>{t("sidebar.columns")}</label>
              <input type="number" value={params.grid.columns} disabled />
            </li>
            <li>
              <label>{t("sidebar.rows")}</label>
              <input type="number" value={params.grid.rows} disabled />
            </li>
          </>
        )}
        {current === "masonry" && (
          <>
            <li>
              <label>{t("sidebar.columns")}</label>
              <input type="number" value={params.masonry.columns} disabled />
            </li>
            <li>
              <label>{t("sidebar.rows")}</label>
              <input type="number" value={params.masonry.rows} disabled />
            </li>
          </>
        )}
      </ul>
    </div>
  );
});

export default Sidebar;
