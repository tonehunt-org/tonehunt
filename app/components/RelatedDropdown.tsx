import type { PropsWithChildren } from "react";
import { useState } from "react";
import { Popover } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { usePopper } from "react-popper";
import { twMerge } from "tailwind-merge";

type RelatedDropdownProps = PropsWithChildren & {
  className?: string;
};

export default function RelatedDropdown({ children, className }: RelatedDropdownProps) {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <Popover className={twMerge("relative", className)}>
      <Popover.Button
        // @ts-ignore - don't feel like figuring out the TS error for refs right now
        ref={setReferenceElement}
        className="text-white/80 hover:bg-tonehunt-gray-medium rounded-full py-2 px-1 ml-2"
      >
        <EllipsisVerticalIcon className="w-6 h-6" />
      </Popover.Button>

      <Popover.Panel
        // @ts-ignore - don't feel like figuring out the TS error for refs right now
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="m-2 z-50 bg-zinc-900 border border-white/5 drop-shadow-xl rounded-xl p-5 w-72 shadow-lg flex flex-col gap-3"
      >
        {children}
      </Popover.Panel>
    </Popover>
  );
}
