import { PropsWithChildren } from "react";

export const Slides = ({ children }: PropsWithChildren<{}>) => {
  return <div className="slides">{children}</div>;
};

export const Slide = ({
  children,
  type,
}: PropsWithChildren<{ type?: "black" | "white" | "video" }>) => {
  const className = type ? `slide ${type}` : "slide";
  return <div className={className}>{children}</div>;
};
