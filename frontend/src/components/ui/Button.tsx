import type { ReactElement } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  size: "sm" | "md" | "lg";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: "bg-primary-button text-white",
  secondary: "bg-secondary-button text-black",
};

const defaultStyle = "rounded-md flex items-center cursor-pointer";

const sizeStyles = {
  sm: "text-[12px] px-4 py-1",
  md: "text-[16px] px-5 py-1",
  lg: "text-[18px] px-6 py-2",
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      onClick={props.onClick}
      className={`${variantStyles[props.variant]} ${defaultStyle} ${
        sizeStyles[props.size]
      } ${props.fullWidth ? " w-full flex justify-center items-center" : ""}`}
    >
      <div>{props.startIcon ? <div>{props.startIcon}</div> : null}</div>
      <div> {props.text}</div>
    </button>
  );
};
