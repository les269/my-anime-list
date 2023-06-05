import { Route, Routes } from "react-router-dom";
import AnimeList from "./views/anime-list/anime-list";
import AnimeEdit from "./views/anime-edit/anime-edit";
import Layout from "./components/layout/layout";
import { MyRouteObject } from "./utils/constants";
import TagList from "views/tag-list/tag-list";

const MyRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path={MyRouteObject.home.path} element={<AnimeList />} />
        <Route path={MyRouteObject.edit.path} element={<AnimeEdit />} />
        <Route path={MyRouteObject.tagList.path} element={<TagList />}></Route>
      </Route>
    </Routes>
  );
};

export default MyRoute;
