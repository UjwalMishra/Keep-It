import type { ReactElement } from "react";

export interface ButtonProps {
  variant: "primary" | "secondary" | "normal";
  text: string;
  size: "sm" | "md" | "lg";
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset"; // Added type
}

const variantStyles = {
  primary: "bg-primary-button text-white",
  secondary: "bg-secondary-button text-black",
  normal: "text-black",
};

const defaultStyle =
  "rounded-md flex items-center justify-center cursor-pointer";

const sizeStyles = {
  sm: "text-[12px] px-2 py-1",
  md: "text-[16px] px-5 py-1",
  lg: "text-[18px] px-6 py-2",
};

export const Button = (props: ButtonProps) => {
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={`${variantStyles[props.variant]} ${defaultStyle} ${
        sizeStyles[props.size]
      } ${props.fullWidth ? " w-full" : ""}`}
    >
      <span className="font-semibold">{props.text}</span>
      {props.startIcon && <span className="ml-2">{props.startIcon}</span>}

      {props.endIcon && <span className="ml-2">{props.endIcon}</span>}
    </button>
  );
};
