'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
    
    // Store error info in state
    this.setState({ error, errorInfo })
    
    // Log to console for debugging
    console.error('Error details:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. This might be a temporary issue.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded text-xs font-mono text-red-700 dark:text-red-400 overflow-auto">
                  <div className="font-semibold">Error:</div>
                  <div className="mb-2">{this.state.error.message}</div>
                  <div className="font-semibold">Stack:</div>
                  <div className="whitespace-pre-wrap">{this.state.error.stack}</div>
                </div>
              </details>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full"
              >
                Reload Page
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              If the problem persists, please try refreshing the page or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook for functional components to catch errors
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // You could send this to an error reporting service here
    // Example: errorReportingService.captureException(error, { extra: errorInfo })
  }

  return { handleError }
}
