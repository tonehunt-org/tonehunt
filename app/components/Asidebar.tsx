import type { Counts } from "@prisma/client";
import { ArticlesBlock } from "./Sidebar";
import { ModelListCountTitle } from "./routes/ModelListPage";

type AsidebarProps = {
  counts: Counts[];
};

export default function Asidebar({ counts }: AsidebarProps) {
  return (
    <aside className="flex-1 p-3 xl:ml-10 xl:p-0 flex-grow">
      <div className="w-full xl:max-w-[300px] sticky top-10">
        <ModelListCountTitle counts={counts} className="lg:text-2xl border-b border-white/10 pb-10" />
        <ArticlesBlock />
      </div>
    </aside>
  );
}
