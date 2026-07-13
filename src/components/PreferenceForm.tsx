/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass, 
  CheckCircle, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Bus, 
  Hotel, 
  Utensils, 
  ClipboardList, 
  Info, 
  HelpCircle,
  Sparkle,
  BookmarkCheck,
  Plane,
  Heart,
  MapPin
} from "lucide-react";
import { StudentRegistration, TouristDestination, StudentPreference } from "../types";
import { renderMarkdown } from "../utils/markdown";

interface PreferenceFormProps {
  student: StudentRegistration;
  selectedDestination: TouristDestination;
  onBackToExplorer: () => void;
  onCompleteSubmission: () => void;
}

const BUDGETS = [
  "Low Budget (Under ₹2,000)",
  "Medium Budget (₹2,000 - ₹3,500)",
  "High Budget (₹3,500 - ₹4,500)",
];

const TRANSPORTS = ["Bus", "Train", "Flight", "Private Cab"];
const ACCOMMODATIONS = ["Shared Dormitory", "Standard Hotel", "Luxury Resort", "Homestay"];
const FOODS = ["Veg Only", "Non-Veg Preferred", "No Preference"];
const ACTIVITIES = ["Trekking", "Boating", "Camping", "Shopping", "Sightseeing", "Photography", "Campfire", "Heritage Walk"];

