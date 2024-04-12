import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type ButtonProps = {
  color?: "pink" | "yellow" | "red";
  clip?: 0 | 5 | 10 | 15;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export default function Button({
  color = "yellow",
  clip = 15,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={twMerge(
        clsx(
          "text-sm font-bold py-2 px-6 inline-block cursor-pointer uppercase",
          "disabled:cursor-not-allowed",
          "focus:outline-none",
          color === "pink"
            ? "text-white bg-pink-1 hover:bg-pink-2 active:bg-pink-2 disabled:bg-pink-3"
            : "",
          color === "yellow"
            ? "text-purple-1 bg-yellow-1 hover:bg-yellow-2 active:bg-yellow-2 disabled:bg-[#997E00]"
            : "",
          color === "red"
            ? "text-white bg-red-1 hover:bg-red-2 active:bg-red-2 disabled:bg-red-3"
            : "",
          clip === 15
            ? "clip-path-polygon-[15%_0%,85%_0%,100%_50%,85%_100%,15%_100%,0%_50%]"
            : "",
          clip === 10
            ? "clip-path-polygon-[10%_0%,90%_0%,100%_50%,90%_100%,10%_100%,0%_50%]"
            : "",
          clip === 5
            ? "clip-path-polygon-[5%_0%,95%_0%,100%_50%,95%_100%,5%_100%,0%_50%]"
            : ""
        ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
