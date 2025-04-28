"use client"

import { useState } from "react"
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  Cpu,
  GitPullRequest,
  HelpCircle,
  Shield,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/stat-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { ActivityItem } from "@/components/dashboard/activity-item"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, John</h1>
          <p className="text-zinc-400">Here's what's happening with your services today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Generate Report</Button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Services" value="24/26" icon={Cpu} trend={{ value: 2, isPositive: true }} />
        <StatCard
          title="Detected Anomalies"
          value="7"
          description="3 critical, 4 warnings"
          icon={AlertCircle}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="Remediation PRs"
          value="5"
          description="2 pending review"
          icon={GitPullRequest}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Avg. Resolution Time"
          value="14m"
          description="Down from 32m"
          icon={Clock}
          trend={{ value: 56, isPositive: true }}
        />
      </div>

      {/* Charts section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Anomaly Detection"
          action={
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          }
        >
          <div className="h-[240px] flex items-center justify-center bg-zinc-800/50 rounded-md">
            <div className="text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-zinc-500" />
              <p className="mt-2 text-sm text-zinc-400">Anomaly detection chart would render here</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard
          title="Service Health"
          action={
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          }
        >
          <div className="h-[240px] flex items-center justify-center bg-zinc-800/50 rounded-md">
            <div className="text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-zinc-500" />
              <p className="mt-2 text-sm text-zinc-400">Service health chart would render here</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent activity and alerts */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-2 border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-white">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-6">
            <ActivityItem
              icon={<AlertCircle className="h-4 w-4" />}
              title="Memory leak detected in payment-service"
              description="Anomaly detected in memory usage pattern. AI analysis suggests a potential memory leak in the payment processing module."
              timestamp="10 minutes ago"
              status="error"
            />
            <ActivityItem
              icon={<GitPullRequest className="h-4 w-4" />}
              title="Pull request created for auth-service"
              description="PR #342 created to fix JWT token validation issue in the authentication service."
              timestamp="32 minutes ago"
              status="info"
            />
            <ActivityItem
              icon={<CheckCircle2 className="h-4 w-4" />}
              title="API latency issue resolved"
              description="The high latency issue in the product API has been successfully resolved. Response times back to normal."
              timestamp="1 hour ago"
              status="success"
            />
            <ActivityItem
              icon={<Bell className="h-4 w-4" />}
              title="Database CPU utilization warning"
              description="Database cluster showing elevated CPU usage (78%). Monitoring for potential scaling needs."
              timestamp="3 hours ago"
              status="warning"
            />
            <ActivityItem
              icon={<Code className="h-4 w-4" />}
              title="Code scan completed"
              description="Weekly code scan completed. 2 medium severity issues detected in the notification service."
              timestamp="5 hours ago"
              status="info"
            />
          </div>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-white">Critical Alerts</h3>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="rounded-md bg-red-500/10 p-4 border border-red-500/20">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-white">Payment Service Memory Leak</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Critical memory usage detected in the payment service. Potential memory leak in transaction
                    processing module.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" className="h-7 bg-red-500 hover:bg-red-600 text-white">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 border-zinc-700 text-zinc-400 hover:text-white">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-amber-500/10 p-4 border border-amber-500/20">
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-white">Database CPU Utilization</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Database cluster showing elevated CPU usage (78%). Consider scaling or query optimization.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" className="h-7 bg-amber-500 hover:bg-amber-600 text-white">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 border-zinc-700 text-zinc-400 hover:text-white">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-blue-500/10 p-4 border border-blue-500/20">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-white">Security Vulnerability</h4>
                  <p className="mt-1 text-xs text-zinc-400">
                    Medium severity security vulnerability detected in notification-service dependency.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" className="h-7 bg-blue-500 hover:bg-blue-600 text-white">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 border-zinc-700 text-zinc-400 hover:text-white">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Services overview */}
      <Card className="border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-white">Services Overview</h3>
          <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
            Add Service <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-3 text-left text-xs font-medium text-zinc-500">SERVICE</th>
                <th className="pb-3 text-left text-xs font-medium text-zinc-500">STATUS</th>
                <th className="pb-3 text-left text-xs font-medium text-zinc-500">UPTIME</th>
                <th className="pb-3 text-left text-xs font-medium text-zinc-500">CPU</th>
                <th className="pb-3 text-left text-xs font-medium text-zinc-500">MEMORY</th>
                <th className="pb-3 text-left text-xs font-medium text-zinc-500">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                {
                  name: "api-gateway",
                  status: "healthy",
                  uptime: "99.99%",
                  cpu: "12%",
                  memory: "256MB",
                },
                {
                  name: "auth-service",
                  status: "healthy",
                  uptime: "99.95%",
                  cpu: "8%",
                  memory: "128MB",
                },
                {
                  name: "payment-service",
                  status: "critical",
                  uptime: "97.32%",
                  cpu: "45%",
                  memory: "1.2GB",
                },
                {
                  name: "user-service",
                  status: "healthy",
                  uptime: "99.98%",
                  cpu: "10%",
                  memory: "256MB",
                },
                {
                  name: "notification-service",
                  status: "warning",
                  uptime: "99.45%",
                  cpu: "22%",
                  memory: "384MB",
                },
              ].map((service) => (
                <tr key={service.name}>
                  <td className="py-3 text-sm font-medium text-white">{service.name}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          service.status === "healthy"
                            ? "bg-green-500"
                            : service.status === "warning"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                      />
                      <span
                        className={`ml-2 text-sm ${
                          service.status === "healthy"
                            ? "text-green-500"
                            : service.status === "warning"
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-zinc-400">{service.uptime}</td>
                  <td className="py-3 text-sm text-zinc-400">{service.cpu}</td>
                  <td className="py-3 text-sm text-zinc-400">{service.memory}</td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm" className="h-7 text-zinc-400 hover:text-white">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
