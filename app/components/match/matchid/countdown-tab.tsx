import clsx from "clsx";

export default function CountdownTab({
  children,
  color = "pink",
}: {
  children: React.ReactNode;
  color?: "pink" | "yellow";
}) {
  return (
    <span
      className={clsx(
        "flex items-center justify-center text-[42px] w-12 h-14",
        color === "pink"
          ? "bg-pink-1 text-white"
          : color === "yellow"
          ? "bg-yellow-1 text-purple-1"
          : ""
      )}
    >
      {children}
    </span>
  );
}
