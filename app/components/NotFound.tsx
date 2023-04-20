import { FaceFrownIcon } from "@heroicons/react/24/outline";
import type { PropsWithChildren } from "react";

const NotFound = ({ children }: PropsWithChildren) => (
  <div className="w-full">
    <div className="flex flex-col">
      <div className="flex-1">
        <div className="w-full px-3 py-10 xl:max-w-3xl xl:m-auto">
          <div className="flex justify-center flex-col">
            <div className="flex-1">
              <div className="flex justify-center">
                <FaceFrownIcon className="w-32" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-center">
                <h1 className="text-3xl font-satoshi-bold my-5 uppercase">{children}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NotFound