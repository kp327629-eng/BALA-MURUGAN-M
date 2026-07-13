/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, 
  Compass, 
  Sparkles, 
  Navigation, 
  Calendar, 
  Thermometer, 
  Clock,
  ShieldAlert, 
  Landmark, 
  Bus, 
  Hotel, 
  Utensils, 
  Ticket, 
  Wallet,
  Camera, 
  Check, 
  ArrowRight, 
  BookOpen, 
  Search, 
  Info,
  LogOut,
  Sparkle,
  Layers,
  ChevronRight,
  TrendingUp,
  Map
} from "lucide-react";
import { TouristDestination, StudentRegistration } from "../types";
import { renderMarkdown } from "../utils/markdown";
import { getDestinationImage, getDestinationGallery, getStateImage, getClassificationImage, getAttractionImage, getActivityImage } from "../utils/imageHelper";
import { PremiumCarousel } from "./PremiumComponents";

interface DestinationExplorerProps {
  student: StudentRegistration;
  destinations: TouristDestination[];
  onSelectPreference: (dest: TouristDestination) => void;
  onLogout: () => void;
}

const STATES = ["All States", "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"];

export default function DestinationExplorer({ student, destinations, onSelectPreference, onLogout }: DestinationExplorerProps) {
  const [selectedState, setSelectedState] = useState("All States");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState<TouristDestination | null>(null);
  const [previewImgUrl, setPreviewImgUrl] = useState<string | null>(null);
  
  // AI Guide state
  const [aiGuide, setAiGuide] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  // Select default destination on load
  useEffect(() => {
    if (destinations.length > 0 && !selectedDest) {
      setSelectedDest(destinations[0]);
    }
  }, [destinations, selectedDest]);

  // Fetch AI Guide when selected destination changes
  useEffect(() => {
    if (selectedDest) {
      fetchAiGuide(selectedDest);
    }
  }, [selectedDest]);

  const fetchAiGuide = async (dest: TouristDestination) => {
    setLoadingAi(true);
    setAiGuide("");
    setAiError("");

    try {
      const response = await fetch("/api/ai/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationName: dest.name,
          state: dest.state,
          district: dest.district,
          whyVisit: dest.whyVisit,
          famousAttractions: dest.famousAttractions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate guide");
      }

      const data = await response.json();
      setAiGuide(data.guide);
    } catch (err) {
      console.error(err);
      setAiError("Unable to fetch AI guide at the moment. Please ensure the Gemini API Key is configured.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Filter list
  const filteredDestinations = destinations.filter((dest) => {
    const matchesState = selectedState === "All States" || dest.state === selectedState;
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.overview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-gradient-to-tr from-slate-50 to-blue-50/50">
      
      {/* Decorative moving blur backgrounds */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      {/* UPPER NAVIGATION HEADER WITH GLASSMORPHIC DESIGN */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex flex-col sm:flex-row justify-between items-center gap-4 py-4 sm:py-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Compass className="h-6 w-6 text-white animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-slate-dark">
                Campus<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Explorer</span>
              </span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Destination Directory</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-white/80 border border-slate-200/60 px-4 py-2 rounded-2xl shadow-sm text-xs">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="font-bold text-slate-dark">{student.studentName}</span>
              <span className="w-px h-3 bg-slate-200"></span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                {student.registerNumber} • {student.year} {student.department.split(" (")[1]?.replace(")", "") || student.department.substring(0, 5)}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-slate-dark hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* FEATURED DESTINATIONS IMMERSIVE SHOWCASE */}
      {destinations && destinations.length > 0 && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 z-10">
          <PremiumCarousel
            destinations={destinations}
            onSelect={(dest) => setSelectedDest(dest)}
          />
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* LEFT PANEL: FILTERS & SPOT DIRECTORY (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col gap-5 h-[calc(100vh-140px)] min-h-[550px] lg:sticky lg:top-24">
          
          {/* Active State Interactive Hero Banner */}
          <div className="relative h-32 rounded-3xl overflow-hidden border border-white shadow-md shrink-0 group">
            <img
              src={getStateImage(selectedState, "hd")}
              alt={selectedState}
              className="w-full h-full object-cover transition-all duration-[8000ms] scale-100 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/95 via-slate-dark/30 to-transparent flex flex-col justify-end p-5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Sparkle className="w-3 h-3 text-secondary animate-pulse" />
                <span className="text-[9px] text-secondary font-extrabold uppercase tracking-widest">Active Territory Zone</span>
              </div>
              <h3 className="text-xl font-display font-bold text-white tracking-tight leading-tight">{selectedState}</h3>
            </div>
          </div>

          {/* Search and Filters Glass Card */}
          <div className="glass-card p-5 rounded-3xl space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary w-4.5 h-4.5" />
              <input
                type="text"
                placeholder="Search district, spot or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-slate-dark"
              />
            </div>

            {/* State Horizontal Slider Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Filter States</span>
                <span className="text-primary flex items-center gap-0.5">
                  <Layers className="w-3 h-3" />
                  Swipe
                </span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 scroll-smooth">
                {STATES.map((st) => {
                  const isSelected = selectedState === st;
                  return (
                    <motion.button
                      key={st}
                      whileHover={{ scale: 1.05, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedState(st)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25"
                          : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                      }`}
                    >
                      {st}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Destination List Panel */}
          <div className="flex-grow glass-card rounded-[24px] overflow-y-auto p-4 space-y-3 custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200/40 pb-3 mb-2 px-1 shrink-0">
              <h3 className="text-xs font-black text-slate-dark uppercase tracking-wider">
                Available Expeditions ({filteredDestinations.length})
              </h3>
              <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                Survey Active
              </span>
            </div>

            <div className="flex-grow space-y-3 overflow-y-auto pr-1">
              {filteredDestinations.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Navigation className="w-11 h-11 mx-auto mb-3 opacity-40 text-primary animate-bounce" />
                  <p className="text-sm font-bold text-slate-700">No destinations found</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting your state pill filter or search phrase.</p>
                </div>
              ) : (
                filteredDestinations.map((dest) => {
                  const isSelected = selectedDest?.id === dest.id;
                  const totalB =
                    dest.baseBudget.transportation +
                    dest.baseBudget.accommodation +
                    dest.baseBudget.food +
                    dest.baseBudget.entryTickets +
                    dest.baseBudget.miscellaneous;

                  return (
                    <motion.div
                      key={dest.id}
                      onClick={() => setSelectedDest(dest)}
                      whileHover={{ y: -2 }}
                      className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-3.5 items-center relative overflow-hidden ${
                        isSelected
                          ? "bg-white border-primary shadow-lg shadow-primary/5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-primary before:to-secondary"
                          : "bg-white border-slate-200/60 hover:border-slate-300 hover:shadow-md"
                      }`}
                    >
                      {/* Destination Thumbnail image */}
                      <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100 relative">
                        <img
                          src={getDestinationImage(dest.name, dest.tags, "thumb")}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-1 flex-grow min-w-0 pr-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-[9px] font-bold rounded-full uppercase tracking-wider truncate">
                            {dest.state}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 truncate flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" />
                            {dest.district}
                          </span>
                        </div>
                        <h4 className="text-sm font-display font-bold text-slate-dark truncate">{dest.name}</h4>
                        <p className="text-xs text-slate-400 line-clamp-1 font-light">{dest.overview}</p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1 shrink-0 ml-1">
                        <div className="text-sm font-black text-primary">₹{totalB.toLocaleString("en-IN")}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Est. Cost</div>
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-ping"></span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: SPOT SPECIFICATIONS & CALCULATORS (7 COLS) */}
        <div className="lg:col-span-7 h-[calc(100vh-140px)] min-h-[550px] overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            {selectedDest ? (
              <motion.div
                key={selectedDest.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pb-8"
              >
                {/* 1. High-Definition Header Banner Panel */}
                <div className="relative h-72 md:h-96 rounded-[32px] overflow-hidden border border-white shadow-xl group">
                  <img
                    src={getDestinationImage(selectedDest.name, selectedDest.tags, "hd")}
                    alt={selectedDest.name}
                    className="w-full h-full object-cover transition-transform duration-[12000ms] group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Glassmorphic UHD 4K Lightbox Trigger */}
                  <button
                    onClick={() => setPreviewImgUrl(getDestinationImage(selectedDest.name, selectedDest.tags, "original"))}
                    className="absolute top-5 right-5 px-4 py-2.5 bg-slate-dark/80 hover:bg-slate-dark backdrop-blur-md text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition active:scale-95 border border-white/10 cursor-pointer shadow-lg z-10"
                  >
                    <Camera className="w-4 h-4 text-secondary" />
                    Original UHD 4K View
                  </button>

                  {/* Dark gradient overlay bottom-to-top */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-dark via-slate-dark/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/20">
                        {selectedDest.state}
                      </span>
                      <span className="text-white/90 text-xs font-bold flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
                        <MapPin className="w-3.5 h-3.5 text-secondary" />
                        {selectedDest.district} District
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight drop-shadow-md">
                      {selectedDest.name}
                    </h2>
                  </div>
                </div>

                {/* Destination Quick Description & Choose Action Card */}
                <div className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-center gap-5">
                  <div className="space-y-1 text-left flex-grow">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Scenic Overview</span>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl font-light">{selectedDest.overview}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onSelectPreference(selectedDest)}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-xs font-bold shadow-md shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 cursor-pointer transition-all duration-300"
                  >
                    <Check className="w-4 h-4" />
                    Lock as Preference
                  </motion.button>
                </div>

                {/* Highlights Grid Banner */}
                <div className="glass-card p-5 rounded-3xl grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Best Season
                    </div>
                    <div className="text-xs font-bold text-slate-dark">{selectedDest.bestSeason}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-secondary" />
                      Climate
                    </div>
                    <div className="text-xs font-bold text-slate-dark">{selectedDest.climate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      Duration
                    </div>
                    <div className="text-xs font-bold text-slate-dark">{selectedDest.recommendedDuration}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-success" />
                      Distance
                    </div>
                    <div className="text-xs font-bold text-slate-dark">~{selectedDest.travelDistanceKm} Km</div>
                  </div>
                </div>

                {/* 2. Core specifications / Details Card */}
                <div className="glass-card p-6 rounded-[28px] space-y-6">
                  {/* Category Classification */}
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-primary" />
                      Spot Classification
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: "isHillStation", emoji: "⛰️", label: "Hill Station" },
                        { key: "isBeach", emoji: "🏖️", label: "Beach Shore" },
                        { key: "isWaterfall", emoji: "🌊", label: "Waterfalls" },
                        { key: "isForestOrNationalPark", emoji: "🌳", label: "Forests & Parks" },
                        { key: "isTempleOrMuseum", emoji: "🛕", label: "Temples & Heritage" },
                        { key: "isViewpoint", emoji: "🌅", label: "Scenic Viewpoint" },
                      ].map((tag) => {
                        const isTagged = !!(selectedDest.tags as any)[tag.key];
                        if (!isTagged) return null;
                        const bgImg = getClassificationImage(tag.key, "thumb");
                        return (
                          <motion.div
                            key={tag.key}
                            whileHover={{ scale: 1.03, y: -2 }}
                            className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-100 shadow-sm group select-none"
                          >
                            <img
                              src={bgImg}
                              alt={tag.label}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-all duration-300" />
                            <div className="absolute inset-0 p-3 flex flex-col justify-end text-left">
                              <span className="text-lg mb-1">{tag.emoji}</span>
                              <span className="text-[11px] font-extrabold text-white tracking-wide leading-none">{tag.label}</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Famous Attractions & Activities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200/40">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-dark uppercase tracking-widest flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-primary" />
                        Famous Attractions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {selectedDest.famousAttractions.map((attr, i) => {
                          const attrImg = getAttractionImage(attr, "thumb");
                          return (
                            <motion.div
                              key={i}
                              whileHover={{ scale: 1.02, y: -2 }}
                              onClick={() => setPreviewImgUrl(getAttractionImage(attr, "hd"))}
                              className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer group"
                            >
                              <img
                                src={attrImg}
                                alt={attr}
                                className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-115"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
                              
                              {/* Glass overlay on hover */}
                              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                              <div className="absolute bottom-3 left-3 right-3 text-left">
                                <span className="text-[10px] font-extrabold text-secondary uppercase tracking-widest block mb-0.5 opacity-90">
                                  Spot #{i + 1}
                                </span>
                                <h5 className="text-xs font-black text-white leading-tight drop-shadow-sm group-hover:text-secondary transition-colors">
                                  {attr}
                                </h5>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-slate-dark uppercase tracking-widest flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        Activities Available
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { key: 'trekking', emoji: '🥾', label: 'Trekking' },
                          { key: 'boating', emoji: '⛵', label: 'Boating' },
                          { key: 'camping', emoji: '🏕️', label: 'Camping' },
                          { key: 'shopping', emoji: '🛍️', label: 'Shopping' }
                        ].map((act) => {
                          const isAvailable = !!(selectedDest.activities as any)[act.key];
                          const actImg = getActivityImage(act.key, "thumb");
                          return (
                            <motion.div 
                              key={act.key}
                              whileHover={isAvailable ? { scale: 1.03, y: -2 } : {}}
                              onClick={() => {
                                if (isAvailable) {
                                  setPreviewImgUrl(getActivityImage(act.key, "hd"));
                                }
                              }}
                              className={`relative aspect-[16/11] rounded-2xl overflow-hidden border transition-all ${
                                isAvailable
                                  ? "border-slate-100 shadow-sm cursor-pointer group"
                                  : "border-slate-100/50 opacity-40 grayscale select-none"
                              }`}
                            >
                              <img
                                src={actImg}
                                alt={act.label}
                                className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                              />
                              
                              {/* Dark overlay */}
                              <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/30 transition-colors" />

                              {/* Interactive active overlay */}
                              {isAvailable && (
                                <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-success/90 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </div>
                              )}

                              <div className="absolute inset-0 p-3 flex flex-col justify-end text-left z-10">
                                <span className="text-lg mb-1 leading-none">{act.emoji}</span>
                                <h5 className="text-xs font-black text-white tracking-wide uppercase leading-none">
                                  {act.label}
                                </h5>
                                <span className="text-[8px] font-bold text-white/85 uppercase tracking-wider mt-1 block">
                                  {isAvailable ? "Available" : "Not Offered"}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* History, Specialties & Nearby Places */}
                  <div className="space-y-5 pt-5 border-t border-slate-200/40">
                    <div>
                      <h4 className="text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-accent" />
                        Historical Background
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-light">{selectedDest.history}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-3 bg-white/40 border border-slate-200/40 rounded-2xl">
                        <h5 className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                          🍲 Food Specialties
                        </h5>
                        <ul className="space-y-1.5">
                          {selectedDest.foodSpecialities.map((food, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                              <span className="text-[8px] text-primary">●</span>
                              {food}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-white/40 border border-slate-200/40 rounded-2xl">
                        <h5 className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2">
                          🎬 Film Spots
                        </h5>
                        <ul className="space-y-1.5">
                          {selectedDest.shootingLocations.map((loc, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                              <span className="text-[8px] text-secondary">🎥</span>
                              {loc}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-white/40 border border-slate-200/40 rounded-2xl">
                        <h5 className="text-[10px] font-bold text-accent uppercase tracking-wider mb-2">
                          📍 Nearby Places
                        </h5>
                        <ul className="space-y-1.5">
                          {selectedDest.nearbyPlaces.map((near, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-1 font-semibold">
                              <span className="text-[8px] text-accent">★</span>
                              {near}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* High-Definition Attractions Gallery with UHD interactive view */}
                  <div className="pt-5 border-t border-slate-200/40">
                    <h4 className="text-xs font-bold text-slate-dark uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-primary" />
                      Visual Perspectives & Attractions (HD)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {getDestinationGallery(selectedDest.name, selectedDest.tags).map((imgUrl, i) => (
                        <div
                          key={i}
                          onClick={() => setPreviewImgUrl(imgUrl)}
                          className="relative aspect-video rounded-xl overflow-hidden border border-slate-200/60 group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <img
                            src={imgUrl}
                            alt={`${selectedDest.name} perspective ${i + 1}`}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-dark/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-[9px] font-bold text-white bg-black/60 px-2.5 py-1 rounded-xl border border-white/20">
                              View UHD
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2.5 italic text-center">Click any photo to preview in uncompressed ultra-high-definition 4K resolution.</p>
                  </div>

                  {/* Safety Protocols */}
                  <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Critical Safety Tips for Student Groups
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 font-semibold">
                      {selectedDest.safetyTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-0.5 text-amber-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. High-Fidelity Dynamic Budget Estimator Card */}
                <div className="glass-card p-6 rounded-[28px] space-y-5">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="text-base font-display font-bold text-slate-dark">Dynamic Budget Estimator</h3>
                      <p className="text-xs text-slate-400">Calculated approximate trip share percentages per student</p>
                    </div>
                  </div>

                  {/* Budget breakdown progress items */}
                  {(() => {
                    const trans = selectedDest.baseBudget.transportation;
                    const stay = selectedDest.baseBudget.accommodation;
                    const food = selectedDest.baseBudget.food;
                    const tickets = selectedDest.baseBudget.entryTickets;
                    const misc = selectedDest.baseBudget.miscellaneous;
                    const total = trans + stay + food + tickets + misc;

                    return (
                      <div className="space-y-4">
                        {/* 1. Transportation */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Bus className="w-3.5 h-3.5 text-primary" />
                              Transport Cost
                            </span>
                            <span>₹{trans} ({Math.round((trans / total) * 100)}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-1000" 
                              style={{ width: `${(trans / total) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* 2. Accommodation */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Hotel className="w-3.5 h-3.5 text-secondary" />
                              Stay Lodging
                            </span>
                            <span>₹{stay} ({Math.round((stay / total) * 100)}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-secondary rounded-full transition-all duration-1000" 
                              style={{ width: `${(stay / total) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* 3. Food */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Utensils className="w-3.5 h-3.5 text-accent" />
                              Catering & Meals
                            </span>
                            <span>₹{food} ({Math.round((food / total) * 100)}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full transition-all duration-1000" 
                              style={{ width: `${(food / total) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* 4. Tickets */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Ticket className="w-3.5 h-3.5 text-success" />
                              Entry Tickets
                            </span>
                            <span>₹{tickets} ({Math.round((tickets / total) * 100)}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-success rounded-full transition-all duration-1000" 
                              style={{ width: `${(tickets / total) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* 5. Miscellaneous */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                              Miscellaneous / Emergency
                            </span>
                            <span>₹{misc} ({Math.round((misc / total) * 100)}%)</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full transition-all duration-1000" 
                              style={{ width: `${(misc / total) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between items-center bg-gradient-to-r from-primary to-secondary text-white p-5 rounded-2xl mt-6 shadow-md shadow-primary/10">
                          <span className="text-xs sm:text-sm font-bold">Total Estimated Cost (Per Student)</span>
                          <span className="text-xl sm:text-2xl font-black font-mono">
                            ₹{total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 4. AI Travel Guide Card */}
                <div className="glass-card p-6 rounded-[28px] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                      <h3 className="text-base font-display font-bold text-slate-dark">AI Professional Travel Guide</h3>
                    </div>
                    {loadingAi && (
                      <span className="text-xs font-bold text-primary flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        Consulting Travel AI...
                      </span>
                    )}
                  </div>

                  <div className="bg-white/60 p-5 rounded-2xl border border-slate-200/40 text-xs sm:text-sm leading-relaxed prose prose-stone max-w-none">
                    {loadingAi ? (
                      <div className="space-y-3.5 py-4">
                        <div className="h-3.5 bg-slate-200/60 rounded-md w-3/4 animate-pulse"></div>
                        <div className="h-3.5 bg-slate-200/60 rounded-md w-5/6 animate-pulse"></div>
                        <div className="h-3.5 bg-slate-200/60 rounded-md w-2/3 animate-pulse"></div>
                        <div className="h-3.5 bg-slate-200/60 rounded-md w-1/2 animate-pulse"></div>
                      </div>
                    ) : aiError ? (
                      <div className="flex items-start gap-2.5 text-slate-500 py-2">
                        <Info className="w-5 h-5 text-primary shrink-0" />
                        <div>
                          <p className="font-bold text-slate-700">Offline Assistant Mode</p>
                          <p className="text-xs mt-1 text-slate-400 leading-relaxed font-light">{aiError}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="animate-fade-in text-slate-700 font-medium">{renderMarkdown(aiGuide)}</div>
                    )}
                  </div>
                </div>

                {/* Final Choice Action Card */}
                <div className="bg-gradient-to-tr from-slate-dark to-slate-800 p-6 rounded-[28px] flex flex-col sm:flex-row justify-between items-center gap-5 border border-white/5 shadow-xl">
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">Ready to submit your vote?</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-light">Proceeding locks in {selectedDest.name} and lets you fill out requirements.</p>
                  </div>
                  <button
                    onClick={() => onSelectPreference(selectedDest)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-xs font-bold cursor-pointer transition shadow-lg active:scale-95"
                  >
                    Select {selectedDest.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full glass-card flex flex-col justify-center items-center py-24 text-slate-400 text-center p-6 rounded-[32px]">
                <Compass className="w-16 h-16 opacity-30 text-primary animate-spin" />
                <h3 className="text-lg font-bold text-slate-700 mt-4 font-display">Loading destinations...</h3>
                <p className="text-xs text-slate-400 mt-1">Please wait while the tourist directory finishes compiling.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* HD ORIGINAL QUALITY IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {previewImgUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImgUrl(null)}
            className="fixed inset-0 bg-slate-dark/95 z-50 flex flex-col justify-center items-center p-4 cursor-zoom-out"
          >
            <div className="absolute top-5 right-5 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              <a
                href={previewImgUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white text-xs font-bold rounded-xl transition shadow-md border border-white/10"
              >
                Open Original File (UHD 4K)
              </a>
              <button
                onClick={() => setPreviewImgUrl(null)}
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition border border-white/10 cursor-pointer animate-pulse"
              >
                ✕
              </button>
            </div>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="max-w-5xl w-full max-h-[80vh] flex justify-center items-center rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={previewImgUrl}
                alt="High Definition original preview"
                className="max-w-full max-h-[80vh] object-contain rounded-3xl border border-white/10"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <div className="mt-5 text-center text-white/60 text-xs">
              <p className="font-bold text-white text-sm">Original Ultra High Definition (UHD 4K Quality)</p>
              <p className="mt-1 font-light">Uncompressed travel photography source</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
