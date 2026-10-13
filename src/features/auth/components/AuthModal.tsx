'use client';

import React from 'react';
import { Modal } from '@/features/shared/components/Modal';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuthModal } from '../hooks/useAuthModal';

export function AuthModal() {
  const { isOpen, view, message, closeModal, setView, triggerSuccess } = useAuthModal();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      maxWidth="md"
      title={view === 'login' ? 'Welcome Back' : 'Create Your Account'}
      description={
        message ||
        (view === 'login'
          ? 'Sign in to sync your roadmap progress and access course lessons.'
          : 'Join thousands of engineers mastering Forward Deployed Engineering.')
      }
    >
      {view === 'login' ? (
        <LoginForm
          onSuccess={triggerSuccess}
          onSwitchToSignup={() => setView('signup')}
        />
      ) : (
        <SignupForm
          onSuccess={triggerSuccess}
          onSwitchToLogin={() => setView('login')}
        />
      )}
    </Modal>
  );
}
