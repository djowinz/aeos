import { AlertCircle, ArrowRight, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Anomalies</h1>
          <p className="text-zinc-400">View and manage detected anomalies across your services.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Generate Report</Button>
        </div>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-medium text-white">Active Anomalies</h3>
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {[
            {
              id: "ANM-001",
              service: "payment-service",
              type: "Memory Leak",
              severity: "Critical",
              detected: "10 minutes ago",
              description: "Memory usage increasing steadily without corresponding traffic increase.",
            },
            {
              id: "ANM-002",
              service: "notification-service",
              type: "CPU Spike",
              severity: "Warning",
              detected: "32 minutes ago",
              description: "Periodic CPU spikes detected during message processing.",
            },
            {
              id: "ANM-003",
              service: "auth-service",
              type: "Response Time",
              severity: "Warning",
              detected: "1 hour ago",
              description: "Increased response time for authentication requests, affecting user login experience.",
            },
            {
              id: "ANM-004",
              service: "api-gateway",
              type: "Error Rate",
              severity: "Critical",
              detected: "3 hours ago",
              description: "Sudden increase in 5xx errors for specific API endpoints.",
            },
            {
              id: "ANM-005",
              service: "user-service",
              type: "Database Connection",
              severity: "Warning",
              detected: "5 hours ago",
              description: "Intermittent database connection failures affecting user profile updates.",
            },
          ].map((anomaly) => (
            <div
              key={anomaly.id}
              className={`rounded-md p-4 border ${
                anomaly.severity === "Critical"
                  ? "bg-red-500/10 border-red-500/20"
                  : "bg-amber-500/10 border-amber-500/20"
              }`}
            >
              <div className="flex items-start">
                <AlertCircle
                  className={`h-5 w-5 mt-0.5 ${anomaly.severity === "Critical" ? "text-red-500" : "text-amber-500"}`}
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-white">
                      {anomaly.type} in {anomaly.service}
                    </h4>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        anomaly.severity === "Critical"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-amber-500/20 text-amber-500"
                      }`}
                    >
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-400">{anomaly.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-zinc-500">
                      ID: {anomaly.id} • Detected: {anomaly.detected}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className={`h-7 ${
                          anomaly.severity === "Critical"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-amber-500 hover:bg-amber-600"
                        } text-white`}
                      >
                        Investigate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 border-zinc-700 text-zinc-400 hover:text-white"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
