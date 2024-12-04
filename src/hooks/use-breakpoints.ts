"use client";
import React from "react";

export enum MediaType {
  mobile = "mobile",
  tablet = "tablet",
  pc = "pc",
}

export const useBreakpoints = () => {
  const [width, setWidth] = React.useState(globalThis.innerWidth);
  const media = (() => {
    if (width <= 640) return MediaType.mobile;
    if (width <= 768) return MediaType.tablet;
    return MediaType.pc;
  })();

  React.useEffect(() => {
    const handleWindowResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return media;
};

export const useIsMobile = () => {
  const media = useBreakpoints();
  return media === MediaType.mobile;
};

export const useIsTablet = () => {
  const media = useBreakpoints();
  return media === MediaType.tablet;
};

export const useIsPc = () => {
  const media = useBreakpoints();
  return media === MediaType.pc;
};
