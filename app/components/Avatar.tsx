import { UserIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

type AvatarProps = {
  size?: number;
  src?: string | null;
  className?: string;
  title?: string | null;
  padding?: number;
  border?: boolean;
};

export default function Avatar({ size = 24, src, className, title, padding = 2, border }: AvatarProps) {
  return src ? (
    <img
      className={twMerge(
        `w-${size} h-${size} object-cover rounded-full `,
        border ? "border border-white/10" : "",
        className
      )}
      src={src}
      title={title ?? undefined}
      alt={title ?? undefined}
    />
  ) : (
    <UserIcon className={twMerge(`h-${size} bg-tonehunt-gray-light rounded-full p-${padding}`, className)} />
  );
}
