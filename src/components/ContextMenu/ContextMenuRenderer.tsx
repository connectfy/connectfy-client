import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const ContextMenuRenderer = ({ x, y, content, isOpen, onClose }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: y, left: x, origin: "top left" });
  const [isMeasured, setIsMeasured] = useState(false);

  useLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      const menuWidth = menuRef.current.offsetWidth;
      const menuHeight = menuRef.current.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let finalX = x;
      let finalY = y;
      let originX = "left";
      let originY = "top";

      // Sağ tərəf yoxlaması
      if (x + menuWidth > screenWidth) {
        finalX = x - menuWidth;
        originX = "right";
      }

      // Aşağı tərəf yoxlaması
      if (y + menuHeight > screenHeight) {
        finalY = y - menuHeight;
        originY = "bottom";
      }

      setPos({ top: finalY, left: finalX, origin: `${originY} ${originX}` });
      setIsMeasured(true);
    } else {
      setIsMeasured(false);
    }
  }, [isOpen, x, y]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-9999"
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <motion.div
        ref={menuRef}
        initial="hidden"
        animate={isMeasured ? "visible" : "hidden"}
        exit="hidden"
        variants={{
          hidden: {
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            transition: { duration: 0.2 },
          },
          visible: {
            opacity: 1,
            scaleX: 1,
            scaleY: 1,
            transition: {
              opacity: { duration: 0.1 },
              // Əvvəlcə ENİ (scaleX), sonra UZUNLUĞU (scaleY) açılır
              scaleX: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
              scaleY: { delay: 0.15, duration: 0.25, ease: [0.23, 1, 0.32, 1] },
            },
          },
        }}
        style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          transformOrigin: pos.origin, // Animasiyanın başladığı nöqtə
          visibility: isMeasured ? "visible" : "hidden", // Ölçmə bitənə qədər gizlə
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </motion.div>
    </div>,
    document.body,
  );
};

export default ContextMenuRenderer;
