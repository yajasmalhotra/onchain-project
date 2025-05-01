import { useState, useEffect } from 'react'

type ToastType = 'default' | 'destructive' | 'success'

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastType
  duration?: number
  id?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...props, id }
    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, props.duration || 5000)
  }

  return { toast }
} 