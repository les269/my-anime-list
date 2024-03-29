import { Link, Outlet } from "react-router-dom";
import { MyRouteList } from "../../utils/constants";
import Header from "./header";
import styled from "styled-components";
import { useState } from "react";
import ScrollToTopButton from "./scroll-to-top-button";

const Layout = ({ className }: { className?: string }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className={className}>
      <div className={`container ${showSidebar ? "active" : ""}`}>
        <Header
          className="header"
          showSidebar={() => setShowSidebar((x) => !x)}
        ></Header>
        <div className="sidebar">
          <div className="w-full layout-menu">
            {MyRouteList.map((route) => (
              <ul className="menu" key={route.title}>
                <li>
                  <Link to={route.path} onClick={() => setShowSidebar(false)}>
                    {route.title}
                  </Link>
                </li>
              </ul>
            ))}
          </div>
        </div>
        <div className="content">
          <Outlet></Outlet>
        </div>
        <ScrollToTopButton />
      </div>
    </div>
  );
};

const StyledLayout = styled(Layout)`
  .container {
    min-height: 100vh;
    background-color: var(--surface-ground);
  }

  .sidebar {
    display: block;
    position: fixed;
    height: 100%;
    left: 0;
    width: 250px;
    background-color: #ffffff;
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
    transition: margin-left 0.3s ease-in-out;
    margin-left: 0;
    padding-top: 5rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .container.active .sidebar {
    transform: translateX(0) !important;
  }

  .container.active .content,
  .container.active .header {
    margin-left: 250px !important;
  }
`;

export default StyledLayout;
