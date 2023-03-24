import { useRouteLoaderData } from "@remix-run/react";
import { useFetcher } from "react-router-dom";
import { useApp } from "~/hooks/useApp";
import Modal from "./ui/Modal";

type ModelPreviewModalProps = {};

export default function ModelPreviewModal({}: ModelPreviewModalProps) {
  const { modelPreviewModalOpen } = useApp();
  const fetcher = useFetcher();

  // useEffect(() => {}, [])

  return (
    <Modal open={modelPreviewModalOpen.open}>
      <div>Model preview</div>
    </Modal>
  );
}
