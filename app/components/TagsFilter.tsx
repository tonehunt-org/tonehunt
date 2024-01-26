import { FC } from "react";
import Badge from "~/components/ui/Badge";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useTagsFilter from "~/hooks/useTagsFilter";
import Button from "~/components/ui/Button";

const TagsFilter: FC = () => {
  const [tagFilter, setTagFilter] = useTagsFilter()
  const clearTag = (tag: string) => {
    setTagFilter(tagFilter.filter(t => t !== tag))
  }

  return (
    <div className="flex flex-row gap-2 pr-2">
      <div className="flex items-center grow flex-wrap gap-2 mb-4">
        {tagFilter.map((tag) => (
          <Badge key={tag} className="pr-2 flex flex-row gap-1 items-center">
            #{tag} <XMarkIcon onClick={() => clearTag(tag)}
                              className="w-5 h-5 p-0.5 cursor-pointer rounded-full hover:bg-gray-600" />
          </Badge>
        ))}
      </div>
      {
        tagFilter.length > 0 && <Button onClick={() => setTagFilter([])} variant="link" className="text-xs whitespace-nowrap underline ml-auto">
          Clear all
        </Button>
      }
  </div>
  )
};
export default TagsFilter;
