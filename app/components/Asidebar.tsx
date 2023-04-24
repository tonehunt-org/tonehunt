import type { Counts } from "@prisma/client";
import { ArticlesBlock } from "./Sidebar";
import { ModelListCountTitle } from "./routes/ModelListPage";
import { twMerge } from "tailwind-merge";

type AsidebarProps = {
  counts: Counts[];
  className?: string;
};

export default function Asidebar({ counts, className }: AsidebarProps) {
  return (
    <aside
      className={twMerge(`flex-1 ml-5 md:ml-10 md:mr-0 mr-5 flex-grow hidden lg:block pr-5 min-w-[220px]`, className)}
    >
      <div className="md:sticky top-10 md:max-w-[300px] ">
        <ModelListCountTitle counts={counts} className="lg:text-2xl" />
        <div className="hidden md:block border-t border-white/10 pt-10">
          <ArticlesBlock />
        </div>
      </div>
    </aside>
  );
}
