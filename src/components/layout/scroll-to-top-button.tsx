import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: rgba(217, 217, 227, 1);
  color: #fff;
  font-size: 15px;
  visibility: hidden;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease-in-out;
  opacity: 0;
  &.visible {
    visibility: visible;
    opacity: 1;
  }
`;
const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setIsVisible(scrollTop > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ToTopButton
      className={` ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      ↑
    </ToTopButton>
  );
};

export default ScrollToTopButton;
