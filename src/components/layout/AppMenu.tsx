import { Ripple } from "primereact/ripple";
import { MyRouterType } from "../../utils/typings";
import styled from "styled-components";

const Menu = styled.div`
  padding: 0.75rem 2rem;
  cursor: pointer;
  &:hover {
    background-color: var(--surface-hover);
  }
  > span {
    user-select: none;
  }
`;
const AppMenu = (props: {
  item: MyRouterType;
  clickMenu: (item: MyRouterType) => void;
}) => {
  const { item, clickMenu } = props;
  return (
    <Menu onClick={() => clickMenu(item)}>
      <span>{item.title}</span>
    </Menu>
  );
};

export default AppMenu;
