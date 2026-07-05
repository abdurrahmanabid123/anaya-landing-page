/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Star, 
  Check, 
  Compass, 
  FileText, 
  Plane, 
  Award, 
  Send, 
  Calendar, 
  Users, 
  CheckCircle, 
  Heart, 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare,
  Home,
  Briefcase,
  Headphones,
  MoreHorizontal,
  Lock,
  User,
  Shield
} from "lucide-react";
import { defaultSiteConfig, SiteConfig, ServiceDetail } from "./defaultConfig";
import AdminPanel from "./components/AdminPanel";
import { PrivacyPage, TermsPage } from "./components/LegalPages";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
// Helper functions to format numbers robustly
export const getWhatsAppNumber = (num: string): string => {
  if (!num) return "8801700000000";
  // Remove all non-digit characters
  let cleaned = num.replace(/\D/g, "");
  // If it starts with 0 and has 11 digits (e.g. 01700000000), prepend "88"
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = "88" + cleaned;
  }
  // If it's 10 digits and starts with 1 (e.g. 1700000000), prepend "880"
  if (cleaned.length === 10 && cleaned.startsWith("1")) {
    cleaned = "880" + cleaned;
  }
  return cleaned;
};

export const getTelNumber = (num: string): string => {
  if (!num) return "";
  return num.replace(/[^0-9+]/g, "");
};

