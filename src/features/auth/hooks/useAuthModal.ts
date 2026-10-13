'use client';

// Simple pub-sub / custom event emitter hook for auth modal to avoid complex global state dependencies
type AuthModalView = 'login' | 'signup';

interface AuthModalState {
  isOpen: boolean;
  view: AuthModalView;
  message?: string;
  onSuccess?: () => void;
}

// Global window event listener store
let modalState: AuthModalState = {
  isOpen: false,
  view: 'login',
};

const listeners = new Set<(state: AuthModalState) => void>();

function updateState(newState: Partial<AuthModalState>) {
  modalState = { ...modalState, ...newState };
  listeners.forEach((listener) => listener(modalState));
}

import { useState, useEffect } from 'react';

export function useAuthModal() {
  const [state, setState] = useState<AuthModalState>(modalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const openLogin = (view: AuthModalView = 'login', message?: string, onSuccess?: () => void) => {
    updateState({ isOpen: true, view, message, onSuccess });
  };

  const closeModal = () => {
    updateState({ isOpen: false, message: undefined, onSuccess: undefined });
  };

  const setView = (view: AuthModalView) => {
    updateState({ view });
  };

  return {
    isOpen: state.isOpen,
    view: state.view,
    message: state.message,
    openLogin,
    closeModal,
    setView,
    triggerSuccess: () => {
      if (state.onSuccess) state.onSuccess();
      closeModal();
    },
  };
}
