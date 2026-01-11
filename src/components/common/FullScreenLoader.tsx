'use client';

import React from 'react';

interface FullScreenLoaderProps {
  isOpen?: boolean;
  message?: string;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  isOpen = true,
  message
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm flex items-center justify-center z-100">
      {/* Spinner Container */}
      <div className="flex flex-col items-center gap-4">
        {/* Animated Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
          <div
            className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"
            style={{
              animation: 'spin 1s linear infinite',
            }}
          />
        </div>

        {/* Loading Message */}
        {message && (
          <p className="text-white font-medium text-lg">
            {message}
          </p>
        )}

        {/* Optional: Default message if no message prop */}
        {!message && (
          <p className="text-white font-medium text-lg">Cargando...</p>
        )}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};
