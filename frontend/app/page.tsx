import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Code,
  Shield,
  Zap,
  Brain,
  GitPullRequest,
  BarChart3,
  Clock,
  CheckCircle2,
  ChevronRight,
  Menu,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold">Orqa Ops</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link href="#benefits" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
              Benefits
            </Link>
            <Link href="#contact" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/signup" className="hidden md:block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-1 text-sm transition-all duration-300">
                Get Started
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 border-b border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-900/0 to-zinc-900/0 z-0"></div>
          <div className="container relative z-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-zinc-800 px-3 py-1 text-sm text-blue-400">
                  Introducing Orqa Ops
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Predictive Anomaly Remediation with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    AI-Powered
                  </span>{" "}
                  Solutions
                </h1>
                <p className="text-lg text-zinc-400 max-w-lg">
                  Monitor application anomalies and get predictive recommendations to fix issues before they impact your
                  users.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 h-auto text-base rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                    <Link href="/signup" className="flex items-center">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/70 px-6 py-4 h-auto text-base rounded-full transition-all duration-300 hover:border-blue-500/50"
                  >
                    Book a Demo
                  </Button>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Orqa Ops Dashboard"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 border-b border-zinc-800">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Intelligent Monitoring & Remediation</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Orqa Ops continuously monitors your applications and infrastructure, detecting anomalies and providing
                instant remediation solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-blue-500/50 transition-colors group">
                <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Anomaly Detection</h3>
                <p className="text-zinc-400">
                  Continuously monitor your applications and services to detect anomalies before they impact your users.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-purple-500/50 transition-colors group">
                <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">LLM-Powered Analysis</h3>
                <p className="text-zinc-400">
                  Our AI scans your codebase and infrastructure to understand context and generate precise solutions.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-blue-400/50 transition-colors group">
                <div className="bg-blue-400/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-400/20 transition-colors">
                  <GitPullRequest className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant PRs</h3>
                <p className="text-zinc-400">
                  Generate pull requests with fixes that can be deployed in seconds, not hours or days.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-blue-500/50 transition-colors group">
                <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Code className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Code & IaC Scanning</h3>
                <p className="text-zinc-400">
                  Deep integration with your codebase and infrastructure as code for contextual understanding.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-purple-500/50 transition-colors group">
                <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Predictive Remediation</h3>
                <p className="text-zinc-400">
                  Fix issues before they happen with predictive analysis and proactive recommendations.
                </p>
              </div>

              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800 hover:border-blue-400/50 transition-colors group">
                <div className="bg-blue-400/10 p-3 rounded-lg w-fit mb-4 group-hover:bg-blue-400/20 transition-colors">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Rapid Deployment</h3>
                <p className="text-zinc-400">
                  Deploy fixes in seconds with our streamlined workflow and integration with your CI/CD pipeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 border-b border-zinc-800">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Orqa Ops Works</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Our agentic workflow continuously monitors, analyzes, and remediates issues in your applications and
                infrastructure.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-500 to-transparent md:hidden"></div>
                <div className="relative z-10 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                  <div className="bg-blue-500/20 text-blue-400 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2">Monitor</h3>
                  <p className="text-zinc-400">
                    Orqa Ops continuously monitors your applications and services for anomalies and performance issues.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-gradient-to-b from-purple-500 to-transparent md:hidden"></div>
                <div className="relative z-10 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                  <div className="bg-purple-500/20 text-purple-400 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2">Analyze</h3>
                  <p className="text-zinc-400">
                    Our AI analyzes your codebase and infrastructure to understand the context and root cause of issues.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                  <div className="bg-blue-400/20 text-blue-400 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2">Remediate</h3>
                  <p className="text-zinc-400">
                    Generate and deploy fixes with a single click, reducing time to resolution from hours to seconds.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 bg-zinc-900/50 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-4">See Orqa Ops in Action</h3>
                <p className="text-zinc-400 mb-6">
                  Watch how Orqa Ops detects an anomaly and generates a fix in real-time.
                </p>
                <div className="aspect-video bg-zinc-800 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-blue-500/90 hover:bg-blue-500 text-white rounded-full h-14 w-14 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-blue-500/20 hover:scale-105">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      <span className="sr-only">Play video</span>
                    </Button>
                  </div>
                  <Image
                    src="/placeholder.svg?height=540&width=960"
                    alt="Orqa Ops Demo Video"
                    width={960}
                    height={540}
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 border-b border-zinc-800">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Orqa Ops</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Transform your operations with AI-powered anomaly detection and remediation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Reduce Mean Time to Resolution</h3>
                    <p className="text-zinc-400">
                      Cut MTTR from hours to seconds with instant anomaly detection and automated remediation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prevent Outages Before They Happen</h3>
                    <p className="text-zinc-400">
                      Predictive analysis identifies potential issues before they impact your users.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Free Up Engineering Resources</h3>
                    <p className="text-zinc-400">
                      Let your engineers focus on building features, not fixing bugs and infrastructure issues.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Improve System Reliability</h3>
                    <p className="text-zinc-400">
                      Maintain higher uptime and reliability with proactive monitoring and remediation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[500px] rounded-lg overflow-hidden border border-zinc-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                <Image
                  src="/placeholder.svg?height=500&width=600"
                  alt="Orqa Ops Benefits"
                  width={600}
                  height={500}
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-started" className="py-20">
          <div className="container">
            <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>

              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your operations?</h2>
                <p className="text-zinc-400 text-lg mb-8">
                  Join the companies that are using Orqa Ops to detect and fix anomalies before they impact users.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 h-auto text-base rounded-full transition-all duration-300 shadow-md hover:shadow-lg">
                    <Link href="/signup" className="flex items-center">
                      Get Started Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/70 px-6 py-4 h-auto text-base rounded-full transition-all duration-300 hover:border-blue-500/50"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 bg-zinc-900">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-6 w-6 text-blue-500" />
                <span className="text-lg font-bold">Orqa Ops</span>
              </div>
              <p className="text-zinc-400 text-sm">
                AI-powered anomaly detection and remediation for modern applications.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-zinc-400 hover:text-blue-400 transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-400 text-sm">&copy; {new Date().getFullYear()} Orqa Ops. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
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
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
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
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-blue-400 transition-colors">
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
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
