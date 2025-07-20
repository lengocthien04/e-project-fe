// hooks/useToast.ts
import { useState, useCallback } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastCounter = 0;

// Simple in-memory toast store
const toastStore = {
  toasts: [] as Toast[],
  listeners: [] as ((toasts: Toast[]) => void)[],

  addToast(toast: Omit<Toast, "id">) {
    const newToast: Toast = {
      ...toast,
      id: (++toastCounter).toString(),
    };

    this.toasts.push(newToast);
    this.notify();

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeToast(newToast.id);
    }, 5000);
  },

  removeToast(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.notify();
  },

  notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  },

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastStore.toasts);

  useState(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  });

  const toast = useCallback((toastData: Omit<Toast, "id">) => {
    toastStore.addToast(toastData);
  }, []);

  const removeToast = useCallback((id: string) => {
    toastStore.removeToast(id);
  }, []);

  return {
    toast,
    toasts,
    removeToast,
  };
}

// Toast component
export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm ${
            toast.variant === "destructive"
              ? "bg-red-50 border border-red-200 text-red-800"
              : "bg-white border border-gray-200 text-gray-900"
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{toast.title}</h4>
              {toast.description && (
                <p className="text-sm mt-1 opacity-90">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
