import { Link } from "react-router-dom";
import { Code2,  Paperclip,   Mail, Heart  ,MessageCircleCheck } from "lucide-react";


const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-gradient-to-b from-[#050d18] to-[#02060c] text-white/60">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Brand Section */}
            <div className="space-y-4">
              <Link to="/" className="group flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0a1524]">
                  <img
                    src="/nexora.jpg"
                    alt="Nexora"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-black tracking-[-0.045em] text-white group-hover:text-green-400 transition-colors">
                    NEXORA
                  </span>
                  <span className="text-[7px] font-semibold uppercase tracking-[0.28em] text-white/30">
                    Developer Platform
                  </span>
                </div>
              </Link>
              
              <p className="text-sm leading-relaxed text-white/40">
                Connecting talented developers with amazing opportunities worldwide.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/40 transition-all duration-200 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400">
                  <MessageCircleCheck className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/40 transition-all duration-200 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400">
                  <Paperclip className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/40 transition-all duration-200 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400">
                  <Code2 className="h-4 w-4" />
                </a>
                <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-white/40 transition-all duration-200 hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-400">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/dashboard/discover" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Discover Developers
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/portfolio" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link to="/companies" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Companies
                  </Link>
                </li>
                <li>
                  <Link to="/developers" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Developers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-sm text-white/40 transition-colors duration-200 hover:text-green-400">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.08] py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-white/30">
              © 2026 Nexora. All rights reserved.
            </p>
            
            <div className="flex items-center gap-2 text-sm text-white/30">
              <span>Made with</span>
              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              <span>for developers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;