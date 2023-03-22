import { Outlet, redirect, useNavigate } from "react-router-dom";
import { MyRouteList, drawerWidth } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { changeDraw, changeTitle } from "../../redux/reducer/app-reducer";
import { Sidebar } from "primereact/sidebar";
import AppMenu from "./AppMenu";
import { MyRouterType } from "../../utils/typings";
import Header from "./header";

const Layout = () => {
  const { openDraw } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clickMenu = (route: MyRouterType) => {
    dispatch(changeTitle(route));
    dispatch(changeDraw());
    navigate(route.path);
  };

  return (
    <div className="h-screen">
      <Header></Header>
      <div className="w-full surface-ground pt-8 pb-2 px-4">
        <Outlet></Outlet>
      </div>
      <Sidebar
        showCloseIcon={false}
        position={"left"}
        visible={openDraw}
        onHide={() => dispatch(changeDraw())}
      >
        <div className="w-full layout-menu">
          {MyRouteList.map((route) => (
            <AppMenu
              key={route.title}
              item={route}
              clickMenu={clickMenu}
            ></AppMenu>
          ))}
        </div>
      </Sidebar>
    </div>
  );
};

export default Layout;
