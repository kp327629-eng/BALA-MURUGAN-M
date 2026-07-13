/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { jsPDF } from "jspdf";
import {
  Compass, LayoutDashboard, FileSpreadsheet, FileDown, Plus, Edit, Trash2,
  Search, Filter, LogOut, CheckCircle, MapPin, Sparkles, GraduationCap,
  Calendar, AlertCircle, X, ChevronRight, Download, Printer, ArrowLeft, BarChart3, Database
} from "lucide-react";
import { TouristDestination, StudentPreference } from "../types";

const STATES = ["All States", "Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry"];

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  destinations: TouristDestination[];
  onRefreshDestinations: () => void;
}

type Tab = "analytics" | "submissions" | "database";

export default function AdminDashboard({ token, onLogout, destinations, onRefreshDestinations }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [submissions, setSubmissions] = useState<StudentPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Submissions filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterYear, setFilterYear] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [filterDest, setFilterDest] = useState("All");

  // Selected student for detail popup/print
  const [selectedStudent, setSelectedStudent] = useState<StudentPreference | null>(null);

  // Database editor modal state
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [dbEditDest, setDbEditDest] = useState<Partial<TouristDestination> | null>(null);
  const [dbError, setDbError] = useState("");

  // Load submissions
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/submissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load submissions.");
      }
      const data = await response.json();
      setSubmissions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error fetching records.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (regNo: string) => {
    if (!window.confirm(`Are you sure you want to remove the submission for student ${regNo}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/submissions/${regNo}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSubmissions((prev) => prev.filter((s) => s.registerNumber !== regNo));
        if (selectedStudent?.registerNumber === regNo) {
          setSelectedStudent(null);
        }
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred deleting record.");
    }
  };

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.registerNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === "All" || sub.department === filterDept;
    const matchesYear = filterYear === "All" || sub.year === filterYear;
    const matchesState = filterState === "All" || sub.preferredState === filterState;
    const matchesDest = filterDest === "All" || sub.preferredDestination === filterDest;

    return matchesSearch && matchesDept && matchesYear && matchesState && matchesDest;
  });

  // Extract unique filters from current submissions data
  const departmentsList = Array.from(new Set(submissions.map((s) => s.department))) as string[];
  const yearsList = Array.from(new Set(submissions.map((s) => s.year))) as string[];
  const statesList = Array.from(new Set(submissions.map((s) => s.preferredState))) as string[];
  const destsList = Array.from(new Set(submissions.map((s) => s.preferredDestination))) as string[];

  // ----------------------------------------------------
  // ANALYTICS & AGGREGATIONS
  // ----------------------------------------------------
  const totalSubmissions = submissions.length;

  // Dept counts
  const deptStats = submissions.reduce((acc: { [key: string]: number }, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Year counts
  const yearStats = submissions.reduce((acc: { [key: string]: number }, s) => {
    acc[s.year] = (acc[s.year] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // State counts
  const stateStats = submissions.reduce((acc: { [key: string]: number }, s) => {
    acc[s.preferredState] = (acc[s.preferredState] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Destination counts
  const destStats = submissions.reduce((acc: { [key: string]: number }, s) => {
    acc[s.preferredDestination] = (acc[s.preferredDestination] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Budget counts
  const budgetStats = submissions.reduce((acc: { [key: string]: number }, s) => {
    const key = s.budgetRange || "Medium Budget (₹2,000 - ₹3,500)";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Find top items
  const getMostSelected = (stats: { [key: string]: number }) => {
    let topKey = "N/A";
    let maxVal = 0;
    Object.entries(stats).forEach(([k, v]) => {
      if (v > maxVal) {
        maxVal = v;
        topKey = k;
      }
    });
    return { name: topKey, count: maxVal };
  };

  const topState = getMostSelected(stateStats);
  const topDest = getMostSelected(destStats);

  // ----------------------------------------------------
  // EXPORT UTILITIES (CSV, EXCEL)
  // ----------------------------------------------------
  const triggerExport = (format: "csv" | "excel") => {
    const headers = [
      "Register Number",
      "Student Name",
      "Department",
      "Year",
      "Preferred State",
      "Preferred Destination",
      "Budget Class",
      "Activities",
      "Suggestions",
      "Submission Date",
    ];

    const rows = filteredSubmissions.map((s) => [
      s.registerNumber,
      s.studentName,
      s.department,
      s.year,
      s.preferredState,
      s.preferredDestination,
      s.budgetRange,
      s.activities ? s.activities.join(" | ") : "",
      s.suggestions ? s.suggestions.replace(/\n/g, " ") : "",
      s.submissionDate,
    ]);

    let content = "";
    let mimeType = "";
    let fileExtension = "";

    if (format === "csv") {
      content = [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");
      mimeType = "text/csv;charset=utf-8;";
      fileExtension = ".csv";
    } else {
      // Excel tab-delimited
      content = [headers, ...rows].map((e) => e.map((val) => `"${val}"`).join("\t")).join("\n");
      mimeType = "application/vnd.ms-excel;charset=utf-8;";
      fileExtension = ".xls";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `college_trip_submissions_${new Date().toISOString().slice(0, 10)}${fileExtension}`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // PRINT PDF REPORT CORES
  // ----------------------------------------------------
  // ----------------------------------------------------
  // PRINT PDF REPORT CORES
  // ----------------------------------------------------
  const downloadSingleStudentPDF = (student: StudentPreference) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Color Palette matching Natural and Earth theme
    const primaryColor = [47, 62, 34]; // Forest Dark
    const secondaryColor = [139, 153, 127]; // Sage
    const accentColor = [190, 140, 80]; // Earth
    const darkTextColor = [33, 41, 28]; // Dark Charcoal/Olive
    const lightBgColor = [249, 250, 248]; // Soft off-white
    const grayTextColor = [100, 116, 139]; // Slate Gray

    // Page Dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Header Background Accent Bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("COLLEGE TRIP REGISTRATION SUMMARY", margin, 18);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(200, 210, 195);
    doc.text("Student Preference Record Sheet", margin, 26);

    // Header Meta Right Alignment
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`System Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, 18, { align: "left" });
    doc.text(`Sub. ID: ${student.registerNumber}`, pageWidth - margin - 50, 26, { align: "left" });

    let currentY = 50;

    // --- Section 1: Student Identity ---
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.rect(margin, currentY, contentWidth, 48, "F");
    doc.setDrawColor(233, 237, 201); // Light border
    doc.rect(margin, currentY, contentWidth, 48, "S");

    // Green Identity Line
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, currentY, 3, 48, "F");

    // Text Content
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("STUDENT IDENTITY", margin + 8, currentY + 8);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.studentName, margin + 8, currentY + 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Roll Number: `, margin + 8, currentY + 28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.registerNumber, margin + 35, currentY + 28);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Department: `, margin + 8, currentY + 36);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.department, margin + 35, currentY + 36);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Academic Year: `, margin + 8, currentY + 44);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.year, margin + 35, currentY + 44);

    currentY += 56;

    // --- Section 2: Travel Preferences ---
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.rect(margin, currentY, contentWidth, 54, "F");
    doc.setDrawColor(233, 237, 201);
    doc.rect(margin, currentY, contentWidth, 54, "S");

    // Earth Identity Line
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(margin, currentY, 3, 54, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("LANDED TRIP PREFERENCES", margin + 8, currentY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Destination Spot: `, margin + 8, currentY + 18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${student.preferredDestination} (${student.preferredState})`, margin + 45, currentY + 18);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Budget Category: `, margin + 8, currentY + 26);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.budgetRange, margin + 45, currentY + 26);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Mode of Transport: `, margin + 8, currentY + 34);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.transportPreference, margin + 45, currentY + 34);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Lodging Style: `, margin + 8, currentY + 42);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.accommodationPreference, margin + 45, currentY + 42);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(`Dining Preference: `, margin + 8, currentY + 50);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    doc.text(student.foodPreference, margin + 45, currentY + 50);

    currentY += 62;

    // --- Section 3: Group Activities ---
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.rect(margin, currentY, contentWidth, 24, "F");
    doc.setDrawColor(233, 237, 201);
    doc.rect(margin, currentY, contentWidth, 24, "S");

    // Sage Identity Line
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.rect(margin, currentY, 3, 24, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("GROUP ACTIVITIES PREFERRED", margin + 8, currentY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    const acts = student.activities && student.activities.length > 0 
      ? student.activities.join("  •  ") 
      : "No specific group activities selected.";
    doc.text(acts, margin + 8, currentY + 16);

    currentY += 32;

    // --- Section 4: Suggestions / Notes ---
    const rawNotes = student.suggestions || "No extra preferences or specific criteria requested.";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const splitNotes = doc.splitTextToSize(`"${rawNotes}"`, contentWidth - 16);
    const notesHeight = Math.max(16, splitNotes.length * 5) + 12;

    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.rect(margin, currentY, contentWidth, notesHeight, "F");
    doc.setDrawColor(233, 237, 201);
    doc.rect(margin, currentY, contentWidth, notesHeight, "S");

    // Silver Identity Line
    doc.setFillColor(180, 180, 180);
    doc.rect(margin, currentY, 3, notesHeight, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text("STUDENT SPECIFIC SUGGESTIONS", margin + 8, currentY + 8);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    
    let textY = currentY + 14;
    for (let i = 0; i < splitNotes.length; i++) {
      doc.text(splitNotes[i], margin + 8, textY);
      textY += 5;
    }

    // --- Footer ---
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
    doc.text(
      "Generated Automatically by College Trip Planner Centralized Storage • Page 1 of 1",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );

    // Save PDF
    const filename = `Student_Profile_${student.studentName.replace(/\s+/g, "_")}_${student.registerNumber}.pdf`;
    doc.save(filename);
  };

  const printSingleStudent = (student: StudentPreference) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Student Preference Report - ${student.studentName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #334155; }
            .header { border-bottom: 3px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 24px; font-weight: 800; color: #1e293b; }
            .meta { font-size: 12px; color: #64748b; text-align: right; }
            .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .card { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; }
            .card-title { font-size: 11px; font-weight: 700; color: #94a3b8; uppercase; tracking-wider; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
            .value { font-size: 15px; font-weight: 600; color: #0f172a; }
            .activities { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
            .activity-tag { background-color: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; }
            .suggestions { font-style: italic; color: #475569; border-left: 4px solid #cbd5e1; padding-left: 15px; line-height: 1.5; margin-top: 10px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 50px; text-align: center; font-size: 11px; color: #94a3b8; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">College Trip Registration Summary</div>
              <div style="font-size: 13px; color: #64748b; margin-top: 4px;">Student Preference Record Sheet</div>
            </div>
            <div class="meta">
              <div>System Date: ${new Date().toLocaleDateString()}</div>
              <div>Sub. ID: ${student.registerNumber}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Student General Details</div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Name:</span> <span class="value">${student.studentName}</span></div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Roll No:</span> <span class="value">${student.registerNumber}</span></div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Department:</span> <span class="value">${student.department}</span></div>
              <div><span style="color:#64748b; font-size: 12px;">Year of Study:</span> <span class="value">${student.year}</span></div>
            </div>

            <div class="card">
              <div class="card-title">Travel Preferences</div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Destination:</span> <span class="value" style="color: #4f46e5;">${student.preferredDestination} (${student.preferredState})</span></div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Budget Class:</span> <span class="value">${student.budgetRange}</span></div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Transport:</span> <span class="value">${student.transportPreference}</span></div>
              <div style="margin-bottom: 8px;"><span style="color:#64748b; font-size: 12px;">Stay Type:</span> <span class="value">${student.accommodationPreference}</span></div>
              <div><span style="color:#64748b; font-size: 12px;">Food Preference:</span> <span class="value">${student.foodPreference}</span></div>
            </div>
          </div>

          <div class="card" style="margin-bottom: 25px;">
            <div class="card-title">Preferred Group Activities</div>
            <div class="activities">
              ${student.activities ? student.activities.map((a) => `<span class="activity-tag">${a}</span>`).join(" ") : "No specific activities checked."}
            </div>
          </div>

          <div class="card">
            <div class="card-title">Suggestions / Explanatory Notes</div>
            <div class="suggestions">
              "${student.suggestions || "No specific feedback or extra requirements entered."}"
            </div>
          </div>

          <div class="footer">
            Generated Automatically by College Trip Planner Centralized Storage • Page 1 of 1
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printAllStudents = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rowsHTML = filteredSubmissions
      .map(
        (s, i) => `
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px;">${i + 1}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px; font-weight: 700;">${s.registerNumber}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px;">${s.studentName}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px;">${s.department.replace(/\\(.*?\\)/, "")}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px;">${s.year}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px; font-weight: 600;">${s.preferredDestination}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px;">${s.budgetRange.split(" ")[0]}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px;">${s.transportPreference}</td>
        <td style="border: 1px solid #cbd5e1; padding: 10px; font-size: 11px; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${s.suggestions || "-"}</td>
      </tr>
    `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>All Submissions Executive Summary</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #334155; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 20px; font-weight: 800; color: #0f172a; }
            .meta { font-size: 11px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background-color: #f1f5f9; border: 1px solid #cbd5e1; padding: 12px 10px; font-size: 11px; font-weight: 700; text-align: left; color: #475569; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">College Trip - Student Preference Registry</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Filtered Records: ${filteredSubmissions.length} of ${submissions.length} Total</div>
            </div>
            <div class="meta">
              <div>Export Date: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Reg No</th>
                <th>Student Name</th>
                <th>Dept</th>
                <th>Year</th>
                <th>Preferred Destination</th>
                <th>Budget</th>
                <th>Transport</th>
                <th>Suggestions</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ----------------------------------------------------
  // DESTINATION DATABASE MANAGEMENT DIALOG CORES
  // ----------------------------------------------------
  const handleOpenAddDb = () => {
    setDbEditDest({
      name: "",
      state: "Tamil Nadu",
      district: "",
      overview: "",
      history: "",
      whyVisit: "",
      famousAttractions: [""],
      tags: {
        isHillStation: false,
        isBeach: false,
        isWaterfall: false,
        isForestOrNationalPark: false,
        isTempleOrMuseum: false,
        isViewpoint: false,
      },
      activities: {
        trekking: false,
        boating: false,
        camping: false,
        shopping: false,
      },
      foodSpecialities: [""],
      shootingLocations: [""],
      nearbyPlaces: [""],
      bestSeason: "September to April",
      climate: "Pleasant",
      recommendedDuration: "2 Days, 1 Night",
      safetyTips: [""],
      travelDistanceKm: 200,
      baseBudget: {
        transportation: 1000,
        accommodation: 1500,
        food: 1000,
        entryTickets: 100,
        miscellaneous: 400,
      },
    });
    setDbError("");
    setIsDbModalOpen(true);
  };

  const handleOpenEditDb = (dest: TouristDestination) => {
    setDbEditDest({ ...dest });
    setDbError("");
    setIsDbModalOpen(true);
  };

  const handleSaveDb = async () => {
    if (!dbEditDest?.name || !dbEditDest?.district || !dbEditDest?.state) {
      setDbError("Name, District, and State are mandatory parameters.");
      return;
    }

    const b = dbEditDest.baseBudget || { transportation: 0, accommodation: 0, food: 0, entryTickets: 0, miscellaneous: 0 };
    const total = (b.transportation || 0) + (b.accommodation || 0) + (b.food || 0) + (b.entryTickets || 0) + (b.miscellaneous || 0);
    if (total > 4500) {
      setDbError(`The maximum allowed total estimated budget is ₹4,500. Current total is ₹${total}. Please adjust values.`);
      return;
    }

    // Clean arrays
    const finalDest = {
      ...dbEditDest,
      famousAttractions: dbEditDest.famousAttractions?.filter((a) => a.trim() !== "") || [],
      foodSpecialities: dbEditDest.foodSpecialities?.filter((a) => a.trim() !== "") || [],
      shootingLocations: dbEditDest.shootingLocations?.filter((a) => a.trim() !== "") || [],
      nearbyPlaces: dbEditDest.nearbyPlaces?.filter((a) => a.trim() !== "") || [],
      safetyTips: dbEditDest.safetyTips?.filter((a) => a.trim() !== "") || [],
    };

    const isEditing = !!dbEditDest.id;
    const url = isEditing ? `/api/destinations/${dbEditDest.id}` : "/api/destinations";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalDest),
      });

      if (res.ok) {
        onRefreshDestinations();
        setIsDbModalOpen(false);
        setDbEditDest(null);
      } else {
        const errorData = await res.json();
        setDbError(errorData.error || "Failed to update tourist database.");
      }
    } catch (err) {
      console.error(err);
      setDbError("Network issue modifying database.");
    }
  };

  const handleDeleteDb = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this tourist destination?")) {
      return;
    }

    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        onRefreshDestinations();
      } else {
        alert("Deletion failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting record.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden bg-gradient-to-tr from-[#F8FAFC] to-[#E0F2FE]">
      {/* Background blobs for premium glassmorphic atmosphere */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Admin Panel Header */}
      <header className="bg-[#0F172A] text-white shadow-xl sticky top-0 z-40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">College Trip Command Console</h1>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Organizer Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 ${
                  activeTab === "analytics" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25" : "text-slate-400 hover:text-white"
                }`}
              >
                Analytics Cockpit
              </button>
              <button
                onClick={() => setActiveTab("submissions")}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 ${
                  activeTab === "submissions" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25" : "text-slate-400 hover:text-white"
                }`}
              >
                Submissions ({submissions.length})
              </button>
              <button
                onClick={() => setActiveTab("database")}
                className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-300 ${
                  activeTab === "database" ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/25" : "text-slate-400 hover:text-white"
                }`}
              >
                Tourist Database
              </button>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-error hover:text-white text-slate-300 border border-slate-800 hover:border-transparent rounded-2xl text-xs font-bold cursor-pointer transition-all duration-300 shadow-md hover:shadow-error/15"
            >
              <LogOut className="w-3.5 h-3.5" />
              Exit Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 z-10">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-600 font-semibold">Synchronizing admin cloud registry...</p>
          </div>
        ) : error ? (
          <div className="p-6 glass-card border border-rose-100 rounded-3xl text-slate-700 max-w-md mx-auto text-center space-y-4 shadow-xl">
            <AlertCircle className="w-14 h-14 text-error mx-auto" />
            <h3 className="text-lg font-display font-bold text-slate-dark">Sync Failure</h3>
            <p className="text-xs text-rose-600 font-medium">{error}</p>
            <button
              onClick={fetchSubmissions}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl text-xs font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition cursor-pointer"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <div>
            {/* TAB 1: ANALYTICS COCKPIT */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Visual Overview Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass-card p-5 rounded-2xl border border-white/60 shadow-sm space-y-1.5 hover:shadow-md transition duration-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Submissions</div>
                    <div className="text-3xl font-display font-black text-slate-dark">{totalSubmissions}</div>
                    <div className="text-[10px] text-success font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                      100% Secure Logs
                    </div>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-white/60 shadow-sm space-y-1.5 hover:shadow-md transition duration-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Most Picked State</div>
                    <div className="text-xl font-display font-bold text-primary line-clamp-1">{topState.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{topState.count} Cohorts selected</div>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-white/60 shadow-sm space-y-1.5 hover:shadow-md transition duration-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Destination</div>
                    <div className="text-xl font-display font-bold text-secondary line-clamp-1">{topDest.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold">{topDest.count} Cohorts selected</div>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-white/60 shadow-sm space-y-1.5 hover:shadow-md transition duration-300">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sights Directory</div>
                    <div className="text-3xl font-display font-black text-slate-dark">{destinations.length}</div>
                    <div className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5" onClick={() => setActiveTab("database")}>
                      Manage Tourist DB &rarr;
                    </div>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Department Stats Chart (Custom SVG bar chart) */}
                  <div className="glass-card p-6 rounded-3xl border border-white/60 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-dark flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Department-wise Distribution
                    </h3>

                    {Object.keys(deptStats).length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400">No preference data submitted yet.</div>
                    ) : (
                      <div className="space-y-3.5">
                        {Object.entries(deptStats).map(([dept, countVal]) => {
                          const count = countVal as number;
                          const percentage = Math.round((count / totalSubmissions) * 100);
                          return (
                            <div key={dept} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold text-slate-700">
                                <span className="truncate max-w-[280px]" title={dept}>{dept}</span>
                                <span className="text-slate-500">{count} student{count > 1 ? "s" : ""} ({percentage}%)</span>
                              </div>
                              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Year & Budget distribution bar charts */}
                  <div className="glass-card p-6 rounded-3xl border border-white/60 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-dark mb-4 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        Academic Study Year Counts
                      </h3>
                      {Object.keys(yearStats).length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">No data submitted.</div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {["I Year", "II Year", "III Year", "IV Year"].map((yr) => {
                            const count = yearStats[yr] || 0;
                            const heightPercentage = totalSubmissions > 0 ? (count / totalSubmissions) * 100 : 0;
                            return (
                              <div key={yr} className="flex flex-col items-center gap-2">
                                <div className="h-28 w-full bg-white rounded-xl relative flex items-end overflow-hidden border border-slate-150">
                                  <div
                                    className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-1000"
                                    style={{ height: `${heightPercentage || 10}%` }}
                                  >
                                    {count > 0 && (
                                      <div className="text-[10px] text-white font-bold text-center pt-1">{count}</div>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs font-bold text-slate-600">{yr.split(" ")[0]} Year</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                      <h3 className="text-sm font-bold text-slate-dark mb-3 font-display">Budget Range Class Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(budgetStats).map(([range, countVal]) => {
                          const count = countVal as number;
                          const percentage = Math.round((count / totalSubmissions) * 100);
                          return (
                            <div key={range} className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-600">{range.split(" (")[0]}</span>
                              <div className="flex items-center gap-2 w-32 shrink-0">
                                <div className="h-2 bg-slate-100 w-full rounded-full overflow-hidden">
                                  <div className="h-full bg-accent" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-[10px] text-slate-500 font-bold shrink-0">{count} ({percentage}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT SUBMISSIONS TABLE */}
            {activeTab === "submissions" && (
              <div className="glass-card rounded-3xl border border-white/60 shadow-sm overflow-hidden space-y-4">
                {/* Controls & Exporters row */}
                <div className="p-4 bg-white/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full md:w-auto flex-grow max-w-4xl">
                    {/* Search */}
                    <div className="relative col-span-2 md:col-span-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                      <input
                        type="text"
                        placeholder="Search student..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary transition"
                      />
                    </div>

                    {/* Filter Dept */}
                    <select
                      value={filterDept}
                      onChange={(e) => setFilterDept(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                    >
                      <option value="All">All Departments</option>
                      {departmentsList.map((d) => (
                        <option key={d} value={d}>{d.length > 20 ? d.substring(0, 18) + "..." : d}</option>
                      ))}
                    </select>

                    {/* Filter Year */}
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                    >
                      <option value="All">All Years</option>
                      {yearsList.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>

                    {/* Filter State */}
                    <select
                      value={filterState}
                      onChange={(e) => setFilterState(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                    >
                      <option value="All">All States</option>
                      {statesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    {/* Filter Dest */}
                    <select
                      value={filterDest}
                      onChange={(e) => setFilterDest(e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl text-xs px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                    >
                      <option value="All">All Destinations</option>
                      {destsList.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Exporter triggers */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => triggerExport("csv")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                      Export CSV
                    </button>
                    <button
                      onClick={() => triggerExport("excel")}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      Excel Report
                    </button>
                    <button
                      onClick={printAllStudents}
                      className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-bold cursor-pointer transition active:scale-95 shadow-md shadow-primary/10"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Export PDF
                    </button>
                  </div>
                </div>

                {/* Submissions Table Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/60 border-b border-slate-200 text-slate-700 font-display uppercase font-extrabold tracking-wider">
                        <th className="py-3 px-4">Student Details</th>
                        <th className="py-3 px-4">Academic Info</th>
                        <th className="py-3 px-4">Chosen Destination</th>
                        <th className="py-3 px-4">Budget & Transport</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            No student records matching current filters.
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((sub) => (
                           <tr key={sub.registerNumber} className="hover:bg-primary/5 transition duration-200">
                            <td className="py-3 px-4">
                              <div className="font-extrabold text-slate-800">{sub.studentName}</div>
                              <div className="text-[10px] text-slate-400 font-bold">{sub.registerNumber}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-slate-700 truncate max-w-[150px]" title={sub.department}>
                                {sub.department}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold">{sub.year}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-primary">{sub.preferredDestination}</div>
                              <div className="text-[10px] text-slate-400 font-semibold">{sub.preferredState}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-accent text-[11px] font-black">{sub.budgetRange.split(" (")[0]}</div>
                              <div className="text-[10px] text-slate-400 font-medium">via {sub.transportPreference}</div>
                            </td>
                            <td className="py-3 px-4 text-right space-x-1.5 shrink-0">
                              <button
                                onClick={() => setSelectedStudent(sub)}
                                className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 text-primary font-bold rounded-lg text-[10px] cursor-pointer transition duration-300"
                              >
                                View / Print
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(sub.registerNumber)}
                                className="p-1.5 text-slate-400 hover:text-error hover:bg-rose-50 rounded-md cursor-pointer transition duration-200 inline-flex"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: TOURIST DATABASE MANAGER */}
            {activeTab === "database" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-sm">
                  <div>
                    <h3 className="text-sm font-display font-black text-slate-dark">Tourist Directory Explorer</h3>
                    <p className="text-xs text-slate-500 font-medium">Admin-exclusive destination database manager</p>
                  </div>
                  <button
                    onClick={handleOpenAddDb}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all duration-300 shadow-md shadow-primary/10 hover:opacity-95 active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add Destination
                  </button>
                </div>

                {/* Database Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {destinations.map((dest) => {
                    const estB =
                      dest.baseBudget.transportation +
                      dest.baseBudget.accommodation +
                      dest.baseBudget.food +
                      dest.baseBudget.entryTickets +
                      dest.baseBudget.miscellaneous;

                    return (
                      <div key={dest.id} className="glass-card p-5 rounded-3xl border border-white/60 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition duration-300">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="px-2 py-0.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-[9px] font-extrabold rounded-md uppercase tracking-wider block w-fit mb-1">
                                {dest.state}
                              </span>
                              <h4 className="text-sm font-display font-bold text-slate-dark leading-tight">{dest.name}</h4>
                              <p className="text-[11px] text-slate-400 font-semibold">{dest.district} District</p>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-display font-black text-accent">₹{estB}</div>
                              <div className="text-[9px] text-slate-400 font-bold">Base Est</div>
                            </div>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{dest.overview}</p>
                        </div>

                        <div className="flex justify-end gap-1.5 border-t border-slate-100 pt-3">
                          <button
                            onClick={() => handleOpenEditDb(dest)}
                            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-primary font-bold rounded-lg text-[10px] cursor-pointer transition duration-200"
                          >
                            <Edit className="w-3 h-3" />
                            Modify
                          </button>
                          <button
                            onClick={() => handleDeleteDb(dest.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 text-slate-400 hover:text-error font-bold rounded-lg text-[10px] cursor-pointer transition duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* MODAL 1: STUDENT RECORD DETAIL POPUP / PRINT SHEET */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-5 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-accent animate-spin-slow" />
                  <h3 className="text-sm font-display font-black tracking-wide">Student Record Profile Sheet</h3>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-white/80 hover:text-white cursor-pointer transition p-1 bg-white/10 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs leading-relaxed text-slate-800">
                {/* Visual Identity */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Identity</span>
                    <div className="text-base font-display font-bold text-slate-900">{selectedStudent.studentName}</div>
                    <div className="text-slate-600 font-bold">{selectedStudent.registerNumber} • {selectedStudent.year}</div>
                    <div className="text-slate-400 font-medium truncate" title={selectedStudent.department}>{selectedStudent.department}</div>
                  </div>

                  <div className="space-y-1.5 border-l border-slate-200 pl-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Landed Trip Preference</span>
                    <div className="text-base font-display font-bold text-primary">{selectedStudent.preferredDestination}</div>
                    <div className="text-slate-600 font-bold">{selectedStudent.preferredState}</div>
                    <div className="text-slate-500 font-medium">{selectedStudent.budgetRange.split(" (")[0]} via {selectedStudent.transportPreference}</div>
                  </div>
                </div>

                {/* Sub details */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Transport</div>
                    <div className="font-extrabold text-slate-800 mt-0.5">{selectedStudent.transportPreference}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Lodging</div>
                    <div className="font-extrabold text-slate-800 mt-0.5">{selectedStudent.accommodationPreference}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Dining</div>
                    <div className="font-extrabold text-slate-800 mt-0.5">{selectedStudent.foodPreference}</div>
                  </div>
                </div>

                {/* Checked activities */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Group Activities Selected</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStudent.activities && selectedStudent.activities.length > 0 ? (
                      selectedStudent.activities.map((a) => (
                        <span key={a} className="px-3 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold rounded-lg text-[10px]">
                          {a}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 font-semibold">No activities selected.</span>
                    )}
                  </div>
                </div>

                {/* Suggestions text */}
                <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Specific suggestions</span>
                  <p className="text-slate-600 font-medium italic">
                    "{selectedStudent.suggestions || "No extra preferences or specific criteria requested."}"
                  </p>
                </div>
              </div>

              {/* PDF printer button in modal */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition text-xs cursor-pointer"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => downloadSingleStudentPDF(selectedStudent)}
                  className="px-4 py-2 bg-accent hover:opacity-90 text-white font-extrabold rounded-xl transition text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-accent/20"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Download PDF
                </button>
                <button
                  onClick={() => printSingleStudent(selectedStudent)}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-extrabold rounded-xl transition text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Individual PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: TOURIST DATABASE ADD/EDIT FORM */}
      <AnimatePresence>
        {isDbModalOpen && dbEditDest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-2xl w-full rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-5 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-accent animate-pulse" />
                  <h3 className="text-sm font-display font-black tracking-wide">
                    {dbEditDest.id ? `Modify ${dbEditDest.name}` : "Create New Destination"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsDbModalOpen(false)}
                  className="text-white/80 hover:text-white cursor-pointer p-1 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 flex-grow text-xs leading-relaxed text-slate-800">
                {dbError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-150 rounded-xl text-error font-extrabold text-[11px] animate-shake">
                    {dbError}
                  </div>
                )}

                {/* Form row 1 */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">Spot Name *</label>
                    <input
                      type="text"
                      value={dbEditDest.name || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, name: e.target.value })}
                      placeholder="e.g. Kodaikanal"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">State *</label>
                    <select
                      value={dbEditDest.state || "Tamil Nadu"}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, state: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
                    >
                      {STATES.filter((s) => s !== "All States").map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">District *</label>
                    <input
                      type="text"
                      value={dbEditDest.district || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, district: e.target.value })}
                      placeholder="e.g. Dindigul"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>

                {/* Form row 2: textareas */}
                <div className="space-y-4">
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">Overview Description</label>
                    <textarea
                      rows={2}
                      value={dbEditDest.overview || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, overview: e.target.value })}
                      placeholder="Write brief description..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-xl text-xs font-semibold text-slate-800"
                    ></textarea>
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">History & Origin</label>
                    <textarea
                      rows={2}
                      value={dbEditDest.history || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, history: e.target.value })}
                      placeholder="Colonial roots, native stories..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary rounded-xl text-xs font-semibold text-slate-800"
                    ></textarea>
                  </div>
                </div>

                {/* Category Tags */}
                <div>
                  <label className="font-extrabold text-slate-500 uppercase block mb-2">Categories / Tagging</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={dbEditDest.tags?.isHillStation || false}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            tags: { ...dbEditDest.tags!, isHillStation: e.target.checked },
                          })
                        }
                      />
                      ⛰️ Hill Station
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={dbEditDest.tags?.isBeach || false}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            tags: { ...dbEditDest.tags!, isBeach: e.target.checked },
                          })
                        }
                      />
                      🏖️ Beach
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={dbEditDest.tags?.isWaterfall || false}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            tags: { ...dbEditDest.tags!, isWaterfall: e.target.checked },
                          })
                        }
                      />
                      🌊 Waterfalls
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={dbEditDest.tags?.isForestOrNationalPark || false}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            tags: { ...dbEditDest.tags!, isForestOrNationalPark: e.target.checked },
                          })
                        }
                      />
                      🌳 Forests/Parks
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={dbEditDest.tags?.isTempleOrMuseum || false}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            tags: { ...dbEditDest.tags!, isTempleOrMuseum: e.target.checked },
                          })
                        }
                      />
                      🛕 Temples/Heritage
                    </label>
                    <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        className="accent-primary w-3.5 h-3.5"
                        checked={dbEditDest.tags?.isViewpoint || false}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            tags: { ...dbEditDest.tags!, isViewpoint: e.target.checked },
                          })
                        }
                      />
                      🌅 Viewpoint
                    </label>
                  </div>
                </div>

                {/* Base Budgets */}
                <div>
                  <label className="font-extrabold text-slate-500 uppercase block mb-1.5">Base Budget Calculator estimates (₹)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Transport</span>
                      <input
                        type="number"
                        value={dbEditDest.baseBudget?.transportation || 0}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            baseBudget: { ...dbEditDest.baseBudget!, transportation: Number(e.target.value) },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Accommodation</span>
                      <input
                        type="number"
                        value={dbEditDest.baseBudget?.accommodation || 0}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            baseBudget: { ...dbEditDest.baseBudget!, accommodation: Number(e.target.value) },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Food</span>
                      <input
                        type="number"
                        value={dbEditDest.baseBudget?.food || 0}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            baseBudget: { ...dbEditDest.baseBudget!, food: Number(e.target.value) },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Entry Tickets</span>
                      <input
                        type="number"
                        value={dbEditDest.baseBudget?.entryTickets || 0}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            baseBudget: { ...dbEditDest.baseBudget!, entryTickets: Number(e.target.value) },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Misc</span>
                      <input
                        type="number"
                        value={dbEditDest.baseBudget?.miscellaneous || 0}
                        onChange={(e) =>
                          setDbEditDest({
                            ...dbEditDest,
                            baseBudget: { ...dbEditDest.baseBudget!, miscellaneous: Number(e.target.value) },
                          })
                        }
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* Static details */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">Best Season</label>
                    <input
                      type="text"
                      value={dbEditDest.bestSeason || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, bestSeason: e.target.value })}
                      placeholder="Oct to Mar"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">Climate</label>
                    <input
                      type="text"
                      value={dbEditDest.climate || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, climate: e.target.value })}
                      placeholder="Misty"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">Duration</label>
                    <input
                      type="text"
                      value={dbEditDest.recommendedDuration || ""}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, recommendedDuration: e.target.value })}
                      placeholder="3 Days, 2 Nights"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-500 uppercase block mb-1">Distance (Km)</label>
                    <input
                      type="number"
                      value={dbEditDest.travelDistanceKm || 0}
                      onChange={(e) => setDbEditDest({ ...dbEditDest, travelDistanceKm: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-xl text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => setIsDbModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDb}
                  className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-extrabold rounded-xl transition text-xs cursor-pointer shadow-md shadow-primary/20 hover:opacity-95"
                >
                  Save Entry
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
