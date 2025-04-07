/* eslint-disable react-refresh/only-export-components */
import "normalize.css";
import "./styles/main.scss";
import PostList from "./components/PostList";
import { useEffect } from "react";
import PostsStore from "./stores/PostsStore";
import SettingsStore from "./stores/LayoutSettingsStore";
import { observer } from "mobx-react-lite";
import Sidebar from "./components/Sidebar";

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      await SettingsStore.fetchSettings();
      if (SettingsStore.settings) {
        const { current, params } = SettingsStore.settings.layout;
        const postsPerPage =
          current === "grid"
            ? params.grid.columns * params.grid.rows
            : params.masonry.columns * params.masonry.rows;
        PostsStore.setPostsPerPage(postsPerPage);
        await PostsStore.fetchPosts(1); // Начальная загрузка постов
      }
    };
    initializeApp();
  }, []);
  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <PostList />
      </div>
    </div>
  );
}

export default observer(App);
