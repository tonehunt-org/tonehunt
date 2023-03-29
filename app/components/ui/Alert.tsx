type AlertProps = {
  title: string;
  description?: string;
  variant: "success" | "error";
};

export default function Alert({ title, description, variant }: AlertProps) {
  const successClasses = `bg-green-100 border-t-4 border-teal-500 rounded-b text-teal-900`;
  const successIconClasses = "text-teal-500";
  const errorClasses = `bg-red-100 border-red-500 text-red-900`;
  const errorIconClasses = "text-red-500";

  const classes = variant === "success" ? successClasses : errorClasses;
  const iconClasses = variant === "success" ? successIconClasses : errorIconClasses;

  return (
    <div className={`border-t-4 rounded-b px-4 py-3 shadow-md mb-5 ${classes}`} role="alert">
      <div className="flex items-center">
        <div className="py-1">
          <svg
            className={`fill-current h-6 w-6  mr-4 ${iconClasses}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
          </svg>
        </div>
        <div>
          <p className="font-bold">{title}</p>
          {description ? <p className="text-sm">{description}</p> : null}
        </div>
      </div>
    </div>
  );
}
