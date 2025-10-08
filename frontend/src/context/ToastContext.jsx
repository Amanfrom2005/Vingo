import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-3 w-80 max-w-full">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const Toast = ({ message, type, duration, onClose }) => {
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timerRef.current);
  },);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(onClose, remainingRef.current);
  };

  const pauseTimer = () => {
    clearTimeout(timerRef.current);
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = remainingRef.current - elapsed;
  };

  const resumeTimer = () => {
    startTimer();
  };

  // Colors and icon based on toast type
  const bg =
    type === "success"
      ? "bg-[#4ade80] border-green-400 text-green-900"
      : "bg-[#f87171] border-red-400 text-red-900";

  // Icon (check or error) for clearer context, optional
  const Icon = type === "success" ? (
    <svg
      className="w-6 h-6 mr-3 flex-shrink-0 text-green-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg
      className="w-6 h-6 mr-3 flex-shrink-0 text-red-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div
      className={`relative rounded-lg shadow-lg flex items-center justify-between border px-5 py-3 cursor-pointer select-none transition-all duration-300 ${bg} animate-slideIn`}
      onMouseEnter={() => {
        setHovered(true);
        pauseTimer();
      }}
      onMouseLeave={() => {
        setHovered(false);
        resumeTimer();
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={0}
    >
      <div className="flex items-center flex-1 pr-4">
        {Icon}
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-current font-bold hover:text-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-white rounded"
        aria-label="Close notification"
        type="button"
      >
        ×
      </button>

      {/* Progress bar overlay */}
      <div
        className={`absolute bottom-0 left-0 h-1 rounded-b-lg ${
          type === "success" ? "bg-green-300" : "bg-red-300"
        }`}
        style={{
          width: hovered ? "0%" : "100%",
          animation: hovered
            ? "none"
            : `shrink ${remainingRef.current}ms linear forwards`,
        }}
      ></div>

      <style>
        {`
          @keyframes slideIn {
            from {opacity: 0; transform: translateX(100%);}
            to {opacity: 1; transform: translateX(0);}
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
          @keyframes shrink {
            from {width: 100%;}
            to {width: 0%;}
          }
        `}
      </style>
    </div>
  );
};
