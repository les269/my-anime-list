import { Outlet, useNavigate } from "react-router-dom";
import { MyRouteList } from "../../utils/constants";
import { useAppDispatch } from "../../utils/hook";
import { changeTitle } from "../../redux/reducer/app-reducer";
import { MyRouterType } from "../../utils/typings";
import Header from "./header";
import styled from "styled-components";
import { useState } from "react";

const Layout = ({ className }: { className?: string }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const clickMenu = (route: MyRouterType) => {
    dispatch(changeTitle(route));
    navigate(route.path);
  };

  return (
    <div className={className}>
      <div className={`container ${showSidebar ? "active" : ""}`}>
        <Header showSidebar={() => setShowSidebar((x) => !x)}></Header>
        <div className="sidebar">
          <div className="w-full layout-menu">
            {MyRouteList.map((route) => (
              <ul className="menu" key={route.title}>
                <li>
                  <a onClick={() => clickMenu(route)}>{route.title}</a>
                </li>
              </ul>
            ))}
          </div>
        </div>
        <div className="content">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

const StyledLayout = styled(Layout)`
  .sidebar {
    display: block;
    position: fixed;
    height: 100%;
    top: 5rem;
    left: 0;
    width: 250px;
    background: var(--menu-bg);
    border-right: var(--sidebar-border);
    box-shadow: var(--sidebar-shadow);
    flex-direction: column;
    transition: transform 0.3s ease-in-out;
    transform: translateX(-250px);
  }

  .menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .menu li a {
    display: block;
    padding: 10px;
    color: #333;
    text-decoration: none;
    user-select: none;
    cursor: pointer;
  }

  .menu li a:hover {
    background-color: var(--surface-hover);
  }

  .content {
    height: 100vh;
    background-color: var(--surface-ground);
    transition: margin-left 0.3s ease-in-out;
    margin-left: 0;
    padding-top: 5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    overflow: auto;
  }

  .container.active .sidebar {
    transform: translateX(0) !important;
  }

  .container.active .content {
    margin-left: 250px !important;
  }
`;

export default StyledLayout;
