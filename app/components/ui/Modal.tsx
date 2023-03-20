import type { ModalUnstyledProps } from "@mui/base/ModalUnstyled";
import ModalUnstyled from "@mui/base/ModalUnstyled";

export type ModalProps = ModalUnstyledProps & {};

export default function Modal({ open, onClose, children, className, ...muiModalProps }: ModalProps) {
  return (
    <ModalUnstyled
      open={open}
      onClose={onClose}
      slots={{
        backdrop: () => (
          <div
            onClick={(e) => onClose?.(e, "backdropClick")}
            className="bg-black/60 -z-10 fixed right-0 left-0 top-0 bottom-0"
            style={{ WebkitTapHighlightColor: "transparent" }}
          />
        ),
      }}
      {...muiModalProps}
      className="fixed z-50 right-0 left-0 bottom-0 top-0 flex items-center justify-center"
    >
      <div className={`bg-[#222222] p-5 rounded-xl text-white outline-none ${className}`}>{children}</div>
    </ModalUnstyled>
  );
}
