import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js";

export const zipFiles = async (files: File[]) => {
  const zipFileWriter = new BlobWriter();
  const zipWriter = new ZipWriter(zipFileWriter);

  await Promise.all(
    files.map((file) => {
      const blobReader = new BlobReader(file);
      return zipWriter.add(file.name, blobReader);
    })
  );

  return zipWriter.close();
};
