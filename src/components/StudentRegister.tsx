/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  GraduationCap, 
  ArrowRight, 
  User, 
  Hash, 
  Plane, 
  MapPin, 
  Briefcase, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Phone,
  Mail,
  Map
} from "lucide-react";
import { StudentRegistration } from "../types";
import { AnimatedCounter } from "./PremiumComponents";

interface StudentRegisterProps {
  onRegister: (student: StudentRegistration) => void;
  onAdminClick: () => void;
}

const DEPARTMENTS = [
  "Computer Science & Engineering (CSE)",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Information Technology (IT)",
  "Artificial Intelligence & Data Science (AIDS)",
  "Mechanical Engineering (Mech)",
  "Civil Engineering (Civil)",
  "Chemical Engineering",
  "Biotechnology",
  "Pharmaceutical Technology",
  "Master of Business Administration (MBA)",
  "Master of Computer Applications (MCA)",
];

const YEARS = ["I Year", "II Year", "III Year", "IV Year"];

export default function StudentRegister({ onRegister, onAdminClick }: StudentRegisterProps) {
  const [regNo, setRegNo] = useState("");
  const [name, setName] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regNo.trim()) {
      setError("Please enter your Register Number.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your Full Name.");
      return;
    }

    onRegister({
      registerNumber: regNo.trim().toUpperCase(),
      studentName: name.trim(),
      department: dept,
      year: year,
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary selection:text-white relative overflow-hidden">
      
      {/* BACKGROUND FLOATING ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            x: [0, 50, -20, 0], 
            y: [0, -50, 30, 0],
            rotate: [0, 360]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 60, 0], 
            y: [0, 60, -30, 0] 
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-2/3 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl"
        />
      </div>

      {/* STICKY BLURRED NAVIGATION */}
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Compass className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-slate-dark">
                Campus<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Explorer</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Student Portal</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <button 
              onClick={scrollToForm}
              className="hidden md:inline-flex text-sm font-semibold text-slate-dark hover:text-primary transition-colors cursor-pointer"
            >
              Start Registration
            </button>
            <button
              onClick={onAdminClick}
              className="px-5 py-2.5 bg-slate-dark hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-secondary" />
              Admin Portal
            </button>
          </motion.div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative w-full py-20 lg:py-36 flex flex-col items-center justify-center overflow-hidden z-10 px-4 sm:px-6 lg:px-8 border-b border-slate-100 pb-24 lg:pb-40">
        <div className="absolute inset-0 z-0">
          {!videoFailed && (
            <video
              autoPlay
              loop
              muted
              playsInline
              onCanPlay={() => setVideoLoaded(true)}
              onError={() => setVideoFailed(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-winding-road-in-a-green-forest-42641-large.mp4" type="video/mp4" />
            </video>
          )}
          {(!videoLoaded || videoFailed) && (
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
              alt="Adventure Travel"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/95 via-slate-dark/80 to-primary/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
        </div>

        {/* FLOATING ANIMATED ICONS */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {/* Airplane */}
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              x: [0, 10, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[12%] p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg text-secondary hidden md:block"
          >
            <Plane className="w-6 h-6 rotate-45" />
          </motion.div>

          {/* Compass */}
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, 20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-28 left-[18%] p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg text-accent hidden md:block"
          >
            <Compass className="w-5 h-5 animate-spin-slow" />
          </motion.div>

          {/* Map Pin */}
          <motion.div
            animate={{ 
              y: [0, -28, 0]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-32 right-[18%] p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg text-success hidden md:block"
          >
            <MapPin className="w-5 h-5 animate-bounce" />
          </motion.div>

          {/* Suitcase */}
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              x: [0, -10, 0]
            }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-24 right-[15%] p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg text-white/80 hidden md:block"
          >
            <Briefcase className="w-5 h-5" />
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-20 mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-inner"
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            Sponsorship & Union Travel Portal
          </motion.div>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl sm:text-6xl font-display font-black text-white tracking-tight leading-[1.1]"
          >
            Your Ultimate College <br/>
            <span className="bg-gradient-to-r from-secondary via-cyan-300 to-accent bg-clip-text text-transparent">
              Adventure Awaits
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto text-base sm:text-lg text-white/90 leading-relaxed drop-shadow-sm font-light"
          >
            Discover stunning destinations, vote for your favorite spots, organize budget sheets, and submit your official preferences to the college union trip coordinators.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={scrollToForm}
              className="group px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 cursor-pointer transition-all duration-300 active:scale-95 flex items-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              Plan Your Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToForm();
              }}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-semibold rounded-2xl transition active:scale-95 text-sm"
            >
              How It Works
            </a>
          </motion.div>
        </div>

        {/* PREMIUM STATS BANNER */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/40 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <span className="text-3xl sm:text-4xl font-display font-black text-primary">
                <AnimatedCounter value={65} suffix="+" />
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5">
                Curated Escapes
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 sm:pt-2">
              <span className="text-3xl sm:text-4xl font-display font-black text-secondary">
                <AnimatedCounter value={1420} suffix="+" />
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5">
                Student Votes
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 sm:pt-2">
              <span className="text-3xl sm:text-4xl font-display font-black text-slate-dark">
                <AnimatedCounter value={12} suffix=" Districts" />
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5">
                States covered
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center pt-6 sm:pt-2">
              <span className="text-3xl sm:text-4xl font-display font-black text-success">
                ₹<AnimatedCounter value={1800} suffix="" />
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5">
                Avg Budget per Head
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section 
        id="register-form" 
        ref={formRef} 
        className="relative py-20 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center z-10"
      >
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Welcome Info Boarding Pass Sidebar (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block">Trip Guidelines</span>
              <h2 className="text-3xl font-display font-extrabold text-slate-dark tracking-tight leading-tight">
                Get Ready for takeoff
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Provide your registration details to gain customized access to our travel database. Choose among top luxury destinations at student-optimized budgets.
              </p>
            </div>

            {/* Quick Benefits List */}
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-primary/10 text-primary rounded-xl shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-dark uppercase">60+ Curated Hotspots</h4>
                  <p className="text-xs text-slate-400">Explore beaches, hill stations, and historical marvels.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-secondary/10 text-secondary rounded-xl shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-dark uppercase">Customized Budgets</h4>
                  <p className="text-xs text-slate-400">Plan precise costs for food, stay, and transport.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-accent/10 text-accent rounded-xl shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-dark uppercase">100% Secure Survey</h4>
                  <p className="text-xs text-slate-400">Direct integration with class coordinators.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration glassmorphic Card (7 Cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-6 sm:p-10 rounded-[24px] shadow-xl border border-white relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-secondary/10 rounded-full blur-xl" />

              <div className="mb-6">
                <h3 className="text-xl font-display font-bold text-slate-dark">Student Check-In</h3>
                <p className="text-xs text-slate-400">All fields are mandatory for identity verification</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3.5 bg-error/10 border border-error/20 rounded-xl text-xs text-error font-semibold flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-error" />
                    {error}
                  </motion.div>
                )}

                {/* Register Number Input */}
                <div className="relative">
                  <label 
                    htmlFor="regNo" 
                    className="block text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  >
                    <Hash className="w-3.5 h-3.5 text-primary" />
                    Register Number / Roll No
                  </label>
                  <div className={`relative flex items-center rounded-xl transition duration-300 border ${
                    focusedField === "regNo" ? "border-primary ring-2 ring-primary/20 bg-white" : "border-slate-200 bg-slate-50/50"
                  }`}>
                    <input
                      id="regNo"
                      name="regNo"
                      type="text"
                      required
                      placeholder="e.g. 917621104001"
                      value={regNo}
                      onFocus={() => setFocusedField("regNo")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="block w-full px-4 py-3 text-sm text-slate-dark placeholder-slate-400 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Name Input */}
                <div className="relative">
                  <label 
                    htmlFor="name" 
                    className="block text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-primary" />
                    Student Full Name
                  </label>
                  <div className={`relative flex items-center rounded-xl transition duration-300 border ${
                    focusedField === "name" ? "border-primary ring-2 ring-primary/20 bg-white" : "border-slate-200 bg-slate-50/50"
                  }`}>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Enter your name as per records"
                      value={name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full px-4 py-3 text-sm text-slate-dark placeholder-slate-400 outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Grid for Dept & Year */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="relative">
                    <label 
                      htmlFor="dept" 
                      className="block text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      Department
                    </label>
                    <select
                      id="dept"
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="block w-full px-3 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-dark text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition cursor-pointer"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d} className="text-slate-800">
                          {d.length > 30 ? d.substring(0, 27) + "..." : d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <label 
                      htmlFor="year" 
                      className="block text-xs font-bold text-slate-dark uppercase tracking-wider mb-2"
                    >
                      Year of Study
                    </label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="block w-full px-3 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-dark text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition cursor-pointer"
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y} className="text-slate-800">
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Glowing Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Enter Travel Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PREMIUM FOOTER */}
      <footer className="bg-slate-dark text-white pt-16 pb-8 z-10 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-white/10">
            
            {/* Column 1: Info (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                  <Compass className="h-5.5 w-5.5 text-white" />
                </div>
                <span className="font-display font-black text-lg tracking-tight text-white">
                  Campus<span className="text-secondary">Explorer</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-light">
                Delivering highly organized, beautifully budgeted, and memorable college trips with transparent feedback mechanisms. Sponsored by the College Union.
              </p>
              
              {/* Social Media icons with hover glow */}
              <div className="flex items-center gap-3 pt-2">
                {[
                  { icon: Instagram, url: "https://instagram.com" },
                  { icon: Twitter, url: "https://twitter.com" },
                  { icon: Facebook, url: "https://facebook.com" },
                  { icon: Linkedin, url: "https://linkedin.com" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ y: -3, scale: 1.1 }}
                      className="p-2.5 bg-white/5 hover:bg-primary/20 text-slate-300 hover:text-white rounded-xl border border-white/5 hover:border-primary/30 transition shadow-inner"
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Quick Links (3 Cols) */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <a href="#register-form" onClick={scrollToForm} className="hover:text-primary transition">
                    Student Registration
                  </a>
                </li>
                <li>
                  <button onClick={onAdminClick} className="hover:text-primary transition bg-transparent border-none p-0 cursor-pointer text-left">
                    Admin / Organizer Log-In
                  </button>
                </li>
                <li>
                  <a href="https://images.unsplash.com" target="_blank" rel="noreferrer" className="hover:text-primary transition">
                    Travel Photography
                  </a>
                </li>
                <li>
                  <span className="text-slate-500 cursor-not-allowed">College Union Charter</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Info (4 Cols) */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Union Helpdesk</h4>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary shrink-0" />
                  <span>union-trips@college.edu.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-success shrink-0" />
                  <span>Main Campus Building, Union Office Room 12</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
            <p>© 2026 CampusExplorer. All Rights Reserved. Co-designed with premium luxury gradients.</p>
            <div className="flex gap-4">
              <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
              <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
