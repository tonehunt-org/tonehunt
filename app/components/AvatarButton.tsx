import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { useFetcher } from "@remix-run/react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { AVATAR_MAX_UPLOAD_SIZE } from "~/utils/constants";
import Alert from "./ui/Alert";

const AvatarButton = ({ profile }: any) => {
  const [error, setError] = useState<string>();

  const avatarFetcher = useFetcher();

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
    <div className="block w-full ">
      <avatarFetcher.Form method="post" action="/avatar/upload">
        <div className="flex flex-col items-center">
          <label
            className={`w-28 h-28 flex flex-col items-center ${
              !isAvatar ? "px-4 py-6" : ""
            } bg-tonehunt-gray-light rounded-full cursor-pointer overflow-hidden`}
          >
            {isAvatar ? (
              <img
                className="w-28 h-28 object-cover rounded-full border-4 border-tonehunt-blue-dark hover:border-tonehunt-blue-medium"
                src={profile.avatar}
                title="Change avatar"
                alt="Change avatar"
              />
            ) : (
              <UserPlusIcon className="inline w-16 h-16 text-tonehunt-gray-lighter hover:text-white" />
            )}
            <input
              type="file"
              name="file"
              onChange={fileChangedHandler}
              accept="image/jpeg, image/png"
              className="hidden"
            />
          </label>
          <div className="text-tiny text-center uppercase mt-3 text-white/60">
            Recommended:
            <br />
            Dimensions: 500 x 500
            <br />
            Format: jpg | png
            <br />
            Max size: 4mb
          </div>
          {error ? (
            <div className="w-full max-w-lg mt-2">
              <Alert title="Upload error:" description={error} variant="error" />
            </div>
          ) : null}
        </div>
      </avatarFetcher.Form>
    </div>
  );
};

export default AvatarButton;
