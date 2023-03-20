import { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import type { ModalProps } from "./ui/Modal";
import Modal from "./ui/Modal";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useFetcher } from "@remix-run/react";
import Input from "./ui/Input";

type CreateModalProps = {
  open: ModalProps["open"];
  onClose: () => void;
};

export default function CreateModal({ open, onClose }: CreateModalProps) {
  const [drag, setDrag] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const dropRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileUploadFetcher = useFetcher();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (formRef.current) {
      const formData = new FormData(formRef.current);

      fileUploadFetcher.submit(formData, {
        method: "post",
        action: "/models/new",
        encType: "multipart/form-data",
      });

      setShowFields(true);
    }

    return false;
  };

  useEffect(() => {
    const element = dropRef.current;

    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      element?.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e: any) {
      e.preventDefault();
      e.stopPropagation();
    }

    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        element?.removeEventListener(eventName, preventDefaults, false);
      });
    };
  }, []);

  return (
    <Modal open={open} className="p-24 py-20">
      <>
        <h2 className="text-2xl font-bold mb-5">Create New Model</h2>
        {!showFields ? (
          <div
            className={`border-2 border-white rounded-lg px-32 py-16 border-dashed overflow-hidden relative ${
              drag ? "opacity-100" : "opacity-30"
            } hover:opacity-80`}
            onDragEnter={() => setDrag(true)}
            onDragExit={() => setDrag(false)}
            onDragLeave={() => setDrag(false)}
          >
            <form
              ref={formRef}
              action="/models/new"
              method="post"
              className=" flex flex-col items-center justify-center"
              onSubmit={handleFormSubmit}
            >
              <input
                ref={dropRef}
                type="file"
                name="file"
                onChange={handleFormSubmit}
                style={{
                  width: "400%",
                  height: "100%",
                  marginLeft: "-300%",
                  border: "none",
                  cursor: "pointer",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />

              <ArrowUpTrayIcon className="h-24 w-24 mb-5 pointer-events-none" />
              <span className="pointer-events-none">Drop your files here or click to begin uploading</span>
            </form>
          </div>
        ) : null}

        {showFields ? (
          <div>
            File uploading ...
            <form>
              <Input name="title" label="Title" />
              <Input name="description" label="Description" />
            </form>
          </div>
        ) : null}
      </>
    </Modal>
  );
}
