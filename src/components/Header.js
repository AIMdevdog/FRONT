import styled from "styled-components";

const HeaderContainer = styled.div`
  height: 60px;
  width: 100%;
  background-color: red;
  display: ${(props) => (props.path === "/signin" ? "none" : "block")};
`;

const Header = ({ path }) => {
  return <HeaderContainer path={path}>1</HeaderContainer>;
};

export default Header;
