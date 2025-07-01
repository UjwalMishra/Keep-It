import { IoMdAdd } from "react-icons/io";

export interface AddIconProps {
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export const AddIcon = (props: AddIconProps) => {
  return <IoMdAdd className={`text-${props.size}`} />;
};
