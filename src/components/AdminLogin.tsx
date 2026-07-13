/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Compass, ShieldCheck, Lock, User, ArrowLeft, ArrowRight } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: (token: string, username: string) => void;
  onBackToStudent: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToStudent }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      onLoginSuccess(data.token, data.username);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Left Column: Breathtaking Trip Adventure Picture */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 relative bg-slate-dark overflow-hidden"
      >
        <img
          src="/src/assets/images/trip_adventure_1783824114464.jpg"
          alt="Trip Adventure"
          className="w-full h-full object-cover opacity-80 transition-transform duration-[12000ms] hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Dark elegant blue gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-dark/95 via-primary/20 to-transparent flex flex-col justify-between p-12">
          {/* Logo / App Name */}
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Compass className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white">CampusExplorer</span>
          </div>

          {/* Inspirational travel quote */}
          <div className="space-y-4 max-w-md">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">College Union Trip Planner</span>
            <h1 className="text-4xl font-display font-black text-white leading-tight">
              Crafting unforgettable college journey memories.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed font-light">
              Plan and coordinate the perfect travel routes, accommodation budgets, and exciting sightseeing spots across Kerala, Tamil Nadu, Karnataka, and beyond.
            </p>
          </div>

          {/* Decorative tag */}
          <div className="text-white/40 text-xs font-mono">
            © CampusExplorer Admin Portal
          </div>
        </div>
      </motion.div>

      {/* Right Column: Clean, Polished Administrative Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Mobile trip picture header (Only visible on small screens) */}
          <div className="block md:hidden mb-8 rounded-2xl overflow-hidden relative h-48 shadow-lg">
            <img
              src="/src/assets/images/trip_adventure_1783824114464.jpg"
              alt="Trip Adventure Mobile Banner"
              className="w-full h-full object-cover opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-dark/95 to-transparent flex flex-col justify-end p-4">
              <span className="text-[10px] text-secondary font-extrabold uppercase tracking-wider">CampusExplorer</span>
              <h2 className="text-xl font-display font-bold text-white">Admin Portal</h2>
            </div>
          </div>

          {/* Desktop/Tablet clean header */}
          <div className="hidden md:block">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="h-14 w-14 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <ShieldCheck className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="mt-6 text-3xl font-display font-extrabold text-slate-dark tracking-tight">
              Welcome back, Admin
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Access the travel preferences, survey statistics, and final destination choices.
            </p>
          </div>

          {/* Login Form Box */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mt-8"
          >
            <div className="glass-card py-8 px-6 shadow-xl rounded-[24px] border border-white/60 sm:px-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-xs text-error font-semibold animate-pulse">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="adminUsername" className="block text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary" />
                    Username
                  </label>
                  <input
                    id="adminUsername"
                    type="text"
                    required
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm transition"
                  />
                </div>

                <div>
                  <label htmlFor="adminPassword" className="block text-xs font-bold text-slate-dark uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    Password
                  </label>
                  <input
                    id="adminPassword"
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-sm transition"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/95 hover:to-secondary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Secure Login
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-4 flex justify-center">
                <button
                  onClick={onBackToStudent}
                  className="text-xs font-bold text-primary hover:text-slate-dark flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Return to Student Registration
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
