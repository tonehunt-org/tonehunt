import type { ReactElement } from "react";
import { useState } from "react";
import { Popover } from "@headlessui/react";
import { usePopper } from "react-popper";
import { twMerge } from "tailwind-merge";
import { Link } from "@remix-run/react";
import ClickAwayListener from "@mui/base/ClickAwayListener";

type Item = {
  title: string;
  href: string;
  default?: boolean;
  slug?: string;
};

type ModelSortDropdownProps = {
  className?: string;
  items: Item[];
  icon?: ReactElement;
  renderItem: (item: Item) => string | ReactElement;
};

export default function ModelSortDropdown({ className, items, icon, renderItem }: ModelSortDropdownProps) {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const { styles, attributes } = usePopper(referenceElement, popperElement);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(items.find((item) => item.default));

  return (
    <Popover className={twMerge("relative", className)}>
      <Popover.Button
        // @ts-ignore - don't feel like figuring out the TS error for refs right now
        ref={setReferenceElement}
        className="text-white flex items-center gap-2 w-full text-center justify-center py-2 px-4 text-lg hover:bg-white/5 focus:bg-white/5 rounded-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {selected ? renderItem(selected) : ""} {icon}
      </Popover.Button>

      {open && (
        <Popover.Panel
          static
          // @ts-ignore - don't feel like figuring out the TS error for refs right now
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="my-3 z-50 bg-zinc-900 border border-white/5 drop-shadow-xl rounded-xl p-5 w-72 shadow-lg flex flex-col gap-3"
        >
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <ul className="list-none p-0 m-0 flex flex-col gap-2" onClick={() => setOpen(false)}>
              {items.map((item) => {
                return (
                  <li key={item.href} className="block">
                    <Link
                      to={item.href}
                      prefetch="intent"
                      className="hover:underline block"
                      onClick={() => setSelected(item)}
                    >
                      {renderItem(item)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ClickAwayListener>
        </Popover.Panel>
      )}
    </Popover>
  );
}
