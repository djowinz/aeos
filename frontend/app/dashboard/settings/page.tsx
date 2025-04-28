"use client"

import { useState } from "react"
import { Bell, User, Shield, Key, Palette, CreditCard, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400">Manage your account settings and preferences.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-zinc-800 border border-zinc-700">
          <TabsTrigger value="account" className="data-[state=active]:bg-zinc-700">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-zinc-700">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-zinc-700">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="data-[state=active]:bg-zinc-700">
            <Key className="h-4 w-4 mr-2" />
            API
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-zinc-700">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="John Doe" className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="Acme Inc." className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue="Software Engineer"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-zinc-800 pt-5">
              <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing information and subscription.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 p-2 rounded-md">
                    <CreditCard className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Pro Plan</p>
                    <p className="text-sm text-zinc-400">$49/month • Renews on May 15, 2023</p>
                  </div>
                </div>
                <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible and destructive actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-red-900/20 bg-red-900/10 rounded-lg">
                <h4 className="text-sm font-medium text-red-400 mb-2">Delete Account</h4>
                <p className="text-sm text-zinc-400 mb-4">
                  Once you delete your account, there is no going back. This action is permanent and will remove all
                  your data.
                </p>
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anomaly-alerts">Anomaly Alerts</Label>
                      <p className="text-xs text-zinc-400">Receive alerts when anomalies are detected.</p>
                    </div>
                    <Switch id="anomaly-alerts" defaultChecked />
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pr-notifications">Pull Request Updates</Label>
                      <p className="text-xs text-zinc-400">Receive notifications for PR status changes.</p>
                    </div>
                    <Switch id="pr-notifications" defaultChecked />
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-xs text-zinc-400">Receive weekly summary reports.</p>
                    </div>
                    <Switch id="weekly-reports" defaultChecked />
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-xs text-zinc-400">Receive product updates and offers.</p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white">In-App Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="real-time-alerts">Real-time Alerts</Label>
                      <p className="text-xs text-zinc-400">Show real-time alerts in the dashboard.</p>
                    </div>
                    <Switch id="real-time-alerts" defaultChecked />
                  </div>
                  <Separator className="bg-zinc-800" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound-notifications">Sound Notifications</Label>
                      <p className="text-xs text-zinc-400">Play sound for critical alerts.</p>
                    </div>
                    <Switch id="sound-notifications" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-zinc-800 pt-5">
              <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Update your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-zinc-800 pt-5">
              <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white">
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Password</Button>
            </CardFooter>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-zinc-400">Protect your account with 2FA.</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Enable</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>Manage your active sessions and devices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Current Session</p>
                      <p className="text-xs text-zinc-400">MacBook Pro • San Francisco, CA • Active now</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-zinc-500/10 p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-zinc-500"
                      >
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                        <line x1="12" y1="18" x2="12.01" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">iPhone 13</p>
                      <p className="text-xs text-zinc-400">San Francisco, CA • Last active 2 hours ago</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                    Revoke
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for accessing the Orqa Ops API.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-white">Production API Key</p>
                  <p className="text-sm text-zinc-400">Created on Apr 12, 2023</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                    Reveal
                  </Button>
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                    Revoke
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-white">Development API Key</p>
                  <p className="text-sm text-zinc-400">Created on Mar 5, 2023</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                    Reveal
                  </Button>
                  <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                    Revoke
                  </Button>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Key className="mr-2 h-4 w-4" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Configure webhooks to receive real-time event notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-white">Slack Notifications</p>
                  <p className="text-sm text-zinc-400">https://hooks.slack.com/services/T0123/B0123/x0123</p>
                </div>
                <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white">
                  Edit
                </Button>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Webhook</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize the appearance of the dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-blue-500 rounded-lg p-4 bg-zinc-800">
                  <div className="h-20 bg-zinc-900 rounded-md mb-4"></div>
                  <p className="text-sm font-medium text-white">Dark (Default)</p>
                </div>
                <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-800">
                  <div className="h-20 bg-white rounded-md mb-4"></div>
                  <p className="text-sm font-medium text-white">Light</p>
                </div>
                <div className="border border-zinc-800 rounded-lg p-4 bg-zinc-800">
                  <div className="h-20 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-md mb-4"></div>
                  <p className="text-sm font-medium text-white">System</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-zinc-800 pt-5">
              <div className="space-y-1">
                <Label htmlFor="accent-color">Accent Color</Label>
                <Select defaultValue="blue">
                  <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
                    <SelectValue placeholder="Select accent color" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Apply Theme</Button>
            </CardFooter>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader>
              <CardTitle>Language & Region</CardTitle>
              <CardDescription>Set your preferred language and regional settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="pst">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-zinc-800 pt-5">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
