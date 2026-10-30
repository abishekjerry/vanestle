import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PScroll = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);
  return null;
};

export default PScroll;