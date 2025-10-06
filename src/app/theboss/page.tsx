'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Globe, 
  MessageSquare, 
  Zap, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Coffee
} from 'lucide-react'

interface AnalyticsData {
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (username === 'afilip.mme@gmail.com' && password === 'shoricica01') {
      setIsAuthenticated(true)
      await fetchAnalytics()
    } else {
      setError('Invalid credentials')
    }
  }

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/analytics/dashboard')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        setError('Failed to fetch analytics data')
      }
    } catch (err) {
      setError('Error fetching analytics data')
    } finally {
      setIsLoading(false)
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">The Boss Dashboard</CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-center">Admin Access Required</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            The Boss Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analytics and insights for Oops & Ask For
          </p>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <Button 
            onClick={fetchAnalytics} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Activity className="w-4 h-4 mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.total_users)}</div>
                <p className="text-xs text-muted-foreground">
                  Unique users registered
                </p>
              </CardContent>
            </Card>

            {/* Total Generations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.total_generations)}</div>
                <p className="text-xs text-muted-foreground">
                  Messages generated
                </p>
              </CardContent>
            </Card>

            {/* Total API Calls */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.total_api_calls)}</div>
                <p className="text-xs text-muted-foreground">
                  OpenAI API calls made
                </p>
              </CardContent>
            </Card>

            {/* Total Tokens */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tokens Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.total_tokens)}</div>
                <p className="text-xs text-muted-foreground">
                  Total tokens consumed
                </p>
              </CardContent>
            </Card>

            {/* Total Cost */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.total_cost)}</div>
                <p className="text-xs text-muted-foreground">
                  Estimated OpenAI costs
                </p>
              </CardContent>
            </Card>

            {/* Total Donors */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Donors</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(analytics.total_donors)}</div>
                <p className="text-xs text-muted-foreground">
                  Users who donated
                </p>
              </CardContent>
            </Card>

            {/* Total Donations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.total_donations)}</div>
                <p className="text-xs text-muted-foreground">
                  Total donation amount
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics */}
        {analytics && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Users by Country */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Users by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.users_by_country?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.country || 'Unknown'}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(item.count)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generations by Mode */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Generations by Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.generations_by_mode?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{item.mode}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(item.count)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generations by Country */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Generations by Country
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.generations_by_country?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.country || 'Unknown'}</span>
                      <span className="text-sm text-muted-foreground">{formatNumber(item.count)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={() => setIsAuthenticated(false)}
            variant="outline"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}