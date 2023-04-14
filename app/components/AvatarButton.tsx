import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { useFetcher } from "@remix-run/react";

const MAX_UPLOAD_SIZE = 2000000;

const AvatarButton = ({ profile }: any) => {
  console.log(profile);
  const [error, setError] = useState<string>();

  const avatarFetcher = useFetcher();

  const fileChangedHandler = (event) => {
    setError(undefined);
    console.log(event.target.files[0].size);

    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }

    if (event.target.files[0].size >= MAX_UPLOAD_SIZE) {
      console.log("MAX SIZE READCHED");
      setError("Max size reached");
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
            console.log(uri);
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
      }
    }
  };

  return (
    <div className="block w-28 h-28 m-auto relative">
      <avatarFetcher.Form method="post" action="/avatar/upload">
        <input
          type="file"
          name="file"
          onChange={fileChangedHandler}
          accept="image/jpeg, /image/png"
          className="w-28 h-28 border-0 cursor-pointer bg-tonehunt-gray-medium overflow-hidden  absolute top-0 left-0"
        />
        <div className="w-28 h-28 bg-slate-500 hover:bg-slate-900 rounded-full">IMG HERE</div>
        {error ? <div>{error}</div> : null}
      </avatarFetcher.Form>
    </div>
  );
};

export default AvatarButton;
