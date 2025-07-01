import { IoMdShare } from "react-icons/io";

export interface ShareIconProps {
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const ShareIcon = (props: ShareIconProps) => {
  return <IoMdShare className={`text-${props.size}`} />;
};
