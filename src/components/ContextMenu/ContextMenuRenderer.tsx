import { useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const ContextMenuRenderer = ({ x, y, content, isOpen, onClose }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: y, left: x, origin: "top left" });
  const [isMeasured, setIsMeasured] = useState(false);

  // Pozisiyanı hesablamaq üçün funksiyanı ayırırıq
  const updatePosition = useCallback(() => {
    if (!menuRef.current) return;

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
    // Əsas məqam buradır: Hündürlük artdıqca yuxarı doğru sürüşməlidir
    if (y + menuHeight > screenHeight) {
      finalY = screenHeight - menuHeight - 10; // Ekranın altına 10px qalmış dayansın
      originY = "bottom";
    }

    setPos({ top: finalY, left: finalX, origin: `${originY} ${originX}` });
    setIsMeasured(true);
  }, [x, y]);

  useLayoutEffect(() => {
    if (isOpen && menuRef.current) {
      // Ölçü dəyişikliklərini izləyirik (Sub-menuya keçəndə hündürlük dəyişir)
      const resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });

      resizeObserver.observe(menuRef.current);

      return () => resizeObserver.disconnect();
    } else {
      setIsMeasured(false);
    }
  }, [isOpen, updatePosition]);

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
            scale: 0.8,
            transition: { duration: 0.15 },
          },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25,
            },
          },
        }}
        style={{
          position: "absolute",
          top: pos.top,
          left: pos.left,
          transformOrigin: pos.origin,
          visibility: isMeasured ? "visible" : "hidden",
          pointerEvents: "auto",
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
