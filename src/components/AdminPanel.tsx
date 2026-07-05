import React, { useState } from "react";
import { 
  SiteConfig, 
  ServiceDetail, 
  ValueProp, 
  FaqItem, 
  TestimonialItem,
  defaultSiteConfig
} from "../defaultConfig";
import { 
  Save, 
  LogOut, 
  RotateCcw, 
  Settings, 
  Layers, 
  HelpCircle, 
  Heart, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Globe,
  Star,
  Check,
  CheckCircle,
  AlertCircle,
  Lock,
  Sparkles,
  Image
} from "lucide-react";

interface AdminPanelProps {
  config: SiteConfig;
  onSave: (newConfig: SiteConfig) => void;
  onExit: () => void;
}

type TabType = "general" | "branding" | "hero" | "services" | "whyus" | "faq" | "testimonials" | "security";

export default function AdminPanel({ config, onSave, onExit }: AdminPanelProps) {
  const [currentConfig, setCurrentConfig] = useState<SiteConfig>(() => {
    // deep clone to avoid modifying original prop directly until saved
    return JSON.parse(JSON.stringify(config));
  });
  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  
  const handleSave = () => {
    onSave(currentConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm("আপনি কি নিশ্চিত যে সমস্ত কাস্টমাইজেশন মুছে দিয়ে ডিফল্ট ডিজাইনে ফিরে যেতে চান?")) {
      setCurrentConfig(JSON.parse(JSON.stringify(defaultSiteConfig)));
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "anaya_tours_config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          // Simple validation check
          if (parsed.siteName && parsed.services && parsed.faqs) {
            setCurrentConfig(parsed);
            alert("কনফিগারেশন ফাইল সফলভাবে লোড করা হয়েছে! পরিবর্তনগুলো সেভ করতে নিচে 'সেভ করুন' বাটনে ক্লিক করুন।");
          } else {
            alert("ভুল ফাইল ফরম্যাট! দয়া করে সঠিক কনফিগারেশন JSON ফাইল আপলোড করুন।");
          }
        } catch (err) {
          alert("ফাইলটি পার্স করতে ব্যর্থ হয়েছে! সঠিক JSON ফাইল আপলোড করুন।");
        }
      };
    }
  };

  // Helper to update top-level field
  const updateField = (key: keyof SiteConfig, value: any) => {
    setCurrentConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Helper to handle client-side image uploading to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof SiteConfig) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("সতর্কতা: আপনার ফাইলটি ৩MB এর বেশি সাইজের। পারফরম্যান্সের সুবিধার্থে ৩MB এর নিচের বা কম্প্রেস করা ছবি ব্যবহার করার অনুরোধ রইল।");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateField(fieldName, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to update nested service field
  const updateServiceField = (index: number, key: keyof ServiceDetail, value: any) => {
    setCurrentConfig(prev => {
      const services = [...prev.services];
      services[index] = { ...services[index], [key]: value };
      return { ...prev, services };
    });
  };

  // Helper to update nested service arrays (features/inclusions)
  const updateServiceArrayItem = (serviceIndex: number, arrayKey: "features" | "inclusions", itemIndex: number, value: string) => {
    setCurrentConfig(prev => {
      const services = [...prev.services];
      const arr = [...services[serviceIndex][arrayKey]];
      arr[itemIndex] = value;
      services[serviceIndex] = { ...services[serviceIndex], [arrayKey]: arr };
      return { ...prev, services };
    });
  };

  const addServiceArrayItem = (serviceIndex: number, arrayKey: "features" | "inclusions") => {
    setCurrentConfig(prev => {
      const services = [...prev.services];
      const arr = [...services[serviceIndex][arrayKey], "নতুন আইটেম লিখুন"];
      services[serviceIndex] = { ...services[serviceIndex], [arrayKey]: arr };
      return { ...prev, services };
    });
  };

  const removeServiceArrayItem = (serviceIndex: number, arrayKey: "features" | "inclusions", itemIndex: number) => {
    setCurrentConfig(prev => {
      const services = [...prev.services];
      const arr = services[serviceIndex][arrayKey].filter((_, i) => i !== itemIndex);
      services[serviceIndex] = { ...services[serviceIndex], [arrayKey]: arr };
      return { ...prev, services };
    });
  };

  const addNewService = () => {
    setCurrentConfig(prev => {
      const newId = `service-${Date.now()}`;
      const newService: ServiceDetail = {
        id: newId,
        title: "নতুন ওমরাহ বা ভ্রমণ প্যাকেজ",
        subtitle: "৭ রাত মক্কা ও ৭ রাত মদিনা",
        duration: "১৪ দিন",
        priceStart: "১,১৫,০০০ টাকা",
        description: "পবিত্র ওমরাহ পালনের জন্য একটি চমৎকার প্যাকেজ সুবিধা।",
        features: [
          "৩ তারকা হোটেল সুবিধা",
          "সৌদি ওমরাহ ভিসা",
          "অভিজ্ঞ গাইড ও গ্রুপ লিডার"
        ],
        inclusions: [
          "ঢাকা-জেদ্দা বিমান টিকিট",
          "মক্কা ও মদিনায় যাতায়াত ট্রান্সপোর্ট",
          "জিয়ারাহ বা ঐতিহাসিক স্থান দর্শন"
        ],
        bgImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800"
      };
      return {
        ...prev,
        services: [...prev.services, newService]
      };
    });
  };

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>, serviceIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("সতর্কতা: আপনার ফাইলটি ৩MB এর বেশি সাইজের। পারফরম্যান্সের সুবিধার্থে ৩MB এর নিচের বা কম্প্রেস করা ছবি ব্যবহার করার অনুরোধ রইল।");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateServiceField(serviceIndex, "bgImage", reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeService = (index: number) => {
    setCurrentConfig(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
    setDeletingIndex(null);
  };

  // Helper to update nested value props
  const updateValueProp = (index: number, key: keyof ValueProp, value: string) => {
    setCurrentConfig(prev => {
      const valueProps = [...prev.valueProps];
      valueProps[index] = { ...valueProps[index], [key]: value };
      return { ...prev, valueProps };
    });
  };

  // Helper to update nested trust statistics
  const updateTrustStat = (index: number, key: 'value' | 'label', value: string) => {
    setCurrentConfig(prev => {
      const trustStats = prev.trustStats ? [...prev.trustStats] : [
        { value: "৩,৫০০+", label: "সফল ওমরাহ ও হজ যাত্রী" },
        { value: "৮+", label: "বছরের বিশ্বস্ত অভিজ্ঞতা" },
        { value: "১০০%", label: "আইনি লাইসেন্স ও অনুমোদন" },
        { value: "৯৮.৫%", label: "গ্রাহক সন্তুষ্টির রিভিউ" }
      ];
      trustStats[index] = { ...trustStats[index], [key]: value };
      return { ...prev, trustStats };
    });
  };

  // Helper to update nested FAQs
  const updateFaq = (index: number, key: keyof FaqItem, value: string) => {
    setCurrentConfig(prev => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], [key]: value };
      return { ...prev, faqs };
    });
  };

  const addNewFaq = () => {
    setCurrentConfig(prev => ({
      ...prev,
      faqs: [...prev.faqs, { q: "নতুন প্রশ্ন লিখুন", a: "নতুন উত্তর লিখুন" }]
    }));
  };

  const removeFaq = (index: number) => {
    setCurrentConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  // Helper to update testimonials
  const updateTestimonial = (index: number, key: keyof TestimonialItem, value: any) => {
    setCurrentConfig(prev => {
      const testimonials = [...prev.testimonials];
      testimonials[index] = { ...testimonials[index], [key]: value };
      return { ...prev, testimonials };
    });
  };

  return (
    <div id="admin-panel-root" className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-gold to-yellow-500 flex items-center justify-center shadow-lg shadow-brand-gold/10">
            <Settings className="w-6 h-6 text-brand-purple animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none">
              আনায়া <span className="text-brand-gold">অ্যাডমিন ড্যাশবোর্ড</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wide">Live Landing Page Customization Engine</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 w-full sm:flex sm:items-center sm:gap-3 sm:w-auto">
          <button 
            onClick={handleReset}
            className="bg-red-950/40 hover:bg-red-950/80 text-red-400 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-red-900/30 cursor-pointer w-full sm:w-auto"
            title="ডিফল্ট কনফিগারেশন রিস্টোর করুন"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>ডিফল্ট</span>
          </button>

          <button 
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 cursor-pointer w-full sm:w-auto"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>সেভ করুন</span>
          </button>

          <button 
            onClick={onExit}
            className="bg-brand-purple hover:bg-brand-purple-light text-brand-gold text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 border border-brand-gold/20 cursor-pointer w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>লাইভ সাইট</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Tabbed Sidebar Switcher */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse shadow-[0_0_8px_rgba(212,163,89,0.6)]" />
              <span className="text-brand-gold text-xs font-bold uppercase tracking-wider">সেকশন নির্বাচন করুন</span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium lg:hidden bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">বামে-ডানে স্ক্রোল করুন ↔</span>
          </div>
          
          <div className="bg-slate-900/80 p-2 md:p-3 rounded-2xl border border-brand-purple/20 shadow-xl shadow-black/30 lg:bg-transparent lg:p-0 lg:border-none lg:shadow-none w-full">
            <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none w-full">
              <button 
                onClick={() => setActiveTab("general")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "general" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Globe className="w-4 h-4 shrink-0" />
                <span>ড্যাশবোর্ড ও সাধারণ তথ্য</span>
              </button>

              <button 
                onClick={() => setActiveTab("branding")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "branding" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Image className="w-4 h-4 shrink-0 text-brand-gold" />
                <span>নাম ও লোগো সেটআপ</span>
              </button>

              <button 
                onClick={() => setActiveTab("hero")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "hero" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>হিরো ও ওমরাহ ব্যানার</span>
              </button>

              <button 
                onClick={() => setActiveTab("services")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "services" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                <span>সেবাসমূহ ও প্যাকেজ</span>
              </button>

              <button 
                onClick={() => setActiveTab("whyus")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "whyus" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>আমরা কেন সেরা</span>
              </button>

              <button 
                onClick={() => setActiveTab("faq")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "faq" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>জিজ্ঞাসিত প্রশ্নাবলী</span>
              </button>

              <button 
                onClick={() => setActiveTab("testimonials")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "testimonials" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>কাস্টমার রিভিউ</span>
              </button>

              <button 
                onClick={() => setActiveTab("security")}
                className={`shrink-0 whitespace-nowrap px-4 py-3 rounded-xl flex items-center gap-2.5 transition-all cursor-pointer text-xs md:text-sm ${
                  activeTab === "security" 
                    ? "bg-gradient-to-r from-brand-gold to-amber-500 text-slate-950 font-extrabold shadow-lg shadow-brand-gold/25 scale-[1.02] border border-brand-gold/30" 
                    : "text-slate-300 bg-slate-950/80 border border-slate-800/80 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>অ্যাক্সেস ও নিরাপত্তা</span>
              </button>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="mt-8 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex flex-col gap-2 hidden lg:flex">
            <div className="flex items-center gap-2 text-brand-gold font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>সহজ নির্দেশনা</span>
            </div>
            <p className="leading-relaxed">
              এই ড্যাশবোর্ড থেকে আপনি পুরো ওয়েবসাইটের প্রতিটি সিঙ্গেল লেখাও পরিবর্তন করতে পারবেন।
            </p>
            <p className="leading-relaxed font-semibold text-emerald-400">
              লেখার পরিবর্তন শেষে উপরে ডানদিকের সবুজ <span className="underline">'সেভ করুন'</span> বাটনে ক্লিক করতে ভুলবেন না।
            </p>
          </div>
        </aside>

        {/* Right Working Form Workspace */}
        <main className="flex-1 bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
          
          {/* Top Success Alert Bar */}
          {saveSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 text-sm animate-fade-in">
              <Check className="w-5 h-5 shrink-0 bg-emerald-500 text-slate-950 rounded-full p-0.5" />
              <span>অভিনন্দন! আপনার পরিবর্তনসমূহ সফলভাবে রিয়েল-টাইম সেভ করা হয়েছে এবং লাইভ সাইটে আপডেট করা হয়েছে।</span>
            </div>
          )}

          {/* TAB 1: GENERAL CONTROLS */}
          {activeTab === "general" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">যোগাযোগ ও সাধারণ তথ্য কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">এজেন্সির নাম, যোগাযোগের তথ্য ও সোশ্যাল মিডিয়া প্রোফাইল আপডেট করুন।</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">এজেন্সির নাম (বাংলা)</label>
                  <input 
                    type="text" 
                    value={currentConfig.siteName} 
                    onChange={e => updateField("siteName", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">এজেন্সির নাম (English)</label>
                  <input 
                    type="text" 
                    value={currentConfig.siteNameEn} 
                    onChange={e => updateField("siteNameEn", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">যোগাযোগের মোবাইল নাম্বার</label>
                  <input 
                    type="text" 
                    value={currentConfig.contactPhone} 
                    onChange={e => updateField("contactPhone", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">যোগাযোগের ইমেইল অ্যাড্রেস</label>
                  <input 
                    type="email" 
                    value={currentConfig.contactEmail} 
                    onChange={e => updateField("contactEmail", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">হোয়াটসঅ্যাপ নাম্বার (Country Code সহ, যেমন: +8801700000000)</label>
                  <input 
                    type="text" 
                    value={currentConfig.contactWhatsApp} 
                    onChange={e => updateField("contactWhatsApp", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">ফেসবুক পেজ লিংক</label>
                  <input 
                    type="text" 
                    value={currentConfig.facebookUrl} 
                    onChange={e => updateField("facebookUrl", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300">অফিসের ঠিকানা</label>
                <textarea 
                  rows={2}
                  value={currentConfig.officeAddress} 
                  onChange={e => updateField("officeAddress", e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-300">ফুটার বর্ণনা</label>
                <textarea 
                  rows={2}
                  value={currentConfig.footerDesc} 
                  onChange={e => updateField("footerDesc", e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>
          )}

          {/* TAB: BRANDING CONTROLS */}
          {activeTab === "branding" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">ওয়েবসাইটের নাম ও লোগো কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">আপনার এজেন্সির নাম (বাংলা ও ইংরেজী) এবং লোগো পরিবর্তন করুন।</p>
              </div>

              {/* Agency Names */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-gold flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  এজেন্সির নাম সেটআপ
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">এজেন্সির নাম (বাংলা)</label>
                    <input 
                      type="text" 
                      value={currentConfig.siteName} 
                      onChange={e => updateField("siteName", e.target.value)}
                      placeholder="যেমন: আনায়া ট্যুরস এন্ড ট্রাভেলস"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                    <span className="text-[10px] text-slate-400">প্রথম শব্দটি সাদা এবং পরের শব্দগুলো সোনালী রঙে দেখাবে।</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">এজেন্সির নাম (English)</label>
                    <input 
                      type="text" 
                      value={currentConfig.siteNameEn} 
                      onChange={e => updateField("siteNameEn", e.target.value)}
                      placeholder="যেমন: Anaya Tours & Travels"
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                    <span className="text-[10px] text-slate-400">লোগোর নিচে ইংরেজি নাম হিসেবে প্রদর্শিত হবে।</span>
                  </div>
                </div>
              </div>

              {/* Logo Settings */}
              <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-gold flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  লোগো সেটিংস
                </h3>
                
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-semibold text-slate-300">লোগো হিসেবে কী প্রদর্শন করতে চান?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="radio" 
                        name="siteLogoType" 
                        value="icon" 
                        checked={currentConfig.siteLogoType === "icon" || !currentConfig.siteLogoType} 
                        onChange={() => updateField("siteLogoType", "icon")}
                        className="accent-brand-gold h-4 w-4"
                      />
                      <span>কম্পাস আইকন (ডিফল্ট)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input 
                        type="radio" 
                        name="siteLogoType" 
                        value="image" 
                        checked={currentConfig.siteLogoType === "image"} 
                        onChange={() => updateField("siteLogoType", "image")}
                        className="accent-brand-gold h-4 w-4"
                      />
                      <span>কাস্টম লোগো ছবি</span>
                    </label>
                  </div>
                </div>

                {(currentConfig.siteLogoType === "image") && (
                  <div className="flex flex-col gap-2.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 mt-2 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-brand-gold" />
                        লোগো ইমেজ ফাইল বা লিংক (Logo URL or Upload)
                      </label>
                      <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">লোগো ইমেজ লিংক দিন বা কম্পিউটার থেকে আপলোড করুন</span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={currentConfig.siteLogo || ""} 
                            onChange={e => updateField("siteLogo", e.target.value)}
                            placeholder="লোগো ইমেজ ইউআরএল (যেমন: https://...)"
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                          />
                          <label className="bg-brand-gold/10 hover:bg-brand-gold/20 hover:border-brand-gold/40 border border-brand-gold/20 hover:border-brand-gold/40 rounded-lg px-3.5 py-2 text-xs text-brand-gold font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>আপলোড করুন</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => handleImageUpload(e, "siteLogo")} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                        <p className="text-[10px] text-slate-500">টিপস: পারফেক্ট দেখানোর জন্য পিএনজি (PNG) বা ট্রান্সপারেন্ট ব্যাকগ্রাউন্ড লোগো ব্যবহার করুন। ফাইল সাইজ ৩MB এর নিচে হতে হবে।</p>
                      </div>

                      {/* Live Preview Frame */}
                      <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative group shrink-0 self-center md:self-start">
                        {currentConfig.siteLogo ? (
                          <>
                            <img 
                              src={currentConfig.siteLogo} 
                              alt="Logo Preview" 
                              className="w-full h-full object-contain p-2"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                              প্রিভিউ
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2 flex flex-col items-center justify-center text-slate-500">
                            <Image className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-medium">লোগো নেই</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HERO & CAMPAIGN CONTROLS */}
          {activeTab === "hero" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">হিরো ব্যানার ও স্পেশাল ওমরাহ ক্যাম্পেইন কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">ওয়েবসাইটের মূল ব্যানার এবং ডানের বিশেষ সিলভার ওমরাহ ক্যাম্পেইন কার্ডের তথ্য পরিবর্তন করুন।</p>
              </div>

              <div className="border-b border-slate-800 pb-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-gold">১. হিরো সেকশন তথ্য</h3>
                
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">হিরো টপ ব্যাজ লেখা</label>
                  <input 
                    type="text" 
                    value={currentConfig.heroBadge} 
                    onChange={e => updateField("heroBadge", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 my-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                    <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">শিরোনামের লেখা ও কালার কাস্টমাইজেশন (সহজ পদ্ধতি)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    এখানে তিনটি অংশে আপনার বড় হিরো শিরোনাম দিন। প্রথম ও তৃতীয় অংশ সাধারণ সাদা রঙের হবে এবং দ্বিতীয় অংশটি আপনার সিলেক্ট করা চমৎকার গোল্ডেন গ্রেডিয়েন্ট কালার ধারণ করবে।
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">অংশ ১: সাধারণ সাদা লেখা (শুরুতে)</label>
                      <input 
                        type="text" 
                        value={currentConfig.heroTitlePart1 || ""} 
                        onChange={e => updateField("heroTitlePart1", e.target.value)}
                        placeholder="যেমন: অনন্য ও বিশ্বস্ত সেবায় আপনার পবিত্র"
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                      <div className="mt-1 flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-medium text-slate-400">ফন্ট ওজন (Weight):</span>
                        <select
                          value={currentConfig.heroTitlePart1Weight || "font-bold"}
                          onChange={e => updateField("heroTitlePart1Weight", e.target.value)}
                          className="bg-slate-900 border border-slate-850 text-[10px] text-brand-gold font-bold rounded px-2 py-1 focus:outline-none focus:border-brand-gold cursor-pointer"
                        >
                          <option value="font-light">পাতলা (Light)</option>
                          <option value="font-normal">স্বাভাবিক (Normal)</option>
                          <option value="font-medium">মাঝারি (Medium)</option>
                          <option value="font-semibold">আধা-মোটা (Semi-Bold)</option>
                          <option value="font-bold">মোটা (Bold)</option>
                          <option value="font-extrabold">অনেক মোটা (Extra-Bold)</option>
                          <option value="font-black">সর্বোচ্চ মোটা (Black)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-brand-gold">অংশ ২: গোল্ডেন গ্রেডিয়েন্ট লেখা (হাইলাইটেড)</label>
                      <input 
                        type="text" 
                        value={currentConfig.heroTitleGradient || ""} 
                        onChange={e => updateField("heroTitleGradient", e.target.value)}
                        placeholder="যেমন: উমরাহ ও বিশ্বভ্রমণের"
                        className="bg-slate-950 border border-brand-gold/40 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold shadow-sm shadow-brand-gold/5"
                      />
                      <div className="mt-1 flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-medium text-slate-400">ফন্ট ওজন (Weight):</span>
                        <select
                          value={currentConfig.heroTitleGradientWeight || "font-bold"}
                          onChange={e => updateField("heroTitleGradientWeight", e.target.value)}
                          className="bg-slate-900 border border-slate-850 text-[10px] text-brand-gold font-bold rounded px-2 py-1 focus:outline-none focus:border-brand-gold cursor-pointer"
                        >
                          <option value="font-light">পাতলা (Light)</option>
                          <option value="font-normal">স্বাভাবিক (Normal)</option>
                          <option value="font-medium">মাঝারি (Medium)</option>
                          <option value="font-semibold">আধা-মোটা (Semi-Bold)</option>
                          <option value="font-bold">মোটা (Bold)</option>
                          <option value="font-extrabold">অনেক মোটা (Extra-Bold)</option>
                          <option value="font-black">সর্বোচ্চ মোটা (Black)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">অংশ ৩: সাধারণ সাদা লেখা (শেষে)</label>
                      <input 
                        type="text" 
                        value={currentConfig.heroTitlePart3 || ""} 
                        onChange={e => updateField("heroTitlePart3", e.target.value)}
                        placeholder="যেমন: বিশ্বস্ত সঙ্গী!"
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                      <div className="mt-1 flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] font-medium text-slate-400">ফন্ট ওজন (Weight):</span>
                        <select
                          value={currentConfig.heroTitlePart3Weight || "font-bold"}
                          onChange={e => updateField("heroTitlePart3Weight", e.target.value)}
                          className="bg-slate-900 border border-slate-850 text-[10px] text-brand-gold font-bold rounded px-2 py-1 focus:outline-none focus:border-brand-gold cursor-pointer"
                        >
                          <option value="font-light">পাতলা (Light)</option>
                          <option value="font-normal">স্বাভাবিক (Normal)</option>
                          <option value="font-medium">মাঝারি (Medium)</option>
                          <option value="font-semibold">আধা-মোটা (Semi-Bold)</option>
                          <option value="font-bold">মোটা (Bold)</option>
                          <option value="font-extrabold">অনেক মোটা (Extra-Bold)</option>
                          <option value="font-black">সর্বোচ্চ মোটা (Black)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <details className="group bg-slate-900/20 border border-slate-800 rounded-xl p-3">
                  <summary className="text-xs font-semibold text-slate-400 group-open:text-brand-gold cursor-pointer select-none">
                    উন্নত পদ্ধতি (অ্যাডভান্সড HTML শিরোনাম এডিটর)
                  </summary>
                  <div className="flex flex-col gap-2 mt-3">
                    <label className="text-xs font-semibold text-slate-300">হিরো বড় শিরোনাম (সম্পূর্ণ HTML বা র টেক্সট)</label>
                    <textarea 
                      rows={2}
                      value={currentConfig.heroTitle} 
                      onChange={e => updateField("heroTitle", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                    <p className="text-[11px] text-slate-400">
                      <span className="text-brand-gold font-semibold">টিপস:</span> যদি আপনি উপরের ৩-অংশ এডিটর ব্যবহার না করে সম্পূর্ণ কাস্টম HTML দিতে চান, তবে এটি ব্যবহার করতে পারেন। গোল্ডেন গ্রেডিয়েন্ট করতে <code>&lt;span class="gold-gradient"&gt;টেক্সট&lt;/span&gt;</code> ট্যাগ ব্যবহার করুন।
                    </p>
                  </div>
                </details>

                <div className="flex flex-col gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <label className="text-xs font-bold text-slate-200">শিরোনামের জন্য গোল্ডেন গ্রেডিয়েন্ট প্রিসেট নির্বাচন করুন</label>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    {[
                      { id: "classic-royal", name: "রয়েল গোল্ড", preview: "linear-gradient(135deg, #fef08a, #fbbf24, #f59e0b)" },
                      { id: "shining-gold", name: "শাইনিং গোল্ড", preview: "linear-gradient(90deg, #fef08a, #facc15, #fef08a, #fbbf24)" },
                      { id: "deep-amber", name: "ডিপ আম্বার", preview: "linear-gradient(135deg, #fbbf24, #d97706, #b45309)" },
                      { id: "rose-gold", name: "রোজ গোল্ড", preview: "linear-gradient(135deg, #fef3c7, #f59e0b, #fef3c7)" },
                      { id: "sunset-glow", name: "সানসেট গ্লো", preview: "linear-gradient(90deg, #ffe066, #f5af19, #e65c00)" }
                    ].map((preset) => {
                      const isSelected = (currentConfig.heroGradientPreset || "shining-gold") === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => updateField("heroGradientPreset", preset.id)}
                          className={`flex flex-col gap-2 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-slate-900 border-brand-gold/60 shadow-lg shadow-brand-gold/5" 
                              : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/20"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-300">{preset.name}</span>
                            <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-brand-gold bg-brand-gold" : "border-slate-600 bg-transparent"
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                            </div>
                          </div>
                          <div 
                            className="h-5 rounded-lg w-full border border-white/5"
                            style={{ background: preset.preview }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">হিরো উপ-শিরোনাম বর্ণনা</label>
                  <textarea 
                    rows={3}
                    value={currentConfig.heroSubtitle} 
                    onChange={e => updateField("heroSubtitle", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-2.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      হিরো সেকশন ব্যাকগ্রাউন্ড ইমেজ (Main Banner Image)
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">ছবির লিংক দিন অথবা আপনার কম্পিউটার থেকে আপলোড করুন</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={currentConfig.heroBgImage || ""} 
                          onChange={e => updateField("heroBgImage", e.target.value)}
                          placeholder="যেমন: https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1200"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                        <label className="bg-brand-gold/10 hover:bg-brand-gold/20 hover:border-brand-gold/40 border border-brand-gold/20 hover:border-brand-gold/40 rounded-lg px-3.5 py-2 text-xs text-brand-gold font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>আপলোড করুন</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, "heroBgImage")} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="text-[9px] text-slate-400 self-center mr-1">রেডিমেড ছবিসমূহ:</span>
                        {[
                          { name: "পবিত্র কাবা শরীফ", url: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=1200" },
                          { name: "মক্কা ক্লক টাওয়ার", url: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=1200" },
                          { name: "মদিনা সবুজ গম্বুজ", url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200" },
                          { name: "কাবা শরীফ ২", url: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?q=80&w=1200" }
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => updateField("heroBgImage", preset.url)}
                            className="bg-slate-900 hover:bg-slate-850 hover:border-brand-gold/40 border border-slate-800 text-[9px] text-brand-gold px-2 py-1 rounded transition-all cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Preview Frame */}
                    <div className="w-full md:w-36 h-20 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative group shrink-0">
                      {currentConfig.heroBgImage ? (
                        <>
                          <img 
                            src={currentConfig.heroBgImage} 
                            alt="Hero Banner Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                            লাইভ প্রিভিউ
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">কোনো ছবি নেই</span>
                      )}
                    </div>
                  </div>
                </div>

                 <div className="flex flex-col gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200">হিরো সেকশন ফিচার বুলেট পয়েন্টসমূহ (Feature Highlights)</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentBullets = currentConfig.heroBullets || [currentConfig.heroBullet1, currentConfig.heroBullet2, currentConfig.heroBullet3].filter(Boolean);
                        const updatedBullets = [...currentBullets, "নতুন সুবিধা"];
                        setCurrentConfig(prev => ({
                          ...prev,
                          heroBullets: updatedBullets,
                          heroBullet1: updatedBullets[0] || "",
                          heroBullet2: updatedBullets[1] || "",
                          heroBullet3: updatedBullets[2] || ""
                        }));
                      }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-brand-gold/20"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      নতুন বুলেট যোগ করুন
                    </button>
                  </div>

                  {(() => {
                    const bullets = currentConfig.heroBullets || [currentConfig.heroBullet1, currentConfig.heroBullet2, currentConfig.heroBullet3].filter(Boolean);
                    
                    return (
                      <div className="flex flex-col gap-2.5">
                        {bullets.length === 0 ? (
                          <p className="text-xs text-slate-500 py-4 text-center">কোনো বুলেট পয়েন্ট যোগ করা নেই। অনুগ্রহ করে নতুন বুলেট যোগ করুন।</p>
                        ) : (
                          bullets.map((bullet, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-900">
                              <span className="text-[10px] font-bold text-brand-gold w-5 shrink-0 text-center">{idx + 1}</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={e => {
                                  const updated = [...bullets];
                                  updated[idx] = e.target.value;
                                  setCurrentConfig(prev => ({
                                    ...prev,
                                    heroBullets: updated,
                                    heroBullet1: updated[0] || "",
                                    heroBullet2: updated[1] || "",
                                    heroBullet3: updated[2] || ""
                                  }));
                                }}
                                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                                placeholder={`বুলেট ${idx + 1} লিখুন`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = bullets.filter((_, i) => i !== idx);
                                  setCurrentConfig(prev => ({
                                    ...prev,
                                    heroBullets: updated,
                                    heroBullet1: updated[0] || "",
                                    heroBullet2: updated[1] || "",
                                    heroBullet3: updated[2] || ""
                                  }));
                                }}
                                className="w-8 h-8 rounded-lg bg-red-950/20 hover:bg-red-950/50 text-red-400 hover:text-red-300 border border-red-900/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">গুগল রিভিউ ট্রাস্ট রেটিং লেখা</label>
                  <input 
                    type="text" 
                    value={currentConfig.heroRatingText} 
                    onChange={e => updateField("heroRatingText", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-gold">২. ক্যাম্পেইন কার্ড তথ্য</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ক্যাম্পেইন ছোট শিরোনাম ব্যাজ</label>
                    <input 
                      type="text" 
                      value={currentConfig.campBadge} 
                      onChange={e => updateField("campBadge", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ক্যাম্পেইন প্যাকেজ নাম</label>
                    <input 
                      type="text" 
                      value={currentConfig.campTitle} 
                      onChange={e => updateField("campTitle", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">ক্যাম্পেইন বর্ণনা</label>
                  <textarea 
                    rows={2}
                    value={currentConfig.campSub} 
                    onChange={e => updateField("campSub", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div className="flex flex-col gap-2.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                      ক্যাম্পেইন কার্ড ইমেজ (Campaign Image)
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">ছবির লিংক দিন অথবা আপনার কম্পিউটার থেকে আপলোড করুন</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={currentConfig.campImage || ""} 
                          onChange={e => updateField("campImage", e.target.value)}
                          placeholder="যেমন: https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800"
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                        <label className="bg-brand-gold/10 hover:bg-brand-gold/20 hover:border-brand-gold/40 border border-brand-gold/20 hover:border-brand-gold/40 rounded-lg px-3.5 py-2 text-xs text-brand-gold font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>আপলোড করুন</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleImageUpload(e, "campImage")} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                      
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <span className="text-[9px] text-slate-400 self-center mr-1">রেডিমেড ছবিসমূহ:</span>
                        {[
                          { name: "মদিনা সবুজ গম্বুজ", url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=800" },
                          { name: "পবিত্র কাবা শরীফ", url: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?q=80&w=800" },
                          { name: "মক্কা ক্লক টাওয়ার", url: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=800" },
                          { name: "মসজিদ আন-নববী", url: "https://images.unsplash.com/photo-1604999333679-b86d54738315?q=80&w=800" }
                        ].map((preset, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => updateField("campImage", preset.url)}
                            className="bg-slate-900 hover:bg-slate-850 hover:border-brand-gold/40 border border-slate-800 text-[9px] text-brand-gold px-2 py-1 rounded transition-all cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Preview Frame */}
                    <div className="w-full md:w-36 h-20 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center relative group shrink-0">
                      {currentConfig.campImage ? (
                        <>
                          <img 
                            src={currentConfig.campImage} 
                            alt="Campaign Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[8px] text-white font-bold">
                            লাইভ প্রিভিউ
                          </div>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">কোনো ছবি নেই</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">দাম শুরু সূচক</label>
                    <input 
                      type="text" 
                      value={currentConfig.campDesc} 
                      onChange={e => updateField("campDesc", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ক্যাম্পেইন দাম</label>
                    <input 
                      type="text" 
                      value={currentConfig.campPrice} 
                      onChange={e => updateField("campPrice", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ডিসকাউন্ট ব্যাজ টেক্সট</label>
                    <input 
                      type="text" 
                      value={currentConfig.campDiscountText} 
                      onChange={e => updateField("campDiscountText", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ডিসকাউন্ট ব্যাজ সাব-টেক্সট</label>
                    <input 
                      type="text" 
                      value={currentConfig.campDiscountSub} 
                      onChange={e => updateField("campDiscountSub", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES CONTROLS */}
          {activeTab === "services" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">সেবাসমূহ ও প্যাকেজ কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">৪টি প্রধান সেবাকার্ড ও তাদের ভেতরের বিস্তারিত তথ্য (ইনক্লুশন, ফিচারস ও দাম) পরিবর্তন করুন।</p>
              </div>

              <div className="border-b border-slate-800 pb-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-gold">সেবা সেকশন হেডার</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ব্যাজ লেখা</label>
                    <input 
                      type="text" 
                      value={currentConfig.servicesBadge} 
                      onChange={e => updateField("servicesBadge", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">শিরোনাম</label>
                    <input 
                      type="text" 
                      value={currentConfig.servicesTitle} 
                      onChange={e => updateField("servicesTitle", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">সংক্ষিপ্ত বর্ণনা</label>
                  <textarea 
                    rows={2}
                    value={currentConfig.servicesDesc} 
                    onChange={e => updateField("servicesDesc", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8 mt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-3">
                  <h3 className="text-sm font-bold text-brand-gold">প্যাকেজসমূহ কাস্টমাইজ করুন:</h3>
                  <button
                    type="button"
                    onClick={addNewService}
                    className="bg-brand-gold hover:bg-amber-500 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-brand-gold/10 transition-all cursor-pointer hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন প্যাকেজ যোগ করুন</span>
                  </button>
                </div>

                {currentConfig.services.map((svc, sIdx) => (
                  <div key={svc.id} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-4 relative animate-fade-in">
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">প্যাকেজ #{sIdx + 1}: {svc.title || svc.id.toUpperCase()}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-mono">ID: {svc.id}</span>
                        {currentConfig.services.length > 1 && (
                          deletingIndex === sIdx ? (
                            <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/30 px-2 py-1 rounded-lg animate-pulse">
                              <span className="text-[10px] font-bold text-red-300">ডিলিট করবেন?</span>
                              <button
                                type="button"
                                onClick={() => removeService(sIdx)}
                                className="bg-red-600 hover:bg-red-500 text-white px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all"
                              >
                                হ্যাঁ
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingIndex(null)}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all"
                              >
                                না
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingIndex(sIdx)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-950/40 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-red-900/30"
                              title="প্যাকেজ ডিলিট করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>প্যাকেজ ডিলিট</span>
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">প্যাকেজ আইডি (ইংরেজি অক্ষরে, ইউনিক আইডি যেমন: umrah)</label>
                        <input 
                          type="text" 
                          value={svc.id} 
                          onChange={e => updateServiceField(sIdx, "id", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">প্যাকেজের নাম</label>
                        <input 
                          type="text" 
                          value={svc.title} 
                          onChange={e => updateServiceField(sIdx, "title", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">প্যাকেজ সাবটাইটেল</label>
                        <input 
                          type="text" 
                          value={svc.subtitle} 
                          onChange={e => updateServiceField(sIdx, "subtitle", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">প্যাকেজের মেয়াদ</label>
                        <input 
                          type="text" 
                          value={svc.duration} 
                          onChange={e => updateServiceField(sIdx, "duration", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300">প্যাকেজের শুরু দাম</label>
                        <input 
                          type="text" 
                          value={svc.priceStart} 
                          onChange={e => updateServiceField(sIdx, "priceStart", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-brand-gold" />
                          প্যাকেজ ব্যানার ছবি (Image URL/Upload)
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={svc.bgImage || ""} 
                            onChange={e => updateServiceField(sIdx, "bgImage", e.target.value)}
                            placeholder="ছবির লিংক (যেমন: https://...)"
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
                          />
                          <label className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-[11px] text-brand-gold font-bold flex items-center gap-1 cursor-pointer transition-all shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>আপলোড</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={e => handleServiceImageUpload(e, sIdx)} 
                              className="hidden" 
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-slate-300">প্যাকেজের মূল বর্ণনা</label>
                      <textarea 
                        rows={3}
                        value={svc.description} 
                        onChange={e => updateServiceField(sIdx, "description", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    {/* Features and Inclusions management inside service card */}
                    <div className="grid md:grid-cols-2 gap-6 mt-2">
                      
                      {/* Features column */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-200">১. মূল আকর্ষণসমূহ (Features)</span>
                          <button 
                            type="button"
                            onClick={() => addServiceArrayItem(sIdx, "features")}
                            className="bg-slate-800 hover:bg-slate-700 text-brand-gold p-1 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>যোগ করুন</span>
                          </button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {svc.features.map((feature, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2">
                              <input 
                                type="text" 
                                value={feature} 
                                onChange={e => updateServiceArrayItem(sIdx, "features", fIdx, e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-gold"
                              />
                              <button 
                                type="button"
                                onClick={() => removeServiceArrayItem(sIdx, "features", fIdx)}
                                className="text-red-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Inclusions column */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-200">২. সেবাসমূহ অন্তর্ভুক্ত (Inclusions)</span>
                          <button 
                            type="button"
                            onClick={() => addServiceArrayItem(sIdx, "inclusions")}
                            className="bg-slate-800 hover:bg-slate-700 text-brand-gold p-1 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>যোগ করুন</span>
                          </button>
                        </div>
                        <div className="flex flex-col gap-2">
                          {svc.inclusions.map((inclusion, iIdx) => (
                            <div key={iIdx} className="flex items-center gap-2">
                              <input 
                                type="text" 
                                value={inclusion} 
                                onChange={e => updateServiceArrayItem(sIdx, "inclusions", iIdx, e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-gold"
                              />
                              <button 
                                type="button"
                                onClick={() => removeServiceArrayItem(sIdx, "inclusions", iIdx)}
                                className="text-red-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}

                {/* Big Plus Option Card at the bottom */}
                <button
                  type="button"
                  onClick={addNewService}
                  className="bg-slate-950 hover:bg-slate-900 border border-dashed border-slate-800 hover:border-brand-gold/50 p-8 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-white transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-900 group-hover:bg-brand-gold/10 flex items-center justify-center border border-slate-800 group-hover:border-brand-gold/30 transition-all">
                    <Plus className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-all" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-slate-200 group-hover:text-brand-gold">নতুন আরেকটি প্যাকেজ তৈরি করুন</span>
                    <span className="text-xs text-slate-500 mt-1">প্লাস আইকনে ক্লিক করে সহজেই যেকোনো ওমরাহ বা ভ্রমণ প্যাকেজ যুক্ত করতে পারবেন</span>
                  </div>
                </button>

              </div>
            </div>
          )}

          {/* TAB 4: WHY US */}
          {activeTab === "whyus" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">'আমরা কেন সেরা' সেকশন কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">আপনার ট্রাভেল এজেন্সির মূল ৬টি গুণাবলী, সেকশন হেডার ও ডেসক্রিপশন কাস্টমাইজ করুন।</p>
              </div>

              {/* Subsection 1: Section Header Texts */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-brand-gold flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-gold rounded-full" />
                  ১. মূল সেকশন হেডার ও বর্ণনা (স্ক্রিনশটের মূল টেক্সটসমূহ)
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ব্যাজ লেখা (যেমন: আস্থার নিশ্চয়তা)</label>
                    <input 
                      type="text" 
                      value={currentConfig.whyUsBadge} 
                      onChange={e => updateField("whyUsBadge", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">সেকশন শিরোনাম (যেমন: কেন উমরাহ ও ভ্রমণের জন্য আনায়া সেরা?)</label>
                    <input 
                      type="text" 
                      value={currentConfig.whyUsTitle} 
                      onChange={e => updateField("whyUsTitle", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">সেকশন বর্ণনা (যেমন: আমরা কোনো প্রকার অতিরঞ্জিত বিজ্ঞাপন ছাড়া...)</label>
                  <textarea 
                    rows={3}
                    value={currentConfig.whyUsDesc} 
                    onChange={e => updateField("whyUsDesc", e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              {/* Subsection 2: Value Propositions */}
              <div className="flex flex-col gap-4 mt-2">
                <h3 className="text-sm font-bold text-brand-gold flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-gold rounded-full" />
                  ২. এজেন্সির ৬টি মূল আকর্ষণের বিবরণ (Value Propositions)
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {currentConfig.valueProps.map((prop, pIdx) => (
                  <div key={pIdx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">ভ্যালু প্রোপজিশন #{pIdx + 1}</span>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">শিরোনাম</label>
                      <input 
                        type="text" 
                        value={prop.title} 
                        onChange={e => updateValueProp(pIdx, "title", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">বিস্তারিত বর্ণনা</label>
                      <textarea 
                        rows={2}
                        value={prop.description} 
                        onChange={e => updateValueProp(pIdx, "description", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Subsection 3: Trust Statistics */}
              <div className="flex flex-col gap-4 mt-6">
                <h3 className="text-sm font-bold text-brand-gold flex items-center gap-2">
                  <span className="w-1.5 h-3 bg-brand-gold rounded-full" />
                  ৩. ৪টি মূল বিশ্বাসযোগ্যতার পরিসংখ্যান (Core Trust Statistics - স্ক্রিনশটের সেকশন)
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(currentConfig.trustStats || [
                  { value: "৩,৫০০+", label: "সফল ওমরাহ ও হজ যাত্রী" },
                  { value: "৮+", label: "বছরের বিশ্বস্ত অভিজ্ঞতা" },
                  { value: "১০০%", label: "আইনি লাইসেন্স ও অনুমোদন" },
                  { value: "৯৮.৫%", label: "গ্রাহক সন্তুষ্টির রিভিউ" }
                ]).map((stat, sIdx) => (
                  <div key={sIdx} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">পরিসংখ্যান #{sIdx + 1}</span>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">সংখ্যা/মান</label>
                      <input 
                        type="text" 
                        value={stat.value} 
                        onChange={e => updateTrustStat(sIdx, "value", e.target.value)}
                        placeholder="যেমন: ৩,৫০০+"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-slate-400 font-bold uppercase">শিরোনাম/লেবেল</label>
                      <input 
                        type="text" 
                        value={stat.label} 
                        onChange={e => updateTrustStat(sIdx, "label", e.target.value)}
                        placeholder="যেমন: সফল ওমরাহ ও হজ যাত্রী"
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === "faq" && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">জিজ্ঞাসিত প্রশ্নাবলী কাস্টমাইজেশন</h2>
                  <p className="text-slate-400 text-xs">ওমরাহ ও ট্যুর বুকিং সংক্রান্ত প্রশ্ন ও উত্তরগুলো এড, ডিলিট বা এডিট করুন।</p>
                </div>
                <button 
                  onClick={addNewFaq}
                  className="bg-brand-gold hover:bg-yellow-400 text-brand-purple font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>প্রশ্ন যোগ করুন</span>
                </button>
              </div>

              <div className="border-b border-slate-800 pb-6 flex flex-col gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ব্যাজ লেখা</label>
                    <input 
                      type="text" 
                      value={currentConfig.faqBadge} 
                      onChange={e => updateField("faqBadge", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">শিরোনাম</label>
                    <input 
                      type="text" 
                      value={currentConfig.faqTitle} 
                      onChange={e => updateField("faqTitle", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">সংক্ষিপ্ত বর্ণনা</label>
                  <textarea 
                    rows={2}
                    value={currentConfig.faqDesc} 
                    onChange={e => updateField("faqDesc", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                {currentConfig.faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3 relative">
                    <button 
                      onClick={() => removeFaq(fIdx)}
                      className="absolute top-4 right-4 text-red-400 hover:text-red-500 p-1 bg-slate-950 rounded border border-slate-800 cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">প্রশ্ন ও উত্তর #{fIdx + 1}</span>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">প্রশ্ন (Q)</label>
                      <input 
                        type="text" 
                        value={faq.q} 
                        onChange={e => updateFaq(fIdx, "q", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">উত্তর (A)</label>
                      <textarea 
                        rows={3}
                        value={faq.a} 
                        onChange={e => updateFaq(fIdx, "a", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">কাস্টমার রিভিউ কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">৩টি রিভিউর নাম, পদবি, মেসেজ ও গোল্ড স্টার রেটিং কাস্টমাইজ করুন।</p>
              </div>

              <div className="border-b border-slate-800 pb-6 flex flex-col gap-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">ব্যাজ লেখা</label>
                    <input 
                      type="text" 
                      value={currentConfig.testimonialsBadge} 
                      onChange={e => updateField("testimonialsBadge", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">শিরোনাম</label>
                    <input 
                      type="text" 
                      value={currentConfig.testimonialsTitle} 
                      onChange={e => updateField("testimonialsTitle", e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-300">সংক্ষিপ্ত বর্ণনা</label>
                  <textarea 
                    rows={2}
                    value={currentConfig.testimonialsDesc} 
                    onChange={e => updateField("testimonialsDesc", e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 mt-4">
                {currentConfig.testimonials.map((test, tIdx) => (
                  <div key={tIdx} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col gap-3">
                    <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">গ্রাহক রিভিউ #{tIdx + 1}</span>
                    
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">গ্রাহকের নাম</label>
                        <input 
                          type="text" 
                          value={test.name} 
                          onChange={e => updateTestimonial(tIdx, "name", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">পদবি / ঠিকানা</label>
                        <input 
                          type="text" 
                          value={test.role} 
                          onChange={e => updateTestimonial(tIdx, "role", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">অবতার আদ্যক্ষর (যেমন: এমআই)</label>
                        <input 
                          type="text" 
                          value={test.avatarInitials} 
                          onChange={e => updateTestimonial(tIdx, "avatarInitials", e.target.value)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">মন্তব্য</label>
                      <textarea 
                        rows={3}
                        value={test.text} 
                        onChange={e => updateTestimonial(tIdx, "text", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SECURITY & ACCESS CONTROLS */}
          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">অ্যাক্সেস ও নিরাপত্তা কাস্টমাইজেশন</h2>
                <p className="text-slate-400 text-xs">আপনার অ্যাডমিন প্যানেলের ইউজারনেম ও পাসওয়ার্ড পরিবর্তন করুন এবং অন্যদের এক্সেস দিন।</p>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col gap-6">
                <div className="flex items-start gap-3 bg-brand-blue/35 p-4 rounded-xl border border-brand-gold/20 text-slate-200">
                  <Lock className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <div className="text-xs md:text-sm flex flex-col gap-1">
                    <span className="font-bold text-brand-gold">গুরুত্বপূর্ণ নির্দেশনা:</span>
                    <span>এখানে নির্ধারিত ইউজারনেম এবং পাসওয়ার্ড দিয়ে পরবর্তীতে আপনি বা আপনার টিম এই অ্যাডমিন প্যানেলে লগইন করতে পারবেন। ডিফল্ট ইউজারনেম এবং পাসওয়ার্ড থাকে <strong>admin</strong> ও <strong>admin</strong>।</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">অ্যাডমিন ইউজারনেম (Username)</label>
                    <input 
                      type="text" 
                      value={currentConfig.adminUsername || ""} 
                      onChange={e => updateField("adminUsername", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold font-mono"
                      placeholder="যেমন: admin"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-300">অ্যাডমিন পাসওয়ার্ড (Password)</label>
                    <input 
                      type="text" 
                      value={currentConfig.adminPassword || ""} 
                      onChange={e => updateField("adminPassword", e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold font-mono"
                      placeholder="যেমন: admin"
                    />
                  </div>
                </div>

                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex flex-col gap-2">
                  <span className="font-bold text-slate-300">অন্যান্য মানুষকে এক্সেস দেওয়ার নিয়ম:</span>
                  <p className="leading-relaxed">
                    ১. আপনার ওয়েবসাইটের অ্যাডমিন লগইন পেজের লিংক অন্য কাউকে পাঠান।
                  </p>
                  <p className="leading-relaxed">
                    ২. উপরে সেট করা নতুন <strong>ইউজারনেম</strong> এবং <strong>পাসওয়ার্ড</strong> তাদের জানিয়ে দিন।
                  </p>
                  <p className="leading-relaxed">
                    ৩. তারা সেই লিংক এবং ক্রেডেনশিয়াল ব্যবহার করে এই অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করে কাস্টমাইজেশন ও বুকিং রিকোয়েস্ট ম্যানেজ করতে পারবেন।
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
      
      {/* Footer bar */}
      <footer className="bg-slate-950 py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        <p>© {new Date().getFullYear()} {currentConfig.siteName}. অ্যাডমিন প্যানেল ইঞ্জিন।</p>
      </footer>

    </div>
  );
}
