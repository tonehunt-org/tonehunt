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
    <aside className={twMerge(`flex-1 mx-5 mb-5 flex-grow hidden lg:block min-w-[220px] mt-8 lg:mt-0`, className)}>
      <div className="lg:sticky top-10 lg:max-w-[300px] ">
        <ModelListCountTitle counts={counts} className="lg:text-2xl mb-3" />

        <div className="hidden lg:block border-t border-white/10 pt-10">
          <ArticlesBlock />
        </div>
      </div>
    </aside>
  );
}
