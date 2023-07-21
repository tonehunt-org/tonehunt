import { useState, useRef, useEffect } from "react";
import Resizer from "react-image-file-resizer";
import { useFetcher } from "@remix-run/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { AVATAR_MAX_UPLOAD_SIZE } from "~/utils/constants";
import Alert from "./ui/Alert";
import { twMerge } from "tailwind-merge";
import Loading from "~/components/ui/Loading";

const AvatarButton = ({ profile }: any) => {
  const [error, setError] = useState<string>();
  const [drag, setDrag] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const dropRef = useRef<HTMLInputElement>(null);

  const avatarFetcher = useFetcher();
  const isFileUploading = avatarFetcher.state === "submitting";

  useEffect(() => {
    if (avatarFetcher.state === "idle" && avatarFetcher.data?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3500);
    }
  }, [avatarFetcher]);

  const fileChangedHandler = (event: any) => {
    setError(undefined);

    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }

    if (event.target.files[0].size >= AVATAR_MAX_UPLOAD_SIZE) {
      setError("File size is larger than 4mb.");
      return;
    }

    if (fileInput) {
      try {
        Resizer.imageFileResizer(
          event.target.files[0],
          500,
          500,
          "JPEG",
          90,
          0,
          (uri: any) => {
            const formData = new FormData();
            formData.set("file", uri);
            formData.set("id", profile.id);
            const filename = `${profile.username}-${Math.floor(Date.now() / 1000)}.jpg`;
            formData.set("filename", filename);
            avatarFetcher.submit(formData, {
              method: "post",
              action: "/avatar/upload",
              encType: "multipart/form-data",
            });
          },
          "blob",
          250,
          250
        );
      } catch (err) {
        console.log(err);
        setError("An error has ocurred. Please try again.");
      }
    }
  };

  const isAvatar = profile.avatar && profile.avatar !== "";

  return (
    <>
      {showSuccess && !isFileUploading ? (
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <Alert title="Avatar:" description="Image uploaded successfully." variant="success" />
          </div>
        </div>
      ) : null}
      {error && !isFileUploading ? (
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <Alert title="Upload error:" description={error} variant="error" />
          </div>
        </div>
      ) : null}
      {isFileUploading ? (
        <div className="block w-full max-w-[320px] min-h-[224px] m-auto border-white/30 rounded-lg border-dashed border-2">
          <div className="flex flex-col items-center justify-center mb-5 px-8 py-20">
            <Loading />
            <h3 className="font-satoshi-medium uppercase text-white/60 text-xs text-center mt-2">Image uploading</h3>
          </div>
        </div>
      ) : null}
      {!isFileUploading ? (
        <div
          className={twMerge(
            "block w-full max-w-[320px] m-auto border-2 border-white rounded-lg px-8 py-4 border-dashed overflow-hidden relative",
            drag ? "opacity-100" : "opacity-30",
            "hover:opacity-80"
          )}
          onDragEnter={() => {
            setDrag(true);
          }}
          onDragExit={() => setDrag(false)}
          onDragLeave={() => setDrag(false)}
        >
          <avatarFetcher.Form method="post" action="/avatar/upload">
            <div className="flex flex-col items-center justify-center">
              <input
                ref={dropRef}
                type="file"
                name="files"
                multiple
                onChange={fileChangedHandler}
                accept="image/*"
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

              {isAvatar ? (
                <img
                  className="w-24 h-24 object-cover mb-3 rounded-full pointer-events-none"
                  src={profile.avatar}
                  title="Change avatar"
                  alt="Change avatar"
                />
              ) : (
                <UserPlusIcon className="h-24 w-24 mb-3 pointer-events-none" />
              )}

              <span className="pointer-events-none text-center">
                Drop your image here or click to add/change your avatar.
              </span>
              <div className="text-xs text-center mt-1 text-white/60">
                Recommended: 500 x 500 jpg or png format.
                <br />
                Max size: 4mb.
              </div>
            </div>
          </avatarFetcher.Form>
        </div>
      ) : null}
    </>
  );
};

export default AvatarButton;
