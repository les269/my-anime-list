import React, {
  createContext,
  useRef,
  PropsWithChildren,
  useContext,
} from "react";
import { Toast } from "primereact/toast";

type ToastSeverity = "success" | "info" | "warn" | "error";

type ToastContextType = (
  severity: ToastSeverity,
  summary: string,
  detail: string
) => void;

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const toastRef = useRef<Toast>(null);

  const showToast: ToastContextType = (severity, summary, detail) => {
    toastRef.current?.show({ severity, summary, detail });
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return showToast;
};
