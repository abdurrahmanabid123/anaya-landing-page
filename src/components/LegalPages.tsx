import { ArrowLeft, Compass, Shield, FileText, CheckCircle2 } from "lucide-react";

interface PageProps {
  onBack: () => void;
  siteName: string;
  siteNameEn: string;
  contactEmail: string;
  contactPhone: string;
}

export function PrivacyPage({ onBack, siteName, siteNameEn, contactEmail, contactPhone }: PageProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Back Button and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-gold font-bold text-sm transition-colors cursor-pointer w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>মূল পাতায় ফিরে যান</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold">সর্বশেষ আপডেট:</span> ৪ জুলাই, ২০২৬
          </div>
        </div>

        {/* main container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 text-left">
          
          {/* Logo Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-purple" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">প্রাইভেসি পলিসি (Privacy Policy)</h2>
              <p className="text-xs text-slate-400 mt-0.5">{siteNameEn}</p>
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 font-light">
            আনায়া ট্যুরস এন্ড ট্রাভেলস ({siteNameEn}) আমাদের সম্মানিত গ্রাহক ও ওয়েবসাইট ব্যবহারকারীদের ব্যক্তিগত তথ্যের গোপনীয়তা রক্ষা করতে সম্পূর্ণ প্রতিশ্রুতিবদ্ধ। আমরা যখন আপনার তথ্য সংগ্রহ এবং ব্যবহার করি, তখন আমরা দেশের প্রচলিত আইন এবং গ্রাহকদের আস্থা অর্জনের সমস্ত বিধি মেনে চলি।
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ১. সংগৃহীত তথ্যসমূহ (Information We Collect)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light mb-2">
                আমাদের ওয়েবসাইটের বুকিং ফর্ম পূরণ করার সময় বা আমাদের সেবা গ্রহণের ক্ষেত্রে আমরা নিচের তথ্যগুলো সংগ্রহ করতে পারি:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-xs md:text-sm font-light space-y-1.5 pl-2">
                <li>সম্মানিত গ্রাহকের পুরো নাম (পাসপোর্ট অনুযায়ী)।</li>
                <li>সক্রিয় মোবাইল ফোন নম্বর এবং হোয়াটসঅ্যাম্প নম্বর।</li>
                <li>ইমেইল ঠিকানা (যোগাযোগ এবং তথ্য আদান-প্রদানের জন্য)।</li>
                <li>পাসপোর্টের কপি ও ছবি (ভিসা প্রসেসিং ও ওমরাহ বুকিং এর সময়)।</li>
                <li>ভ্রমণকারীর সংখ্যা এবং বিশেষ চাহিদার তথ্যসমূহ।</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ২. তথ্যের ব্যবহার (How We Use Your Information)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light mb-2">
                আমরা সংগৃহীত তথ্য নিম্নোক্ত জরুরি প্রসেস ও সেবা দেওয়ার উদ্দেশ্যে ব্যবহার করি:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-xs md:text-sm font-light space-y-1.5 pl-2">
                <li>পবিত্র হজ ও ওমরাহ ভিসা প্রসেসিং এর প্রয়োজনীয় সরকারি নিবন্ধন।</li>
                <li>আপনার পছন্দ অনুযায়ী বিমান টিকিট ইস্যু এবং হোটেল রুম রিজার্ভেশন।</li>
                <li>আমাদের ডেডিকেটেড প্রতিনিধি টিমের মাধ্যমে পরবর্তী ১৫-২০ মিনিটে বুকিং কনফার্মেশনের জন্য যোগাযোগ করা।</li>
                <li>আপনার সফরকে আরামদায়ক ও ঝামেলাহীন করতে ট্রান্সপোর্ট এবং মোয়াল্লিম সংক্রান্ত সমন্বয় সাধন করা।</li>
                <li>ভবিষ্যৎ অফার এবং আকর্ষণীয় ট্রাভেল প্যাকেজ সম্পর্কে আপডেট প্রদান।</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৩. তথ্য শেয়ারিং ও গোপনীয়তা রক্ষা (Information Sharing)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                আমরা আপনার ব্যক্তিগত তথ্য বা কোনো সংগৃহীত ফাইল/নথিপত্র কোনো অননুমোদিত তৃতীয় পক্ষের কাছে বিক্রি বা পাচার করি না। তবে সরকারি নিয়মতান্ত্রিক ভিসা ইস্যু করার স্বার্থে প্রয়োজনীয় তথ্য বাংলাদেশ ও সৌদি আরব সরকারের হজ ও ওমরাহ মন্ত্রণালয়, নির্ধারিত এয়ারলাইন এবং হোটেলের ডাটাবেজে প্রেরণ করা হতে পারে।
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৪. তথ্য নিরাপত্তা ও সুরক্ষা (Data Security)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                আপনার তথ্যের সর্বোচ্চ নিরাপত্তা বজায় রাখতে আমরা সর্বাধুনিক নিরাপত্তা ব্যবস্থা এবং এসএসএল এনক্রিপশন ব্যবহার করি। আমাদের ডাটাবেজে রক্ষিত সকল ফাইল ও তথ্য কঠোর গোপনীয়তার সাথে তদারকি করা হয়, যার ফলে কোনো ধরনের অপব্যবহার বা হ্যাকিং এর ঝুঁকি থাকে না।
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৫. কুকিজের ব্যবহার (Use of Cookies)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                আমাদের ওয়েবসাইটের ব্রাউজিং অভিজ্ঞতা আরও দ্রুত এবং সাবলীল করতে স্ট্যান্ডার্ড ব্রাউজার কুকিজ ব্যবহৃত হয়ে থাকে। আপনি চাইলে যেকোনো সময় আপনার নিজস্ব ব্রাউজার সেটিং থেকে কুকিজ ডিসেবল করে দিতে পারেন।
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৬. যোগাযোগ ও জিজ্ঞাসা (Contact Information)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                আনায়া ট্যুরস এন্ড ট্রাভেলস এর প্রাইভেসি পলিসি সংক্রান্ত কোনো প্রশ্ন বা পরামর্শ থাকলে সরাসরি আমাদের ইমেইল অথবা ওমরাহ হেল্পলাইন নম্বরে যোগাযোগ করার অনুরোধ রইল:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3 flex flex-col gap-2 text-xs md:text-sm">
                <p><strong>ঠিকানা:</strong> হাউস #১২, রোড #০৫, সেক্টর #১১, উত্তরা মডেল টাউন, ঢাকা-১২৩০, বাংলাদেশ।</p>
                <p><strong>হটলাইন:</strong> {contactPhone}</p>
                <p><strong>ইমেইল:</strong> {contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Action Back Button */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex justify-center">
            <button 
              onClick={onBack}
              className="bg-brand-purple hover:bg-purple-950 text-white font-bold text-xs md:text-sm px-8 py-3 rounded-xl transition-all shadow cursor-pointer"
            >
              আমি একমত, মূল পাতায় ফিরে যান
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export function TermsPage({ onBack, siteName, siteNameEn, contactEmail, contactPhone }: PageProps) {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Back Button and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-brand-purple hover:text-brand-gold font-bold text-sm transition-colors cursor-pointer w-fit group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>মূল পাতায় ফিরে যান</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold">সর্বশেষ আপডেট:</span> ৪ জুলাই, ২০২৬
          </div>
        </div>

        {/* main container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 text-left">
          
          {/* Logo Badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-purple" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">ব্যবহারের শর্তাবলী (Terms & Conditions)</h2>
              <p className="text-xs text-slate-400 mt-0.5">{siteNameEn}</p>
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 font-light">
            আনায়া ট্যুরস এন্ড ট্রাভেলস ({siteNameEn}) ওয়েবসাইটে আপনাকে স্বাগতম। এই সাইটের যেকোনো সেবা গ্রহণ করার পূর্বে অনুগ্রহ করে নিম্নোক্ত শর্তাবলী এবং নিয়মাবলি মনোযোগ দিয়ে পড়ে নিন। আমাদের সেবা গ্রহণের মাধ্যমে আপনি এই শর্তাবলী সম্পূর্ণ মেনে নিতে সম্মতি জ্ঞাপন করছেন।
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ১. বুকিং ও বুকিং মানি সংক্রান্ত নীতি (Booking & Payment Policy)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light mb-2">
                যেকোনো ওমরাহ বা ট্রাভেল প্যাকেজ নিশ্চিত করতে নিম্নোক্ত আর্থিক নিয়ম প্রযোজ্য হবে:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-xs md:text-sm font-light space-y-1.5 pl-2">
                <li>প্যাকেজটি আনুষ্ঠানিকভাবে লক করার জন্য একটি ন্যূনতম বুকিং চার্জ (বুকিং মানি) অগ্রিম প্রদান করতে হবে।</li>
                <li>ভ্রমণ বা ওমরাহর জন্য সরকারি ভিসা সাবমিশন এবং বিমান টিকিট কাটার পূর্বে প্যাকেজ মূল্যের সম্পূর্ণ টাকা পরিশোধ করতে হবে।</li>
                <li>কোনো পূর্ব নোটিশ ছাড়াই আন্তর্জাতিক এয়ারলাইন্স ফুয়েল চার্জ অথবা ট্যাক্স বৃদ্ধি করলে তার সাথে সামঞ্জস্য রেখে প্যাকেজ মূল্য সামান্য পরিবর্তনশীল হতে পারে।</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ২. ভিসা ইস্যুকরণ ও সরকারি সিদ্ধান্তসমূহ (Visa Regulations)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                ভিসা সম্পূর্ণভাবে সংশ্লিষ্ট দেশের দূতাবাস বা সংশ্লিষ্ট দেশের পররাষ্ট্র/হজ মন্ত্রণালয়ের এখতিয়ারভুক্ত বিষয়। আমরা ফাইলগুলো সম্পূর্ণ সঠিক ও নিখুঁতভাবে সরকারি পোর্টালে সাবমিট করি। কোনো অনিবার্য সরকারি কারণে বা কারিগরি ত্রুটির কারণে ভিসা দেরিতে অনুমোদিত হলে বা রিজেক্ট বা বাতিল হলে তার জন্য এজেন্সি দায়ী থাকবে না। তবে আমাদের অভিজ্ঞ টিম সর্বোচ্চ পেশাদারিত্বের সাথে তা তদারকি করবে।
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৩. বাতিলকরণ এবং রিফান্ড পলিসি (Cancellation & Refund)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light mb-2">
                যাত্রার তারিখ পরিবর্তনের ক্ষেত্রে বা বুকিং বাতিল করার ক্ষেত্রে নিম্নোক্ত ফি প্রযোজ্য হবে:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-xs md:text-sm font-light space-y-1.5 pl-2">
                <li>এয়ারলাইন্স এবং হোটেলের ক্যান্সেলেশন ফি ও রিফান্ড নীতি অনুযায়ী চূড়ান্ত রিফান্ড হিসাব করা হবে।</li>
                <li>ইস্যুকৃত টিকিট নন-রিফান্ডেবল ক্যাটাগরির হলে এয়ারলাইন্স থেকে টাকা রিফান্ড পাওয়া যাবে না।</li>
                <li>ভিসা প্রসেস করার পর বুকিং বাতিল করতে চাইলে, অলরেডি পেড হওয়া সরকারি ভিসা ফি এবং সার্ভিস চার্জ নন-রিফান্ডেবল হিসেবে গণ্য হবে।</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৪. হোটেল আবাসন এবং মোয়াল্লিম সেবা (Accommodation & Guiding)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                প্যাকেজে বর্ণিত ক্যাটাগরি অনুযায়ী মক্কা ও মদিনার হোটেলগুলোতে থাকার ব্যবস্থা করা হবে। ওমরাহর ক্ষেত্রে বিজ্ঞ ও অভিজ্ঞ আলেম ও মোয়াল্লিম আপনাদের যথাযথ ধর্মীয় দিক-নির্দেশনা এবং দিক-নির্দেশনা প্রদান করবেন। সফরকালে যেকোনো গ্রুপ নিয়ম এবং মোয়াল্লিমের সুশৃঙ্খল নির্দেশনা মেনে চলা সম্মানিত ওমরাহ পালনকারীদের অন্যতম দায়িত্ব।
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৫. যাত্রীদের আইনি বাধ্যবাধকতা ও দায়বদ্ধতা (Passenger Obligations)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light mb-2">
                ভ্রমণকারীদের অবশ্যই নিজ দায়িত্বে নিম্নোক্ত আইনি বিষয়সমূহ সম্পন্ন করতে হবে:
              </p>
              <ul className="list-disc list-inside text-slate-600 text-xs md:text-sm font-light space-y-1.5 pl-2">
                <li>পাসপোর্টের মেয়াদ অবশ্যই যাত্রার দিন থেকে কমপক্ষে ৬ মাস থাকতে হবে।</li>
                <li>সফরকালে সংশ্লিষ্ট দেশের স্থানীয় আইন, সংস্কৃতি, সামাজিক আচার ও ধর্মীয় বিধি-নিষেধের কোনো ধরনের লঙ্ঘন করা যাবে না।</li>
                <li>কোনো যাত্রী যদি নিজ ইচ্ছায় সফরকালে দলছুট বা নিখোঁজ হয়ে যান, তবে সংশ্লিষ্ট দেশের প্রচলিত আইন অনুযায়ী তার বিরুদ্ধে যেকোনো আইনি পদক্ষেপে এজেন্সি দায়ী থাকবে না।</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-brand-gold rounded-full inline-block" />
                ৬. শর্তাবলী সংশোধন ও পরিবর্তন (Amendments)
              </h3>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light">
                আনায়া ট্যুরস এন্ড ট্রাভেলস কোনো পূর্ব ঘোষণা ছাড়াই যেকোনো সময় এই ব্যবহারের শর্তাবলী পরিবর্তন, সংশোধন বা পরিমার্জন করার অধিকার সংরক্ষণ করে। যেকোনো সেবার ক্ষেত্রে সর্বশেষ সংশোধিত শর্তাবলী চূড়ান্ত বলে গণ্য হবে।
              </p>
            </div>
          </div>

          {/* Action Back Button */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex justify-center">
            <button 
              onClick={onBack}
              className="bg-brand-gold hover:bg-yellow-500 text-brand-purple font-bold text-xs md:text-sm px-8 py-3 rounded-xl transition-all shadow cursor-pointer"
            >
              আমি সকল শর্তে একমত, মূল পাতায় ফিরে যান
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
