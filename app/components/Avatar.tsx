import { UserIcon } from "@heroicons/react/24/outline";
import { twMerge } from "tailwind-merge";

type AvatarProps = {
  size?: number;
  src?: string | null;
  className?: string;
  title?: string | null;
  padding?: number;
};

export default function Avatar({ size = 24, src, className, title, padding = 2 }: AvatarProps) {
  return src ? (
    <img
      className={twMerge(`w-${size} h-${size} object-cover rounded-full `, className)}
      src={src}
      title={title ?? undefined}
      alt={title ?? undefined}
    />
  ) : (
    <UserIcon className={twMerge(`h-${size} bg-tonehunt-gray-light rounded-full p-${padding}`, className)} />
  );
}
