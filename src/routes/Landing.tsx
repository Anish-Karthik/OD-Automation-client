import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, FileText, Clock, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EnhancedLandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="w-full py-6 px-6 bg-transparent absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white p-2 rounded-full group-hover:bg-yellow-400 transition-colors duration-300">
              <FileText className="h-6 w-6 text-gray-900" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
              OD Automation
            </span>
          </Link>
          {/* <nav className="hidden md:flex space-x-8">
            {["Features", "How It Works", "Pricing", "Contact"].map((item) => (
              <Link key={item} to={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-300 hover:text-yellow-400 transition-colors duration-300">
                {item}
              </Link>
            ))}
          </nav> */}
          <Button
            variant="outline"
            className="hidden md:inline-flex text-black border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
            onClick={() => navigate("/auth/login")}
          >
            Log In
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-400 animate-gradient-x">
              Revolutionize Your
              <br />
              OD Management
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
              Experience the future of On Duty management with our secure, fast,
              and user-friendly OD Automation platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 transition-colors duration-300"
                onClick={() => navigate("/auth/login")}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          {/* <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-800 to-transparent"></div> */}
        </section>

        <section id="features" className=" pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-yellow-400">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Time-Saving Automation",
                  description:
                    "Automate OD requests and approvals, saving time for both students and staff.",
                },
                {
                  icon: CheckCircle,
                  title: "Easy Tracking",
                  description:
                    "Track OD status, history, and analytics with just a few clicks.",
                },
                {
                  icon: Users,
                  title: "Multi-Level Approval",
                  description:
                    "Streamlined approval process involving multiple authorities.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <CardContent className="flex flex-col items-center p-6 space-y-4">
                    <div className="p-3 bg-yellow-400 rounded-full">
                      <feature.icon className="h-8 w-8 text-gray-900" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-center text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <footer className=" py-6">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* <div className="mb-6 md:mb-0">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="bg-white p-2 rounded-full">
                    <FileText className="h-6 w-6 text-gray-900" />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    OD Automation
                  </span>
                </Link>
              </div> */}
              {/* <nav className="flex flex-wrap justify-center md:justify-end space-x-6 mb-6 md:mb-0">
                {["Features", "How It Works", "Pricing", "Contact"].map(
                  (item) => (
                    <Link
                      key={item}
                      to={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  )
                )}
              </nav> */}
              <div className="text-gray-400 text-sm flex justify-center w-full">
                © {new Date().getFullYear()} OD Automation. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