export default function App() {
  // Main Site Editable Configuration State (Synced with Firestore in real-time)
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [isLoading, setIsLoading] = useState(true);

  // Sync with Firebase Firestore in real-time
  useEffect(() => {
    const configDocRef = doc(db, "config", "settings");
    const unsubscribe = onSnapshot(configDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const firestoreData = snapshot.data();
        setConfig(firestoreData as SiteConfig);
      } else {
        // If the document doesn't exist yet, bootstrap Firestore with defaultSiteConfig
        setDoc(configDocRef, defaultSiteConfig)
          .then(() => {
            console.log("Database initialized with default site configuration.");
          })
          .catch((err) => {
            console.error("Failed to initialize database", err);
          });
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Admin and Login States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation active state
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Interactive Service Modal State
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // Lead Booking Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    service: "",
    travelers: "1",
    specialRequests: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string; service?: string }>({});

  // Monitor scroll to update active section & shadow navbar
  const [scrolled, setScrolled] = useState(false);

  // Subpages Navigation State
  const [currentPage, setCurrentPage] = useState<"home" | "privacy" | "terms">("home");

  // Testimonial Carousel Scrolling State and Refs
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const testimonialContainerRef = useRef<HTMLDivElement>(null);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll testimonials smoothly
  useEffect(() => {
    const container = testimonialContainerRef.current;
    if (!container || currentPage !== "home") return;

    let intervalId: NodeJS.Timeout;

    const startAutoScroll = () => {
      intervalId = setInterval(() => {
        if (isTestimonialPaused) return;

        const singleCopyWidth = container.scrollWidth / 3;
        
        // If we scroll past the second copy, subtract the width of one copy instantly to loop infinitely
        if (container.scrollLeft >= singleCopyWidth * 2) {
          container.scrollLeft -= singleCopyWidth;
        } else {
          container.scrollLeft += 1;
        }
      }, 30); // smooth increment step
    };

    startAutoScroll();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTestimonialPaused, currentPage, config.testimonials]);

  // Reset testimonial scroll to middle on load/data-change to support left-right endless scroll
  useEffect(() => {
    const container = testimonialContainerRef.current;
    if (container && currentPage === "home") {
      setTimeout(() => {
        container.scrollLeft = container.scrollWidth / 3;
      }, 100);
    }
  }, [config.testimonials, currentPage]);

  const scrollPrev = () => {
    const container = testimonialContainerRef.current;
    if (container) {
      container.scrollBy({ left: -340, behavior: "smooth" });
      setIsTestimonialPaused(true);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        setIsTestimonialPaused(false);
      }, 3000);
    }
  };

  const scrollNext = () => {
    const container = testimonialContainerRef.current;
    if (container) {
      container.scrollBy({ left: 340, behavior: "smooth" });
      setIsTestimonialPaused(true);
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = setTimeout(() => {
        setIsTestimonialPaused(false);
      }, 3000);
    }
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      setIsTestimonialPaused(false);
    }, 3000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["hero", "services", "why-us", "faq", "testimonials", "booking"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of floating navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Save config handler
  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    try {
      await setDoc(doc(db, "config", "settings"), newConfig);
      localStorage.setItem("anaya_tours_config", JSON.stringify(newConfig));
    } catch (err) {
      console.error("Failed to save config to Firestore:", err);
      alert("তথ্যটি ফায়ারবেসে সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    }
  };

  // Admin login handler
  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    const expectedUsername = (config.adminUsername || "admin").trim();
    const expectedPassword = (config.adminPassword || "admin").trim();
    if (loginUsername.trim() === expectedUsername && loginPassword.trim() === expectedPassword) {
      setIsAdminMode(true);
      setLoginError("");
      setLoginUsername("");
      setLoginPassword("");
      window.scrollTo(0, 0);
    } else {
      setLoginError("ভুল ইউজারনেম অথবা পাসওয়ার্ড! অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    }
  };

  // Use state variables derived from config
  const services = config.services;
  const valueProps = config.valueProps;
  const faqs = config.faqs;

  // Loading state fallback
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative flex flex-col items-center">
          {/* Pulsing Gold/Purple Ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400 to-purple-600 blur opacity-30 animate-pulse" />
          <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center shadow-2xl max-w-sm">
            {/* Spinning Indicator */}
            <div className="w-12 h-12 border-4 border-slate-800 border-t-amber-400 rounded-full animate-spin mb-4" />
            <h3 className="text-white font-bold text-lg mb-1 tracking-wide">তথ্য লোড হচ্ছে...</h3>
            <p className="text-slate-400 text-xs leading-relaxed">আনায়া ওমরাহ ও ট্যুরস অ্যান্ড ট্রাভেলসের লেটেস্ট তথ্য ডাটাবেজ থেকে রিয়াল-টাইমে লোড করা হচ্ছে। দয়া করে একটু অপেক্ষা করুন।</p>
          </div>
        </div>
      </div>
    );
  }

  // Full-screen admin mode intercept
  if (isAdminMode) {
    return (
      <AdminPanel 
        config={config} 
        onSave={handleSaveConfig} 
        onExit={() => {
          setIsAdminMode(false);
          window.scrollTo(0, 0);
        }} 
      />
    );
  }

  // Handle lead capture submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; phone?: string; service?: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "আপনার পুরো নাম লিখুন";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "আপনার মোবাইল নম্বরটি লিখুন";
    } else if (!/^[0-9+ ]{10,15}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "সঠিক মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)";
    }
    if (!formData.service) {
      newErrors.service = "অনুগ্রহ করে একটি সার্ভিস নির্বাচন করুন";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const formEl = document.getElementById("booking-form-box");
      if (formEl) {
        formEl.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Get chosen service title
    let selectedServiceTitle = "";
    if (formData.service === "umrah") {
      selectedServiceTitle = "পবিত্র ওমরাহ প্যাকেজ";
    } else if (formData.service === "hajj") {
      selectedServiceTitle = "পবিত্র হজ প্যাকেজ";
    } else if (formData.service === "visa") {
      selectedServiceTitle = "ভিসা প্রসেসিং সার্ভিস";
    } else if (formData.service === "tours") {
      selectedServiceTitle = "গ্লোবাল হলিডে ট্যুর";
    } else {
      const match = config.services.find(s => s.id === formData.service);
      selectedServiceTitle = match ? match.title : formData.service;
    }

    const specialReq = formData.specialRequests.trim() || "নেই";

    // --- ফায়ারবেস ডাটাবেজে বুকিং তথ্য পাঠানো ---
    try {
      await addDoc(collection(db, "bookings"), {
        fullName: formData.fullName,
        phone: formData.phone,
        service: formData.service,
        serviceTitle: selectedServiceTitle,
        travelers: formData.travelers,
        specialRequests: specialReq,
        createdAt: serverTimestamp(),
        source: "website_lead"
      });
      console.log("✅ Booking saved to database!");
    } catch (dbError) {
      console.error("❌ Firestore Error:", dbError);
    }

    // Format the WhatsApp message beautifully with emojis and clean spacing
    const messageText = 
      `আসসালামু আলাইকুম, আনায়া ট্যুরস এন্ড ট্রাভেলস! 😊\n\n` +
      `আমি আপনাদের ওয়েবসাইট থেকে একটি booking আবেদন পাঠিয়েছি। আমার বিবরণ নিচে দেওয়া হলো:\n\n` +
      `👤 *নাম:* ${formData.fullName}\n` +
      `📞 *মোবাইল:* ${formData.phone}\n` +
      `🕋 *নির্বাচিত সার্ভিস:* ${selectedServiceTitle}\n` +
      `👥 *যাত্রীর সংখ্যা:* ${formData.travelers} জন\n` +
      `📝 *विशेष অনুরোধ বা প্রশ্ন:* ${specialReq}\n\n` +
      `দয়া করে আমার বুকিংটি চেক করে পরবর্তী তথ্য জানিয়ে সাহায্য করুন। ধন্যবাদ! 🙏`;

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased selection:bg-brand-gold selection:text-brand-blue">
      
      {/* TOP NOTIFICATION BAR */}
      <div className="bg-brand-blue text-white text-xs md:text-sm py-2 px-4 border-b border-brand-gold/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-slate-200">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-brand-gold" />
              <a href={`tel:${getTelNumber(config.contactPhone)}`} className="hover:text-brand-gold transition-colors">{config.contactPhone}</a>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Mail className="w-3 h-3 text-brand-gold" />
              <a href={`mailto:${config.contactEmail}`} className="hover:text-brand-gold transition-colors">{config.contactEmail}</a>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-xs text-brand-gold font-medium uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded-full border border-brand-gold/30">
              <Award className="w-3.5 h-3.5 animate-pulse" />
              ধর্ম বিষয়ক মন্ত্রণালয় অনুমোদিত ট্রাভেল লাইসেন্সধারী
            </span>
          </div>
        </div>
      </div>

      {/* STICKY MAIN HEADER / NAVIGATION */}
      {currentPage === "home" ? (
        <header className={`${mobileMenuOpen ? "fixed" : "sticky"} top-0 z-40 transition-all duration-300 w-full py-3 md:py-4 ${scrolled || mobileMenuOpen ? "bg-brand-blue/95 backdrop-blur-md shadow-lg" : "bg-brand-blue border-b border-white/5"}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
            
            {/* Logo Brand Block */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentPage("home"); setTimeout(() => scrollToId("hero"), 50); }}>
              {config.siteLogoType === "image" && config.siteLogo ? (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900/40 overflow-hidden flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                  <img src={config.siteLogo} alt={config.siteName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-brand-gold to-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-500/10 shrink-0">
                  <Compass className="w-6 h-6 md:w-7 md:h-7 text-brand-purple animate-spin-slow" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">
                  {config.siteName.split(" ")[0]} <span className="text-brand-gold font-medium">{config.siteName.split(" ").slice(1).join(" ")}</span>
                </h1>
                <p className="text-[10px] md:text-xs text-slate-300 font-light tracking-wide mt-1 uppercase">
                  {config.siteNameEn}
                </p>
              </div>
            </div>

          {/* Desktop Navigation Links — Custom Capsule/Pill Design Inspired by the Image */}
          <nav className="hidden lg:flex items-center">
            <div className="bg-brand-blue border border-white/10 rounded-full p-1 shadow-lg shadow-black/25 flex items-center">
              
              {/* Home Item */}
              <button 
                onClick={() => scrollToId("hero")} 
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeSection === "hero" 
                    ? "bg-white text-brand-blue shadow-md" 
                    : "text-slate-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Home className={`w-4 h-4 ${activeSection === "hero" ? "text-brand-blue" : "text-slate-200"}`} />
                <span>হোম</span>
              </button>

              {/* Vertical Divider */}
              <div className="w-[1px] h-4 bg-white/20 mx-1" />

              {/* Package Item */}
              <button 
                onClick={() => scrollToId("services")} 
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeSection === "services" 
                    ? "bg-white text-brand-blue shadow-md" 
                    : "text-slate-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Briefcase className={`w-4 h-4 ${activeSection === "services" ? "text-brand-blue" : "text-slate-200"}`} />
                <span>প্যাকেজ</span>
              </button>

              {/* Vertical Divider */}
              <div className="w-[1px] h-4 bg-white/20 mx-1" />

              {/* More (আরও) Item with Interactive Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setMoreMenuOpen(true)}
                onMouseLeave={() => setMoreMenuOpen(false)}
              >
                <button 
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    ["why-us", "faq", "testimonials"].includes(activeSection)
                      ? "bg-white text-brand-blue shadow-md" 
                      : "text-slate-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>আরও</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${moreMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu list */}
                {moreMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-50 overflow-hidden animate-fade-in text-right">
                    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl py-2 text-right">
                      <button 
                        onClick={() => { scrollToId("why-us"); setMoreMenuOpen(false); }}
                        className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-brand-blue text-xs md:text-sm font-medium transition-colors flex items-center justify-between border-b border-slate-100 text-left cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-brand-gold" />
                        <span>আমরা কেন সেরা</span>
                      </button>
                      <button 
                        onClick={() => { scrollToId("faq"); setMoreMenuOpen(false); }}
                        className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-brand-blue text-xs md:text-sm font-medium transition-colors flex items-center justify-between border-b border-slate-100 text-left cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-brand-gold" />
                        <span>জিজ্ঞাসিত প্রশ্নাবলী</span>
                      </button>
                      <button 
                        onClick={() => { scrollToId("testimonials"); setMoreMenuOpen(false); }}
                        className="w-full px-4 py-2.5 hover:bg-slate-50 text-slate-700 hover:text-brand-blue text-xs md:text-sm font-medium transition-colors flex items-center justify-between text-left cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                        <span>গ্রাহকদের রিভিউ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical Divider */}
              <div className="w-[1px] h-4 bg-white/20 mx-1" />

              {/* Support/Booking Item */}
              <button 
                onClick={() => scrollToId("booking")} 
                className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  activeSection === "booking" 
                    ? "bg-white text-brand-blue shadow-md" 
                    : "text-slate-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Plane className={`w-4 h-4 ${activeSection === "booking" ? "text-brand-blue" : "text-slate-200"}`} />
                <span>বুকিং</span>
              </button>

            </div>
          </nav>

          {/* Desktop Right CTA Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => scrollToId("booking")} 
              className="bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-brand-purple font-semibold px-6 py-2.5 rounded-full text-sm shadow-md shadow-yellow-500/10 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all duration-200 flex items-center gap-2 border border-brand-gold/30"
              id="header-cta"
            >
              প্যাকেজ বুক করুন
              <Send className="w-4 h-4 text-brand-purple" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 text-white hover:text-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/50 rounded-lg transition-colors"
            id="mobile-menu-toggle"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>
      ) : (
        <header className="sticky top-0 z-40 bg-brand-blue shadow-lg py-4 md:py-5 border-b border-brand-gold/10">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
            
            {/* Logo Brand Block */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentPage("home"); window.scrollTo(0, 0); }}>
              {config.siteLogoType === "image" && config.siteLogo ? (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-900/40 overflow-hidden flex items-center justify-center border border-white/10 shadow-lg shrink-0">
                  <img src={config.siteLogo} alt={config.siteName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-tr from-brand-gold to-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-500/10 shrink-0">
                  <Compass className="w-6 h-6 md:w-7 md:h-7 text-brand-purple animate-spin-slow" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">
                  {config.siteName.split(" ")[0]} <span className="text-brand-gold font-medium">{config.siteName.split(" ").slice(1).join(" ")}</span>
                </h1>
                <p className="text-[10px] md:text-xs text-slate-300 font-light tracking-wide mt-1 uppercase">
                  {config.siteNameEn}
                </p>
              </div>
            </div>

            {/* Back Button */}
            <button 
              onClick={() => { setCurrentPage("home"); window.scrollTo(0, 0); }} 
              className="bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-brand-purple font-semibold px-5 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm shadow-md transition-all duration-200 flex items-center gap-2 border border-brand-gold/30 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-brand-purple" />
              <span>মূল পাতায় ফিরে যান</span>
            </button>

          </div>
        </header>
      )}

      {/* MOBILE DRAWER NAVIGATION MENU */}
      {currentPage === "home" && mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-brand-blue/98 backdrop-blur-lg pt-24 pb-28 px-6 flex flex-col justify-between shadow-2xl transition-all duration-300 animate-fade-in overflow-y-auto">
          <nav className="flex flex-col gap-3">
            {[
              { id: "hero", label: "মূল পাতা", icon: Home },
              { id: "services", label: "আমাদের সেবাসমূহ", icon: Compass },
              { id: "why-us", label: "আমরা কেন সেরা", icon: Award },
              { id: "faq", label: "জিজ্ঞাসিত প্রশ্ন", icon: MessageSquare },
              { id: "testimonials", label: "গ্রাহক রিভিউ", icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToId(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 border cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-brand-gold/20 to-amber-500/10 border-brand-gold/60 text-brand-gold font-extrabold shadow-lg shadow-brand-gold/5"
                      : "bg-white/5 border-white/5 hover:bg-white/10 text-slate-200 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-lg ${isActive ? "bg-brand-gold/15 text-brand-gold" : "bg-white/5 text-slate-400"}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "text-brand-gold translate-x-1" : "text-slate-500"}`} />
                </button>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 mt-8">
            <button 
              onClick={() => {
                scrollToId("booking");
                setMobileMenuOpen(false);
              }} 
              className="bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-purple font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2 border border-brand-gold/20 cursor-pointer text-sm"
            >
              প্যাকেজ বুক করুন
              <Send className="w-4 h-4 text-brand-purple" />
            </button>
            <a 
              href={`tel:${getTelNumber(config.contactPhone)}`} 
              className="bg-white/10 hover:bg-white/15 text-white py-3 rounded-xl border border-white/10 text-center flex items-center justify-center gap-2 text-sm font-bold transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              সরাসরি কল করুন
            </a>
          </div>
        </div>
      )}

      {currentPage === "home" ? (
        <>
          {/* 1. HERO SECTION (ব্যানার) */}
          <section id="hero" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center bg-brand-blue text-white overflow-hidden py-16 md:py-24">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={config.heroBgImage} 
            alt="Makkah Grand Mosque Kaaba View" 
            className="w-full h-full object-cover object-center opacity-30 transform scale-105 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          {/* Deep Purple/Blue gradient over image */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/95 via-brand-purple/90 to-brand-blue" />
          
          {/* Subtle geometric grid background overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Text Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left max-w-2xl lg:max-w-none">
              
              {/* Premium Top Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold/20 to-yellow-500/10 border border-brand-gold/40 px-4 py-1.5 rounded-full text-brand-gold text-xs md:text-sm font-medium tracking-wide shadow-lg shadow-brand-gold/5 animate-bounce-slow">
                <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                <span>{config.heroBadge}</span>
              </div>

              {/* Bold Headline */}
              {config.heroTitlePart1 || config.heroTitleGradient ? (
                <h1 className={`text-3xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight md:leading-tight preset-${config.heroGradientPreset || 'shining-gold'}`}>
                  <span className={config.heroTitlePart1Weight || config.heroTitleWeight || 'font-bold'}>{config.heroTitlePart1}</span>{' '}
                  <span className={`gold-gradient ${config.heroTitleGradientWeight || config.heroTitleWeight || 'font-bold'}`}>{config.heroTitleGradient}</span>{' '}
                  <span className={config.heroTitlePart3Weight || config.heroTitleWeight || 'font-bold'}>{config.heroTitlePart3}</span>
                </h1>
              ) : (
                <h1 className={`text-3xl md:text-5xl lg:text-6xl ${config.heroTitleWeight || 'font-bold'} tracking-tight text-white leading-tight md:leading-tight preset-${config.heroGradientPreset || 'shining-gold'}`}
                    dangerouslySetInnerHTML={{ __html: config.heroTitle }} />
              )}

              {/* Subtitle description */}
              <p className="text-slate-300 text-sm md:text-lg leading-relaxed md:leading-relaxed font-light">
                {config.heroDesc}
              </p>

              {/* Feature Highlights Mini Grid */}
              {(() => {
                const bullets = config.heroBullets || [config.heroBullet1, config.heroBullet2, config.heroBullet3].filter(Boolean);
                if (bullets.length === 0) return null;
                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full my-3">
                    {bullets.map((bullet, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-2 bg-white/5 border border-white/10 p-2.5 rounded-lg hover:bg-white/10 hover:border-brand-gold/20 transition-all duration-300 group"
                      >
                        <div className="w-7 h-7 rounded-full bg-brand-gold/15 group-hover:bg-brand-gold/25 flex items-center justify-center shrink-0 transition-colors duration-300">
                          <Check className="w-4 h-4 text-brand-gold" />
                        </div>
                        <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors duration-200">{bullet}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* CTAs and trust indicators */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-2">
                <button 
                  onClick={() => scrollToId("booking")} 
                  className="bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-brand-purple font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-brand-gold/10 hover:shadow-brand-gold/20 hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-3 border border-brand-gold/30"
                  id="hero-cta-btn"
                >
                  প্যাকেজ বুক করুন
                  <Send className="w-5 h-5 text-brand-purple" />
                </button>
                <button 
                  onClick={() => scrollToId("services")} 
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-brand-gold/40 font-medium text-base px-8 py-4 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                >
                  আমাদের প্যাকেজসমূহ
                  <ChevronDown className="w-5 h-5 text-slate-300" />
                </button>
              </div>

              {/* Google Reviews Trust Score */}
              <div className="flex items-center gap-3 mt-4 bg-white/5 px-4 py-2.5 rounded-xl border border-white/10">
                <div className="flex text-brand-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4.5 h-4.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-xs md:text-sm text-slate-300">
                  <span className="font-bold text-white">৪.৯/৫</span> রেটিং প্রাপ্ত (৩৫০+ বিশ্বস্ত ট্রাভেলারদের মতামত)
                </p>
              </div>

            </div>

            {/* Right Media Display Column (Hero Card Badge) */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-sm md:max-w-md bg-gradient-to-tr from-brand-blue/90 via-[#270d44] to-brand-blue/90 p-1 pl-[4px] ml-0 mt-[-190px] rounded-2xl border border-brand-gold/40 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-purple/20 rounded-full blur-xl pointer-events-none" />
                
                {/* Main image inside hero frame */}
                <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-xl">
                  <img 
                    src={config.campImage || config.heroBgImage} 
                    alt="Anaya Holy Umrah Campaign" 
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle decorative frame border */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Gold Discount Badge */}
                  {(config.campDiscountText || config.campDiscountSub) && (
                    <div className="absolute top-4 right-4 bg-brand-purple/95 text-brand-gold border border-brand-gold/50 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-lg flex flex-col items-center leading-tight">
                      <span className="text-yellow-400 font-extrabold text-sm">{config.campDiscountText}</span>
                      <span className="text-[10px] text-slate-300 font-medium">{config.campDiscountSub}</span>
                    </div>
                  )}
                </div>

                {/* Info Text in Hero Card */}
                <div className="p-6 text-left">
                  {config.campBadge && (
                    <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider mb-1">
                      {config.campBadge}
                    </p>
                  )}
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug">
                    {config.campTitle}
                  </h3>
                  <p className="text-slate-300 text-xs md:text-sm mb-4 leading-relaxed font-light">
                    {config.campSub}
                  </p>
                  <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                    <div>
                      <p className="text-[10px] text-slate-400">{config.campDesc || "প্যাকেজ শুরু মাত্র"}</p>
                      <p className="text-base md:text-lg font-bold text-brand-gold">{config.campPrice}</p>
                    </div>
                    <button 
                      onClick={() => scrollToId("booking")} 
                      className="bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      বুকিং করুন
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SERVICES SHOWCASE SECTION (আমাদের মূল পরিষেবাসমূহ) */}
      <section id="services" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-brand-purple bg-purple-50 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-purple/10 uppercase tracking-widest mb-3">
              {config.servicesBadge}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              {config.servicesTitle}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-purple to-brand-gold rounded-full my-4" />
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
              {config.servicesDesc}
            </p>
          </div>

          {/* PC Layout: Dynamic Column Horizontal Grid with Hover Effects | Mobile: Scrollable List */}
          {/* Grid Container */}
          <div className={`hidden md:grid gap-6 ${
            services.length === 1 ? 'md:grid-cols-1 max-w-lg mx-auto' :
            services.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' :
            services.length === 3 ? 'md:grid-cols-3 max-w-6xl mx-auto' :
            'md:grid-cols-2 lg:grid-cols-4'
          }`}>
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group relative bg-[#F8FAFC] rounded-2xl border border-slate-200/80 hover:border-brand-gold/60 hover:bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Accent gold top border on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple to-brand-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div>
                  {/* Icon Frame */}
                  <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-brand-blue/5 flex items-center justify-center mb-5 transition-colors duration-300 border border-purple-100/50">
                    {service.id === "umrah" && <Compass className="w-6 h-6 text-brand-purple group-hover:text-brand-gold transition-colors" />}
                    {service.id === "hajj" && <Award className="w-6 h-6 text-brand-purple group-hover:text-brand-gold transition-colors" />}
                    {service.id === "visa" && <FileText className="w-6 h-6 text-brand-purple group-hover:text-brand-gold transition-colors" />}
                    {service.id === "tours" && <Plane className="w-6 h-6 text-brand-purple group-hover:text-brand-gold transition-colors" />}
                    {!["umrah", "hajj", "visa", "tours"].includes(service.id) && <Compass className="w-6 h-6 text-brand-purple group-hover:text-brand-gold transition-colors" />}
                  </div>

                  {/* Title & Sub */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-purple transition-colors mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs text-brand-gold font-medium mb-3">
                    {service.subtitle}
                  </p>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 line-clamp-3 font-light">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-4">
                  <div>
                    <p className="text-[10px] text-slate-400">শুরু মাত্র</p>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-brand-purple transition-colors">{service.priceStart}</p>
                  </div>
                  <span className="text-xs font-semibold text-brand-purple group-hover:text-brand-gold flex items-center gap-1 transition-colors">
                    বিস্তারিত 
                    <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Layout: A neat, vertical listing card system that is extremely easy to read and touch */}
          <div className="md:hidden flex flex-col gap-5">
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col gap-3 active:bg-white active:border-brand-gold/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
                    {service.id === "umrah" && <Compass className="w-5 h-5 text-brand-purple" />}
                    {service.id === "hajj" && <Award className="w-5 h-5 text-brand-purple" />}
                    {service.id === "visa" && <FileText className="w-5 h-5 text-brand-purple" />}
                    {service.id === "tours" && <Plane className="w-5 h-5 text-brand-purple" />}
                    {!["umrah", "hajj", "visa", "tours"].includes(service.id) && <Compass className="w-5 h-5 text-brand-purple" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">
                      {service.title}
                    </h3>
                    <p className="text-[11px] text-brand-gold font-medium">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed font-light line-clamp-2">
                  {service.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400">শুরু মূল্য: </span>
                    <span className="font-bold text-slate-900">{service.priceStart}</span>
                  </div>
                  <button className="text-xs font-medium text-brand-purple flex items-center gap-1">
                    বিস্তারিত দেখুন
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Info Banner inside Services */}
          <div className="mt-12 bg-gradient-to-r from-brand-blue to-brand-purple text-white p-6 md:p-8 rounded-2xl border border-brand-gold/30 shadow-lg text-left flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shrink-0 text-brand-gold mt-1">
                <Clock className="w-6 h-6 text-brand-gold" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">যেকোনো বিশেষ চাহিদায় কাস্টমাইজড সার্ভিস</h4>
                <p className="text-slate-300 text-xs md:text-sm font-light leading-relaxed">
                  আপনার কি মক্কা বা মদিনার কোনো নির্দিষ্ট পছন্দের হোটেল বা বিশেষ যাতায়াত গাড়ি লাগবে? আমাদের বলুন, আমরা আপনার মনের মতো করে ওমরাহ বা ছুটির দিনগুলো সাজিয়ে দেব।
                </p>
              </div>
            </div>
            <button 
              onClick={() => scrollToId("booking")} 
              className="bg-brand-gold hover:bg-yellow-400 text-brand-blue font-bold px-6 py-3 rounded-lg text-sm transition-colors shrink-0 w-full md:w-auto text-center"
            >
              কাস্টম প্যাকেজ বুক করুন
            </button>
          </div>

        </div>
      </section>

      {/* INTERACTIVE SERVICE DETAIL MODAL COMPONENT */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-left relative flex flex-col">
            
            {/* Modal Header Cover Image */}
            <div className="relative h-44 md:h-52 w-full overflow-hidden">
              <img 
                src={selectedService.bgImage} 
                alt={selectedService.title} 
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950/20" />
              
              {/* Close Button on Image */}
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full border border-white/20 transition-colors"
                id="close-modal-btn"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-6 text-white pr-4">
                <span className="text-brand-gold text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-brand-purple rounded border border-brand-gold/30">
                  {selectedService.subtitle}
                </span>
                <h3 className="text-xl md:text-2xl font-bold mt-1.5 text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            {/* Modal Content Details */}
            <div className="p-6 md:p-8 flex-1">
              
              {/* Quick Details Bar */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">ভ্রমণ সময়কাল:</span>
                  <span className="font-semibold text-slate-800">{selectedService.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">মূল্য শুরু মাত্র:</span>
                  <span className="font-bold text-brand-purple">{selectedService.priceStart}</span>
                </div>
              </div>

              {/* Long Description */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-900 mb-2">সার্ভিস পরিচিতি:</h4>
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                  {selectedService.description}
                </p>
              </div>

              {/* Package Highlights Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Features (প্যাকেজের প্রধান আকর্ষণ) */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-brand-purple" />
                    প্যাকেজের প্রধান আকর্ষণসমূহ
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-light">
                    {selectedService.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-gold mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inclusions (প্যাকেজে যা যা থাকছে) */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                    <CheckCircle className="w-4.5 h-4.5 text-brand-purple" />
                    যা যা থাকছে এই সেবায়
                  </h4>
                  <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-light">
                    {selectedService.inclusions.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-brand-gold mt-0.5 shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-end items-center gap-3 rounded-b-2xl">
              <button 
                onClick={() => setSelectedService(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors text-center order-2 sm:order-1"
              >
                বন্ধ করুন
              </button>
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, service: selectedService.id }));
                  setSelectedService(null);
                  scrollToId("booking");
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold bg-brand-purple hover:bg-brand-blue text-white transition-colors text-center order-1 sm:order-2 shadow-lg shadow-brand-purple/10 flex items-center justify-center gap-1.5"
              >
                এই সার্ভিসটি বুক করুন
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. VALUE PROPOSITION SECTION (আমরা কেন সেরা) */}
      <section id="why-us" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-brand-gold bg-brand-gold/10 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-gold/20 uppercase tracking-widest mb-3">
              {config.whyUsBadge}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              {config.whyUsTitle}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-purple to-brand-gold rounded-full my-4" />
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
              {config.whyUsDesc}
            </p>
          </div>

          {/* Bullet points detailing why users choose Anaya - Checkmark List Grid styled similarly to reference */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valueProps.map((prop, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-brand-purple/30 transition-all duration-300 flex gap-4 text-left relative overflow-hidden group"
              >
                {/* Glow detail background */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-brand-gold/5 rounded-full blur-lg group-hover:bg-brand-gold/10 transition-colors" />

                {/* Left check circle indicator */}
                <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shrink-0 text-brand-gold">
                  <Check className="w-5 h-5 text-brand-gold-dark stroke-[3]" />
                </div>

                {/* Value Text */}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-brand-purple transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Core Trust Statistics Strip */}
          <div className="mt-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {(config.trustStats || [
              { value: "৩,৫০০+", label: "সফল ওমরাহ ও হজ যাত্রী" },
              { value: "৮+", label: "বছরের বিশ্বস্ত অভিজ্ঞতা" },
              { value: "১০০%", label: "আইনি লাইসেন্স ও অনুমোদন" },
              { value: "৯৮.৫%", label: "গ্রাহক সন্তুষ্টির রিভিউ" }
            ]).map((stat, idx) => (
              <div key={idx} className={idx > 0 ? "border-l border-slate-100" : ""}>
                <p className="text-3xl md:text-4xl font-black text-brand-purple">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. INTERACTIVE FAQ SECTION (প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী) */}
      <section id="faq" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-brand-purple bg-purple-50 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-purple/10 uppercase tracking-widest mb-3">
              {config.faqBadge}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              {config.faqTitle}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-purple to-brand-gold rounded-full my-4" />
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
              {config.faqDesc}
            </p>
          </div>

          {/* Accordion List */}
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${isOpen ? "border-brand-gold/60 bg-slate-50/50 shadow-md" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                >
                  {/* Accordion Question Bar */}
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-4.5 flex justify-between items-center gap-4 focus:outline-none focus:bg-slate-50"
                    id={`faq-btn-${idx}`}
                  >
                    <span className="font-bold text-slate-900 text-sm md:text-base pr-2 leading-relaxed">
                      {idx + 1}. {faq.q}
                    </span>
                    <span className={`p-1 rounded-full shrink-0 transition-transform duration-300 ${isOpen ? "bg-brand-gold/15 text-brand-gold-dark rotate-180" : "bg-slate-100 text-slate-500"}`}>
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>

                  {/* Accordion Answer Content */}
                  <div 
                    className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-60 border-t border-slate-100" : "max-h-0"}`}
                  >
                    <p className="px-6 py-4.5 text-xs md:text-sm text-slate-600 leading-relaxed font-light bg-white/80">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call support prompt if question not answered */}
          <div className="mt-16 bg-[#130f26] border border-white/5 rounded-[2rem] p-6 md:p-10 relative overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-center gap-6 text-left">
            {/* Background vector decoration */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-[0.04] pointer-events-none select-none z-0 hidden md:block">
              <svg className="w-full h-full text-white" viewBox="0 0 200 200" fill="currentColor">
                <path d="M100,20 C110,50 140,65 140,95 L140,200 L60,200 L60,95 C60,65 90,50 100,20 Z" />
                <rect x="96" y="5" width="8" height="20" />
              </svg>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10 w-full xl:w-auto text-center md:text-left">
              {/* Double ring headset icon container */}
              <div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center shrink-0 p-1 bg-white/5 shadow-inner">
                <div className="w-full h-full rounded-full border border-brand-gold/20 flex items-center justify-center bg-[#1c163a]">
                  <Headphones className="w-6 h-6 text-brand-gold animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                  যেকোনো তথ্য জানতে বা ওমরাহ পরামর্শের জন্য কথা বলুন
                </h4>
                <p className="text-slate-300 text-xs md:text-sm mt-2 font-light leading-relaxed max-w-2xl">
                  আমাদের অভিজ্ঞ ট্রাভেল কনসালটেন্ট টিম সম্পূর্ণ বিনামূল্যে আপনাকে প্যাকেজ ও ভিসা সংক্রান্ত তথ্য প্রদানে নিয়োজিত রয়েছে।
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 relative z-10 w-full xl:w-auto">
              <a 
                href={`tel:${getTelNumber(config.contactPhone)}`}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#130f26] font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-black/10 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#130f26]" />
                আমাদের কল দিন
              </a>
              <a 
                href={`https://wa.me/${getWhatsAppNumber(config.contactPhone)}`}
                target="_blank" 
                rel="noreferrer" 
                className="w-full sm:w-auto bg-[#00a859] hover:bg-[#00944e] text-white font-bold text-sm px-6 py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-[#00a859]/20 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                হোয়াটসঅ্যাপ মেসেজ করুন
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIAL SECTION (গ্রাহকদের মতামত) */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-brand-purple bg-purple-50 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full border border-brand-purple/10 uppercase tracking-widest mb-3">
              {config.testimonialsBadge}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-snug">
              {config.testimonialsTitle}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brand-purple to-brand-gold rounded-full my-4" />
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
              {config.testimonialsDesc}
            </p>
          </div>

          {/* Testimonial Carousel Block - horizontal scrolling carousel */}
          <div className="relative max-w-6xl mx-auto px-4 mt-8 group">
            
            {/* Left Button */}
            <button 
              onClick={scrollPrev}
              className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-800 hover:text-brand-purple p-2.5 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Button */}
            <button 
              onClick={scrollNext}
              className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-slate-800 hover:text-brand-purple p-2.5 rounded-full shadow-lg border border-slate-200 transition-all hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Scroll Wrapper */}
            <div 
              ref={testimonialContainerRef}
              onMouseEnter={() => setIsTestimonialPaused(true)}
              onMouseLeave={() => setIsTestimonialPaused(false)}
              onTouchStart={() => setIsTestimonialPaused(true)}
              onTouchEnd={handleTouchEnd}
              className="flex gap-6 overflow-x-auto scrollbar-none py-6 px-2 select-none scroll-smooth snap-x snap-mandatory"
            >
              {[...config.testimonials, ...config.testimonials, ...config.testimonials].map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 snap-center"
                >
                  
                  {/* Gold Quote Overlay Mark */}
                  <div className="absolute top-6 right-8 text-6xl text-brand-gold/10 font-serif leading-none select-none pointer-events-none">
                    “
                  </div>

                  <div>
                    {/* Gold Stars */}
                    <div className="flex text-brand-gold gap-1 mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6 font-light">
                      &quot;{t.text}&quot;
                    </p>
                  </div>

                  {/* Reviewer Meta Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center font-bold text-brand-purple shrink-0 text-sm border border-brand-purple/15">
                      {t.avatarInitials || (t.name ? t.name.split(" ").map(w => w[0]).join("").slice(0, 2) : "GR")}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-950 text-sm">{t.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{t.role}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Verified Customer Badge below testimonials */}
          <div className="mt-12 flex justify-center items-center gap-2 text-slate-500 text-xs md:text-sm">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span>উপরে উল্লিখিত প্রতিটি রিভিউ আমাদের প্রকৃত ভ্রমণকারী ও ওমরাহ পালনকারীদের দ্বারা সংগৃহীত।</span>
          </div>

        </div>
      </section>

      {/* 6. DIRECT BOOKING / LEAD CAPTURE FORM (আর দেরি না করে এখনই বুক করুন) */}
      <section id="booking" className="py-20 bg-brand-blue text-white relative overflow-hidden">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-purple/95 to-brand-blue/95" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 text-left flex flex-col gap-6">
              <span className="text-brand-gold text-xs md:text-sm font-semibold uppercase tracking-widest bg-white/5 border border-brand-gold/30 px-4 py-1.5 rounded-full w-fit">
                {config.bookingBadge}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-snug">
                {config.bookingTitle}
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-light">
                {config.bookingDesc}
              </p>

              {/* Mini Check Indicators */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                  </span>
                  <span className="text-xs md:text-sm text-slate-200">কোনো বুকিং ফি ছাড়াই প্রাথমিক সাবমিশন</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                  </span>
                  <span className="text-xs md:text-sm text-slate-200">১৫ মিনিটের মধ্যে দ্রুততম ফিরতি কল সুবিধা</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-brand-gold" />
                  </span>
                  <span className="text-xs md:text-sm text-slate-200">১০০% ডেটা প্রাইভেসী ও তথ্যের নিরাপত্তা</span>
                </div>
              </div>

              {/* Direct Urgent Assistance Contact Card */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mt-4 text-left flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center shrink-0 text-brand-gold">
                  <Phone className="w-6 h-6 text-brand-gold" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400">যেকোনো জরুরি প্রয়োজনে কল করুন</p>
                  <p className="text-lg font-bold text-white tracking-wider">{config.contactPhone}</p>
                  <p className="text-[11px] text-slate-300">সার্বক্ষণিক ওমরাহ হেল্পলাইন টিম</p>
                </div>
              </div>

            </div>

            {/* Right Booking / Lead Capture Box (replicates neat layout inspired by reference) */}
            <div className="lg:col-span-7 w-full" id="booking-form-box">
              <div className="bg-white text-slate-850 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-2xl relative">
                
                {/* Accent top gold border bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-purple via-brand-gold to-brand-purple rounded-t-2xl" />

                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                    
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        বুকিং অনুসন্ধান ফর্ম
                      </h3>
                      <p className="text-xs text-slate-500 font-light mt-1">
                        নিচের তথ্যগুলো দিয়ে সাবমিট সম্পন্ন করুন। আমাদের রিলেশনশিপ ম্যানেজার খুব দ্রুত যোগাযোগ করবেন।
                      </p>
                    </div>

                    {/* Full Name field */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="fullName" className="text-xs md:text-sm font-bold text-slate-700 flex items-center gap-1">
                        আপনার পুরো নাম <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="fullName"
                          name="fullName"
                          placeholder="যেমন: মোহাম্মদ আব্দুল্লাহ"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-50 border p-3 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${errors.fullName ? "border-red-500 focus:ring-red-500/20" : "border-slate-300 focus:border-brand-purple focus:ring-brand-purple/20"}`}
                        />
                      </div>
                      {errors.fullName && <span className="text-xs text-red-500 mt-0.5">{errors.fullName}</span>}
                    </div>

                    {/* Phone and Selected Service Row */}
                    <div className="grid md:grid-cols-2 gap-4">
                      
                      {/* Mobile Number field */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="phone" className="text-xs md:text-sm font-bold text-slate-700">
                          মোবাইল নম্বর <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel" 
                          id="phone"
                          name="phone"
                          placeholder="যেমন: 017XXXXXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-50 border p-3 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${errors.phone ? "border-red-500 focus:ring-red-500/20" : "border-slate-300 focus:border-brand-purple focus:ring-brand-purple/20"}`}
                        />
                        {errors.phone ? (
                          <span className="text-xs text-red-500 mt-0.5">{errors.phone}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">এই নম্বরেই আমরা ফোন করব।</span>
                        )}
                      </div>

                      {/* Selected Service field */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="service" className="text-xs md:text-sm font-bold text-slate-700">
                          পছন্দসই সার্ভিস নির্বাচন করুন <span className="text-red-500">*</span>
                        </label>
                        <select 
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className={`w-full bg-slate-50 border p-3 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${errors.service ? "border-red-500 focus:ring-red-500/20" : "border-slate-300 focus:border-brand-purple focus:ring-brand-purple/20"}`}
                        >
                          <option value="">নির্বাচন করুন...</option>
                          {config.services.map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                        </select>
                        {errors.service && <span className="text-xs text-red-500 mt-0.5">{errors.service}</span>}
                      </div>

                    </div>

                    {/* Travelers Count Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="travelers" className="text-xs md:text-sm font-bold text-slate-700">
                        যাত্রীর সংখ্যা (অনুমিত)
                      </label>
                      <select 
                        id="travelers"
                        name="travelers"
                        value={formData.travelers}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-300 p-3 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                      >
                        <option value="1">১ জন</option>
                        <option value="2">২ জন</option>
                        <option value="3">৩ জন</option>
                        <option value="4">৪ জন</option>
                        <option value="5+">৫ জনের বেশি (গ্রুপ)</option>
                      </select>
                    </div>

                    {/* Special requests textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="specialRequests" className="text-xs md:text-sm font-bold text-slate-700">
                        বিশেষ কোনো অনুরোধ বা বিবরণ (ঐচ্ছিক)
                      </label>
                      <textarea 
                        id="specialRequests"
                        name="specialRequests"
                        rows={3}
                        placeholder="যেমন: হোটেল কত কাছে চান বা বাজেট সংক্রান্ত বিবরণী..."
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border border-slate-300 p-3 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                      />
                    </div>

                    {/* Submission CTA - Large prominent button */}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-blue hover:to-brand-purple text-white font-bold text-base py-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 text-center flex items-center justify-center gap-2.5 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      id="submit-booking-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          প্রসেস হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
                        </>
                      ) : (
                        <>
                          আপনার বুকিং সম্পন্ন করুন
                          <Send className="w-5 h-5 text-white" />
                        </>
                      )}
                    </button>

                  </form>
                ) : (
                  
                  /* SUBMISSION SUCCESS RECEIPT CARD (High-Converting Detail screen) */
                  <div className="text-center py-6 flex flex-col items-center gap-5 text-slate-800 animate-scale-up">
                    
                    {/* Glowing Success Checkmark Icon */}
                    <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-500 shadow-md">
                      <CheckCircle className="w-10 h-10 text-green-500 fill-green-50" />
                    </div>

                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900">
                        আলহামদুলিল্লাহ! আপনার বুকিং আবেদনটি জমা হয়েছে
                      </h3>
                      <p className="text-xs md:text-sm text-slate-500 font-light mt-2 max-w-md mx-auto leading-relaxed">
                        ধন্যবাদ <span className="font-bold text-brand-purple">{formData.fullName}</span>, আমাদের কাছে আপনার অনুরোধটি সঠিকভাবে পৌঁছেছে। পরবর্তী ১৫ মিনিটের মধ্যে আমাদের বুকিং এক্সপার্ট টিম নিচে দেওয়া নম্বরে সরাসরি যোগাযোগ করবেন।
                      </p>
                    </div>

                    {/* Simulated Receipt Details */}
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs md:text-sm flex flex-col gap-2.5">
                      <div className="pb-2 border-b border-slate-200 flex justify-between items-center text-slate-550">
                        <span className="font-medium text-[10px] uppercase tracking-wider">রসিদ বিবরণ:</span>
                        <span className="font-bold text-brand-gold-dark">বুকিং আইডি: #ANB{Math.floor(1000 + Math.random() * 9000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">আবেদনকারীর নাম:</span>
                        <span className="font-semibold text-slate-800">{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">মোবাইল নম্বর:</span>
                        <span className="font-semibold text-slate-800 tracking-wider">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">নির্বাচিত সার্ভিস:</span>
                        <span className="font-semibold text-slate-800">
                          {formData.service === "umrah" && "পবিত্র ওমরাহ প্যাকেজ"}
                          {formData.service === "hajj" && "পবিত্র হজ প্যাকেজ"}
                          {formData.service === "visa" && "ভিসা প্রসেসিং সার্ভিস"}
                          {formData.service === "tours" && "গ্লোবাল হলিডে ট্যুর"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">যাত্রীর সংখ্যা:</span>
                        <span className="font-semibold text-slate-800">{formData.travelers} জন</span>
                      </div>
                    </div>

                    {/* Instant Action CTA Buttons to speed up conversion */}
                    <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
                      
                      <a 
                        href={`https://wa.me/${getWhatsAppNumber(config.contactWhatsApp)}?text=${encodeURIComponent(
                          `আসসালামু আলাইকুম, আনায়া ট্যুরস এন্ড ট্রাভেলস! 😊\n\n` +
                          `আমি আপনাদের ওয়েবসাইট থেকে একটি বুকিং আবেদন পাঠিয়েছি। আমার বিবরণ নিচে দেওয়া হলো:\n\n` +
                          `👤 *নাম:* ${formData.fullName}\n` +
                          `📞 *মোবাইল:* ${formData.phone}\n` +
                          `🕋 *নির্বাচিত সার্ভিস:* ${
                            formData.service === "umrah" ? "পবিত্র ওমরাহ প্যাকেজ" :
                            formData.service === "hajj" ? "পবিত্র হজ প্যাকেজ" :
                            formData.service === "visa" ? "ভিসা প্রসেসিং সার্ভিস" :
                            formData.service === "tours" ? "গ্লোবাল হলিডে ট্যুর" :
                            config.services.find(s => s.id === formData.service)?.title || formData.service
                          }\n` +
                          `👥 *যাত্রীর সংখ্যা:* ${formData.travelers} জন\n` +
                          `📝 *বিশেষ অনুরোধ বা প্রশ্ন:* ${formData.specialRequests.trim() || "নেই"}\n\n` +
                          `দয়া করে আমার বুকিংটি চেক করে পরবর্তী তথ্য জানিয়ে সাহায্য করুন। ধন্যবাদ! 🙏`
                        )}`}
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs md:text-sm py-3.5 rounded-xl transition-all shadow-md text-center flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <MessageSquare className="w-5 h-5 text-white" />
                        হোয়াটসঅ্যাপে সরাসরি যোগাযোগ করুন
                      </a>

                      <button 
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ fullName: "", phone: "", service: "", travelers: "1", specialRequests: "" });
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs py-3.5 px-6 rounded-xl transition-all text-center"
                      >
                        আরেকটি বুকিং করুন
                      </button>

                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>
        </>
      ) : currentPage === "privacy" ? (
        <PrivacyPage 
          onBack={() => { setCurrentPage("home"); window.scrollTo(0, 0); }}
          siteName={config.siteName}
          siteNameEn={config.siteNameEn}
          contactEmail={config.contactEmail}
          contactPhone={config.contactPhone}
        />
      ) : (
        <TermsPage 
          onBack={() => { setCurrentPage("home"); window.scrollTo(0, 0); }}
          siteName={config.siteName}
          siteNameEn={config.siteNameEn}
          contactEmail={config.contactEmail}
          contactPhone={config.contactPhone}
        />
      )}

      {/* FOOTER SECTION */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-24 md:pb-12 border-t border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 lg:grid-cols-4 gap-10 text-left">
          
          {/* Logo & Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              {config.siteLogoType === "image" && config.siteLogo ? (
                <div className="w-10 h-10 rounded-xl bg-slate-950/40 overflow-hidden flex items-center justify-center border border-slate-800 shadow-lg shrink-0">
                  <img src={config.siteLogo} alt={config.siteName} className="w-full h-full object-contain p-1" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center shrink-0">
                  <Compass className="w-6 h-6 text-brand-purple" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight leading-none">
                  {config.siteName.split(" ")[0]} <span className="text-brand-gold">{config.siteName.split(" ").slice(1).join(" ")}</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-light">{config.siteNameEn}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed font-light mt-2">
              {config.footerDesc}
            </p>
          </div>

          {/* Quick Links & Services Side-by-Side on Mobile, separate columns on Desktop */}
          <div className="grid grid-cols-2 md:contents gap-6 col-span-1 md:col-span-2">
            {/* Quick Links */}
            <div className="flex flex-col gap-4 lg:pl-10 text-left">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider">দ্রুত লিংকসমূহ</h5>
              <ul className="flex flex-col gap-2.5 text-xs font-light">
                <li>
                  <button onClick={() => { setCurrentPage("home"); setTimeout(() => scrollToId("hero"), 50); }} className="hover:text-brand-gold transition-colors text-left cursor-pointer">মূল পাতা</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage("home"); setTimeout(() => scrollToId("services"), 50); }} className="hover:text-brand-gold transition-colors text-left cursor-pointer">আমাদের সেবাসমূহ</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage("home"); setTimeout(() => scrollToId("why-us"), 50); }} className="hover:text-brand-gold transition-colors text-left cursor-pointer">আমরা কেন সেরা</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage("home"); setTimeout(() => scrollToId("faq"), 50); }} className="hover:text-brand-gold transition-colors text-left cursor-pointer">জিজ্ঞাসিত প্রশ্নাবলী</button>
                </li>
                <li>
                  <button onClick={() => { setCurrentPage("home"); setTimeout(() => scrollToId("testimonials"), 50); }} className="hover:text-brand-gold transition-colors text-left cursor-pointer">গ্রাহকদের মতামত</button>
                </li>
              </ul>
            </div>

            {/* Our Key Services Links */}
            <div className="flex flex-col gap-4 text-left">
              <h5 className="text-sm font-bold text-white uppercase tracking-wider">আমাদের সেবাসমূহ</h5>
              <ul className="flex flex-col gap-2.5 text-xs font-light">
                {services.map((s, idx) => (
                  <li key={s.id || idx}>
                    <button onClick={() => { setCurrentPage("home"); setSelectedService(s); }} className="hover:text-brand-gold transition-colors text-left cursor-pointer">
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Address & Contact Info - Centered on Mobile, Left-aligned on Desktop */}
          <div className="flex flex-col gap-4 items-center text-center md:items-start md:text-left">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">যোগাযোগের ঠিকানা</h5>
            <div className="flex flex-col gap-3 text-xs font-light items-center md:items-start">
              <span className="flex items-start gap-2 text-center md:text-left justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{config.officeAddress}</span>
              </span>
              <span className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`tel:${getTelNumber(config.contactPhone)}`} className="hover:text-brand-gold transition-colors">{config.contactPhone}</a>
              </span>
              <span className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={`mailto:${config.contactEmail}`} className="hover:text-brand-gold transition-colors">{config.contactEmail}</a>
              </span>
            </div>
          </div>

        </div>

        {/* Subtle Administrative Login Row right in the footer */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-10 pt-6 border-t border-slate-800/60 flex flex-col items-center">
          <details className="w-full max-w-sm group bg-slate-950/20 hover:bg-slate-950/35 border border-slate-800/80 rounded-xl p-3.5 transition-all duration-300">
            <summary className="text-xs font-semibold text-slate-500 hover:text-brand-gold cursor-pointer list-none flex items-center justify-center gap-2 select-none">
              <Lock className="w-3.5 h-3.5" />
              <span>ওয়েবসাইট কাস্টমাইজেশন (অ্যাডমিন লগইন)</span>
              <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform duration-200" />
            </summary>
            
            <form onSubmit={handleAdminLogin} className="mt-4 flex flex-col gap-3 text-left">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">ইউজারনেম</label>
                  <input 
                    type="text" 
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="যেমন: admin"
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400 font-medium">পাসওয়ার্ড</label>
                  <input 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
              
              {loginError && (
                <p className="text-[10px] text-red-400 font-light mt-0.5">{loginError}</p>
              )}
              
              <button 
                type="submit"
                className="w-full bg-brand-gold hover:bg-yellow-500 text-brand-purple font-bold text-xs py-2 rounded transition-colors"
              >
                প্যানেলে প্রবেশ করুন
              </button>
            </form>
          </details>
        </div>

        {/* Copywrite Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 pt-6 border-t border-slate-800/50 text-center text-xs flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-light">
            © {new Date().getFullYear()} {config.siteName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-slate-500 font-light">
            <button 
              onClick={() => { setCurrentPage("privacy"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
              className="hover:text-brand-gold transition-colors cursor-pointer"
            >
              প্রাইভেসি পলিসি
            </button>
            <span>•</span>
            <button 
              onClick={() => { setCurrentPage("terms"); window.scrollTo({ top: 0, behavior: "smooth" }); }} 
              className="hover:text-brand-gold transition-colors cursor-pointer"
            >
              শর্তাবলী
            </button>
          </div>
        </div>
      </footer>

      {/* FLOATING ACTION BOTTOM STICKY BAR FOR MOBILE DEVICES - Extremely high-converting */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.08)]">
        
        {/* Telephone Call Now Button */}
        <a 
          href={`tel:${getTelNumber(config.contactPhone)}`} 
          className="flex-1 bg-brand-blue hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-lg text-center flex items-center justify-center gap-2 shadow"
        >
          <Phone className="w-4 h-4 text-brand-gold fill-brand-gold" />
          ফোন করুন
        </a>

        {/* WhatsApp Chat Button */}
        <a 
          href={`https://wa.me/${getWhatsAppNumber(config.contactWhatsApp)}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি ${config.siteName} ওয়েবসাইট থেকে পবিত্র উমরাহ ও ভ্রমণ প্যাকেজ সম্পর্কে জানতে চাচ্ছি।`)}`} 
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-3 rounded-lg text-center flex items-center justify-center gap-2 shadow"
        >
          <MessageSquare className="w-4.5 h-4.5" />
          হোয়াটসঅ্যাপ চ্যাট
        </a>

        {/* Scroll to Book package sticky shortcut */}
        <button 
          onClick={() => scrollToId("booking")} 
          className="bg-brand-gold text-brand-blue font-bold text-xs px-4 py-3 rounded-lg shadow border border-brand-gold-dark/20"
        >
          বুকিং ফর্ম
        </button>

      </div>

    </div>
  );
}