export default function PreferenceForm({ student, selectedDestination, onBackToExplorer, onCompleteSubmission }: PreferenceFormProps) {
  // Form values pre-populated
  const [budgetRange, setBudgetRange] = useState(BUDGETS[1]);
  const [transport, setTransport] = useState(TRANSPORTS[0]);
  const [accommodation, setAccommodation] = useState(ACCOMMODATIONS[0]);
  const [food, setFood] = useState(FOODS[2]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["Sightseeing", "Photography"]);
  const [suggestions, setSuggestions] = useState("");

  // Control flow
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [submissionComplete, setSubmissionComplete] = useState(false);

  const handleActivityToggle = (act: string) => {
    setSelectedActivities((prev) =>
      prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const preferencePayload: Partial<StudentPreference> = {
      registerNumber: student.registerNumber,
      studentName: student.studentName,
      department: student.department,
      year: student.year,
      preferredState: selectedDestination.state,
      preferredDestination: selectedDestination.name,
      budgetRange,
      activities: selectedActivities,
      transportPreference: transport,
      accommodationPreference: accommodation,
      foodPreference: food,
      suggestions: suggestions.trim(),
    };

    try {
      // 1. Submit preference to server
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferencePayload),
      });

      let data: any = {};
      const responseText = await response.text();
      if (responseText && responseText.trim()) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse submissions response:", e);
        }
      }
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit preferences.");
      }

      // 2. Fetch AI Recommendation
      setLoadingAi(true);
      setSubmissionComplete(true);

      const aiResponse = await fetch("/api/ai/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferencePayload),
      });

      let aiRecommendationText = "";
      const aiResponseText = await aiResponse.text();
      if (aiResponse.ok && aiResponseText && aiResponseText.trim()) {
        try {
          const aiData = JSON.parse(aiResponseText);
          aiRecommendationText = aiData.recommendation || "";
        } catch (e) {
          console.error("Failed to parse AI recommendation response:", e);
        }
      }

      if (aiRecommendationText) {
        setAiRecommendation(aiRecommendationText);
      } else {
        setAiRecommendation("Preferences logged successfully! The AI travel engine could not be reached, but your submission was saved.");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "An error occurred during submission.");
      setSubmissionComplete(false);
    } finally {
      setIsSubmitting(false);
      setLoadingAi(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-start py-10 font-sans text-slate-dark relative overflow-hidden bg-gradient-to-tr from-slate-50 to-blue-50/50">
      
      {/* Background visual graphics */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-4 z-10">
        
        {/* Navigation / Header Title */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBackToExplorer}
            disabled={submissionComplete}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:text-primary cursor-pointer disabled:opacity-40 hover:border-primary/40 transition-all flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-black text-slate-dark leading-none">Configure Preferences</h1>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">Fine-tune details for your journey to {selectedDestination.name}</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!submissionComplete ? (
            // Preferences Form
            <motion.div
              key="preference-form"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="glass-card p-6 sm:p-10 rounded-[32px] border border-white/60 shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {submitError && (
                  <div className="p-4 bg-error/10 border border-error/20 rounded-2xl text-xs text-error font-bold animate-pulse">
                    {submitError}
                  </div>
                )}

                {/* Pre-populated selected spot reference */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-5 rounded-2xl border border-primary/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Selected Spot Choice</span>
                    <span className="font-display font-black text-slate-dark text-lg flex items-center gap-1.5">
                      <MapPin className="w-5 h-5 text-secondary animate-bounce" />
                      {selectedDestination.name} ({selectedDestination.state})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onBackToExplorer}
                    className="w-full sm:w-auto px-4.5 py-2.5 bg-white border border-slate-200 text-primary rounded-xl font-bold hover:bg-slate-50 cursor-pointer transition shadow-sm text-xs"
                  >
                    Change Destination
                  </button>
                </div>

                {/* Form controls grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Budget Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-dark uppercase tracking-wider block">
                      Preferred Budget Class (Max ₹4,500)
                    </label>
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                    >
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Transport Preference */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-dark uppercase tracking-wider block flex items-center gap-1.5">
                      <Bus className="w-3.5 h-3.5 text-primary" />
                      Transport Preference
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {TRANSPORTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTransport(t)}
                          className={`py-3 px-1 rounded-xl text-xs font-bold border transition duration-300 ${
                            transport === t
                              ? "bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-md shadow-primary/25"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Accommodation style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-dark uppercase tracking-wider block flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5 text-primary" />
                      Accommodation Style
                    </label>
                    <select
                      value={accommodation}
                      onChange={(e) => setAccommodation(e.target.value)}
                      className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                    >
                      {ACCOMMODATIONS.map((acc) => (
                        <option key={acc} value={acc}>
                          {acc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Food preference */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-dark uppercase tracking-wider block flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-primary" />
                      Food Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FOODS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFood(f)}
                          className={`py-3 px-1 rounded-xl text-xs font-bold border transition duration-300 ${
                            food === f
                              ? "bg-gradient-to-r from-primary to-secondary border-transparent text-white shadow-md shadow-primary/25"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activities Checklist */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-dark uppercase tracking-wider block flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-primary" />
                    Preferred Activities (Select Multiple)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {ACTIVITIES.map((act) => {
                      const selected = selectedActivities.includes(act);
                      return (
                        <button
                          key={act}
                          type="button"
                          onClick={() => handleActivityToggle(act)}
                          className={`py-3 px-4 border rounded-xl text-xs font-bold text-left transition duration-300 flex items-center justify-between ${
                            selected
                              ? "bg-slate-dark border-transparent text-white shadow-md"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {act}
                          {selected && <CheckCircle className="w-4 h-4 text-secondary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Suggestions */}
                <div className="space-y-2 pt-2">
                  <label htmlFor="suggestions" className="text-xs font-bold text-slate-dark uppercase tracking-wider block">
                    Specific Requests & Travel Suggestions
                  </label>
                  <textarea
                    id="suggestions"
                    rows={3}
                    placeholder="E.g., Dietary constraints, photography walk preferences, specific trek paths..."
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                    className="block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm transition"
                  ></textarea>
                </div>

                {/* Submit actions */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <button
                    type="button"
                    onClick={onBackToExplorer}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-3.5 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-sm cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
                  >
                    Back to Sights
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/35 cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Recording choice...
                      </>
                    ) : (
                      <>
                        Submit Preferences
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            // Success & AI Recommendation Screen
            <motion.div
              key="success-card"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 sm:p-10 rounded-[36px] text-center space-y-8 border border-white/60 shadow-xl"
            >
              <div className="h-20 w-20 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                <CheckCircle className="w-10 h-10 text-white animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-display font-black text-slate-dark tracking-tight">Preferences Lodged!</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto">
                  Thank you, <span className="text-primary font-bold">{student.studentName}</span>. Your travel wishes have been recorded securely in our college cloud database.
                </p>
              </div>

              {/* AI Recommendation display */}
              <div className="bg-white/60 p-6 rounded-[24px] border border-slate-200/40 text-left space-y-4 max-w-2xl mx-auto shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                    <h3 className="text-base font-display font-bold text-slate-dark">AI Personal Travel Itinerary</h3>
                  </div>
                  {loadingAi && (
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      Structuring Itinerary...
                    </span>
                  )}
                </div>

                <div className="prose prose-stone text-slate-600 text-xs sm:text-sm leading-relaxed max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {loadingAi ? (
                    <div className="space-y-4 py-3">
                      <div className="h-3.5 bg-slate-200/60 rounded-md w-3/4 animate-pulse"></div>
                      <div className="h-3.5 bg-slate-200/60 rounded-md w-5/6 animate-pulse"></div>
                      <div className="h-3.5 bg-slate-200/60 rounded-md w-2/3 animate-pulse"></div>
                      <div className="h-3.5 bg-slate-200/60 rounded-md w-1/2 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="animate-fade-in font-medium text-slate-700 leading-relaxed">
                      {renderMarkdown(aiRecommendation)}
                    </div>
                  )}
                </div>
              </div>

              {/* Reset / Return Button */}
              <div className="pt-2">
                <button
                  onClick={onCompleteSubmission}
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Return to Student Portal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
