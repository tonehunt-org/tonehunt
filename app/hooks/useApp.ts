import { atom, useAtom } from "jotai";

export const modelPreviewModalOpenAtom = atom<{ open: boolean; modelId?: string }>({
  open: false,
  modelId: undefined,
});

export const useApp = () => {
  const [modelPreviewModalOpen, setModelPreviewModalOpen] = useAtom(modelPreviewModalOpenAtom);

  return {
    modelPreviewModalOpen,
    openModelPreview: (modelId: string) => setModelPreviewModalOpen({ open: true, modelId }),
    closeModelPreview: () => setModelPreviewModalOpen({ open: false, modelId: undefined }),
  };
};
