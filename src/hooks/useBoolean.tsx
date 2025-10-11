import { useState } from "react";

export default function useBoolean() {
  const [open, setOpen] = useState<boolean>(false);

  const onToggle = () => {
    setOpen(!open);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
  };
  return { onToggle, onClose, open, onOpen };
}
