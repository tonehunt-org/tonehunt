import type { ReactElement } from "react";
import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";
import Button from "./Button";

export interface DrawerType {
  setShowDrawer: (arg0: boolean) => void;
  showDrawer: boolean;
  placement: "left" | "right";
  children: ReactElement;
  title?: ReactElement | string | null;
  titleBg?: string | null;
}

export const Drawer: React.FC<DrawerType> = ({
  showDrawer,
  setShowDrawer,
  placement,
  title = null,
  children,
  titleBg = "",
}) => {
  const settings = {
    position: placement === "left" ? "left-0" : "right-0",
    visible: "translate-x-0",
    hidden: placement === "left" ? "-translate-x-full" : "translate-x-full",
  };

  // FIX FOR DOUBLE SCROLL BAR WHEN THE DRAWER IS OPEN (IT PREVENTS THE CONTENT OF THE DRAWER  FOR BEING SCROLLED)
  useEffect(() => {
    if (showDrawer) {
      document.getElementsByTagName("body")[0].classList.add("hide-scroll");
    } else {
      document.getElementsByTagName("body")[0].classList.remove("hide-scroll");
    }
  }, [showDrawer]);

  return (
    <Transition show={showDrawer}>
      <div className="fixed inset-0 overflow-hidden z-50">
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
              aria-hidden="true"
              onClick={() => setShowDrawer(false)}
            />
          </Transition.Child>
          <section
            className={`absolute inset-y-0 ${settings.position} max-w-full flex`}
            aria-labelledby="slide-over-heading"
          >
            <Transition.Child
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom={settings.hidden}
              enterTo={settings.visible}
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom={settings.visible}
              leaveTo={settings.hidden}
            >
              <div className="relative w-screen max-w-md">
                <div className="h-screen flex flex-col bg-white shadow-xl overflow-y-auto">
                  <div className={`relative px-2 sm:px-6 ${titleBg}`}>
                    <Button
                      variant="secondary"
                      className="absolute right-0 top-1/2 -mt-5 z-10 px-4 py-2 border-0 hover:bg-transparent hover:text-gray-300"
                      onClick={() => setShowDrawer(false)}
                    >
                      <XMarkIcon className="text-white w-6 h-6" />
                    </Button>
                    {title}
                  </div>
                  <div className="relative flex-1">{children}</div>
                </div>
              </div>
            </Transition.Child>
          </section>
        </div>
      </div>
    </Transition>
  );
};
