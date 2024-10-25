import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  FileText,
  Clock,
  Users,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen w-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" to="#" >
          <FileText className="h-6 w-6 text-primary" />
          <span className="ml-2 text-2xl font-bold text-primary">
            OD Automation
          </span>
        </Link>
        {/* <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            to="#how-it-works"
          >
            How It Works
          </Link>
        </nav> */}
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Streamline Your OD Process
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  Experience the future of On Duty management with our secure,
                  fast, and user-friendly OD Automation platform.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-white text-primary hover:bg-gray-100" onClick={() => {
                  navigate("/dashboard");
                }}>
                  Get Started
                </Button>
                {/* <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-primary"
                >
                  Learn More
                </Button> */}
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  <Clock className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Time-Saving Automation</h3>
                  <p className="text-center text-gray-600">
                    Automate OD requests and approvals, saving time for both students and staff.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  <CheckCircle className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Easy Tracking</h3>
                  <p className="text-center text-gray-600">
                    Track OD status, history, and analytics with just a few clicks.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-4">
                  <Users className="h-12 w-12 text-primary" />
                  <h3 className="text-xl font-bold">Multi-Level Approval</h3>
                  <p className="text-center text-gray-600">
                    Streamlined approval process involving multiple authorities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">Submit Request</h3>
                <p className="text-gray-600">
                  Students submit OD requests through the platform.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">Automated Routing</h3>
                <p className="text-gray-600">
                  Requests are automatically routed to the appropriate authorities.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">Quick Approval</h3>
                <p className="text-gray-600">
                  Authorities review and approve requests efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100"
        >
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Student",
                  content:
                    "OD Automation has made requesting on-duty leave so much easier. No more running around for signatures!",
                },
                {
                  name: "Priya Sharma",
                  role: "Faculty Member",
                  content:
                    "As a faculty advisor, this system has streamlined my workflow. I can quickly review and approve OD requests.",
                },
                {
                  name: "Michael Lee",
                  role: "Department Head",
                  content:
                    "The analytics provided by OD Automation help us make informed decisions about student activities and attendance.",
                },
              ].map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6 space-y-4">
                    <p className="text-gray-600 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary" />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section> */}
      </main>
      <footer className="w-full py-12 md:py-24 lg:py-32 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Streamline Your OD Process?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
              Join numerous institutions already benefiting from our OD Automation system.
            </p>
            <Button className="bg-white text-primary hover:bg-gray-100" onClick={() => {
              navigate("/auth/signup");
            }}>
              Sign Up Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}