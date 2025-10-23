"use client"

import * as React from 'react'
import { ToastProps, Toast, ToastProvider, ToastTitle, ToastDescription, ToastClose, ToastViewport } from './Toast'

type CustomToastProps = {
  title?: string
  description?: string
} & Partial<ToastProps>

type ToastContextType = {
  toast: (props: CustomToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastContainer({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<{ id: string } & CustomToastProps>>([])

  const toast = React.useCallback(
    ({ title, description, ...props }: CustomToastProps) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          title,
          description,
          ...props,
        },
      ])

      return id
    },
    []
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {children}
        {toasts.map(({ id, title, description, ...props }) => (
          <Toast key={id} {...props}>
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}