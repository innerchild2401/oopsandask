'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Zap, 
  DollarSign, 
  Activity,
  LogOut,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react'

interface DashboardData {
  total_users: number
  users_by_country: Array<{ country: string; count: number }>
  total_generations: number
  generations_by_country: Array<{ country: string; count: number }>
  generations_by_mode: Array<{ mode: string; count: number }>
  total_api_calls: number
  total_tokens: number
  total_cost: number
  total_donors: number
  total_donations: number
}

export default function TheBossPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Simple localStorage-based auth for theboss
      const isBossLoggedIn = localStorage.getItem('theboss-logged-in') === 'true'
      if (isBossLoggedIn) {
        setIsAuthenticated(true)
        loadDashboardData()
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (credentials.email !== 'afilip.mme@gmail.com' || credentials.password !== 'shoricica01') {
      setError('Invalid credentials')
      return
    }

    try {
      // Simple localStorage-based auth
      localStorage.setItem('theboss-logged-in', 'true')
      setIsAuthenticated(true)
      loadDashboardData()
    } catch (error) {
      console.error('Login error:', error)
      setError('Login failed')
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('theboss-logged-in')
    setIsAuthenticated(false)
    setDashboardData(null)
  }

  const loadDashboardData = async () => {
    setIsRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('analytics_dashboard')
        .select('*')
        .single()

      if (error) throw error
      setDashboardData(data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              The Boss Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to access the analytics
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">The Boss Dashboard</h1>
              <p className="text-gray-600">Analytics and insights for Oops & Ask For</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={loadDashboardData}
                disabled={isRefreshing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {dashboardData ? (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatNumber(dashboardData.total_users)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Generations</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatNumber(dashboardData.total_generations)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">API Calls</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatNumber(dashboardData.total_api_calls)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Cost</dt>
                        <dd className="text-lg font-medium text-gray-900">{formatCurrency(dashboardData.total_cost)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Users by Country */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Users by Country</h3>
                  <div className="space-y-3">
                    {dashboardData.users_by_country?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.country || 'Unknown'}</span>
                        <span className="text-sm text-gray-500">{formatNumber(item.count)}</span>
                      </div>
                    )) || <p className="text-gray-500">No data available</p>}
                  </div>
                </div>
              </div>

              {/* Generations by Mode */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Generations by Mode</h3>
                  <div className="space-y-3">
                    {dashboardData.generations_by_mode?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 capitalize">{item.mode.replace('_', ' ')}</span>
                        <span className="text-sm text-gray-500">{formatNumber(item.count)}</span>
                      </div>
                    )) || <p className="text-gray-500">No data available</p>}
                  </div>
                </div>
              </div>

              {/* Generations by Country */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Generations by Country</h3>
                  <div className="space-y-3">
                    {dashboardData.generations_by_country?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">{item.country || 'Unknown'}</span>
                        <span className="text-sm text-gray-500">{formatNumber(item.count)}</span>
                      </div>
                    )) || <p className="text-gray-500">No data available</p>}
                  </div>
                </div>
              </div>

              {/* Donations */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Donations</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Total Donors</span>
                      <span className="text-sm text-gray-500">{formatNumber(dashboardData.total_donors)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Total Amount</span>
                      <span className="text-sm text-gray-500">{formatCurrency(dashboardData.total_donations)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* API Usage Details */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">API Usage Details</h3>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Tokens</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatNumber(dashboardData.total_tokens)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total API Calls</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatNumber(dashboardData.total_api_calls)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Cost</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(dashboardData.total_cost)}</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        )}
      </div>
    </div>
  )
}
