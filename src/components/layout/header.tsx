import { useAppDispatch, useAppSelector } from "../../utils/hook";
import { changeDraw } from "../../redux/reducer/app-reducer";
import { Button } from "primereact/button";
import styled from "styled-components";

const LayoutTopbar = styled.div`
  padding: 0;
  height: 4rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1100;
  border-bottom: 1px solid var(--surface-border);
  backdrop-filter: blur(8px);
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
const Header = () => {
  const { title } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  return (
    <LayoutTopbar>
      <LayoutTopbarInner>
        <Button
          icon="pi pi-bars"
          rounded
          text
          onClick={() => dispatch(changeDraw())}
        />
        <LayoutTitle>{title}</LayoutTitle>
      </LayoutTopbarInner>
    </LayoutTopbar>
  );
};
export default Header;
