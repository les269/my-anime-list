import { Button } from "primereact/button";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { MyRouteList } from "../../utils/constants";

const LayoutTopbar = styled.div`
  padding: 0;
  height: 4rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1100;
  border-bottom: 1px solid var(--surface-border);
  backdrop-filter: blur(8px);
  background-color: #ffffff80;
  transition: margin-left 0.3s ease-in-out;
`;
const LayoutTopbarInner = styled.div`
  height: 100%;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 2rem;
`;
const LayoutTitle = styled.h6`
  padding: 0 2rem;
`;
const Header = (props: { showSidebar: () => void; className?: string }) => {
  const { showSidebar, className } = props;
  let location = useLocation();
  return (
    <LayoutTopbar className={className}>
      <LayoutTopbarInner>
        <Button icon="pi pi-bars" rounded text onClick={() => showSidebar()} />
        <LayoutTitle>
          {MyRouteList.find((x) => x.path === location.pathname)?.title}
        </LayoutTitle>
      </LayoutTopbarInner>
    </LayoutTopbar>
  );
};
export default Header;
