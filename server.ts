/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { promises as fs } from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), "data");
const DESTINATIONS_FILE = path.join(DATA_DIR, "destinations.json");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "submissions.json");

// Simple Admin credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "bala";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bala7603";
const ADMIN_TOKEN = "collegetrip-admin-secret-token-2026";

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini AI initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
} else {
  console.log("No GEMINI_API_KEY found, running in fallback model mode.");
}

// Helpers for reading/writing persistent store
async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}

  try {
    await fs.access(DESTINATIONS_FILE);
  } catch (e) {
    // If not exists, write empty array or default list (should be pre-created by create_file)
    await fs.writeFile(DESTINATIONS_FILE, JSON.stringify([], null, 2));
  }

  try {
    await fs.access(SUBMISSIONS_FILE);
  } catch (e) {
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
  }
}

async function readDestinations() {
  await ensureDataFiles();
  const content = await fs.readFile(DESTINATIONS_FILE, "utf-8");
  return JSON.parse(content || "[]");
}

async function writeDestinations(data: any) {
  await ensureDataFiles();
  await fs.writeFile(DESTINATIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function readSubmissions() {
  await ensureDataFiles();
  const content = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
  return JSON.parse(content || "[]");
}

async function writeSubmissions(data: any) {
  await ensureDataFiles();
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

async function startServer() {
  await ensureDataFiles();
  const app = express();
  
  app.use(express.json());

  // CORS headers just in case
  app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    next();
  });

  // ----------------------------------------------------
  // AUTH ROUTE
  // ----------------------------------------------------
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return res.json({ success: true, token: ADMIN_TOKEN, username });
    }
    return res.status(401).json({ error: "Invalid admin username or password" });
  });

  // Middleware to authenticate admin requests
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${ADMIN_TOKEN}`) {
      return next();
    }
    return res.status(403).json({ error: "Unauthorized admin access" });
  };

  // ----------------------------------------------------
  // DESTINATIONS API
  // ----------------------------------------------------
  
  // Public route for students and admins to get destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const list = await readDestinations();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin route to create/add destination
  app.post("/api/destinations", requireAdmin, async (req, res) => {
    try {
      const body = req.body;
      if (!body.name || !body.state || !body.district) {
        return res.status(400).json({ error: "Name, State and District are required" });
      }

      const list = await readDestinations();
      const id = `${body.state.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${body.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      
      const newDest = {
        id,
        ...body,
      };

      list.push(newDest);
      await writeDestinations(list);
      res.status(201).json(newDest);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin route to update destination
  app.put("/api/destinations/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const list = await readDestinations();
      const index = list.findIndex((d: any) => d.id === id);

      if (index === -1) {
        return res.status(404).json({ error: "Destination not found" });
      }

      list[index] = { ...list[index], ...body, id }; // retain id
      await writeDestinations(list);
      res.json(list[index]);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Admin route to delete destination
  app.delete("/api/destinations/:id", requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const list = await readDestinations();
      const newList = list.filter((d: any) => d.id !== id);
      
      if (list.length === newList.length) {
        return res.status(404).json({ error: "Destination not found" });
      }

      await writeDestinations(newList);
      res.json({ success: true, message: "Destination deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ----------------------------------------------------
  // SUBMISSIONS API
  // ----------------------------------------------------

  // Submit student response (Public)
  app.post("/api/submissions", async (req, res) => {
    try {
      const submission = req.body;
      if (!submission.registerNumber || !submission.studentName || !submission.department || !submission.year) {
        return res.status(400).json({ error: "Required fields missing" });
      }

      const list = await readSubmissions();
      
      // Check if registration number already submitted
      const existing = list.find((s: any) => s.registerNumber.toLowerCase().trim() === submission.registerNumber.toLowerCase().trim());
      if (existing) {
        return res.status(400).json({ error: `Registration number ${submission.registerNumber} has already submitted preferences.` });
      }

      const newSubmission = {
        ...submission,
        submissionDate: new Date().toISOString(),
      };

      list.push(newSubmission);
      await writeSubmissions(list);
      res.status(201).json(newSubmission);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all submissions (Admin only)
  app.get("/api/submissions", requireAdmin, async (req, res) => {
    try {
      const list = await readSubmissions();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete submission (Admin only)
  app.delete("/api/submissions/:registerNumber", requireAdmin, async (req, res) => {
    try {
      const regNo = req.params.registerNumber;
      const list = await readSubmissions();
      const newList = list.filter((s: any) => s.registerNumber !== regNo);

      if (list.length === newList.length) {
        return res.status(404).json({ error: "Submission not found" });
      }

      await writeSubmissions(newList);
      res.json({ success: true, message: "Submission removed" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ----------------------------------------------------
  // AI API ENDPOINTS (GEMINI PROXY)
  // ----------------------------------------------------

  // 1. AI Travel Guide Generation for a selected destination
  app.post("/api/ai/guide", async (req, res) => {
    const { destinationName, state, district, whyVisit, famousAttractions } = req.body;
    if (!destinationName) {
      return res.status(400).json({ error: "Destination name is required" });
    }

    const prompt = `You are a professional, warm, and conversational College Travel Guide.
Generate a comprehensive, engaging travel guide for college students planning a trip to ${destinationName} (located in ${district}, ${state}).

The guide must cover:
1. Why this destination is famous and why it is an absolute must-visit for college cohorts.
2. What students can enjoy (group cohesion, social fun, sightseeing).
3. Hidden attractions or secret gems that tourists often miss.
4. Best photo spots for college group memories and Instagram-worthy landscapes.
5. Exciting student-friendly group activities (e.g. treks, nature strolls, campfire spots, water sports).
6. Travel tips specifically for budget, packing, or safety.
7. Local food recommendations (what culinary delicacies are iconic to this spot).
8. A suggested fast-paced 2-day student-friendly group itinerary.
9. Nearby attractions that can be clubbed together.

Make the response feel conversational, exciting, personalized, and structured with clear sections using markdown. Do not use overly formal or dry text.`;

    if (!ai) {
      // Return a beautiful pre-generated mock response if no key is supplied
      const mockGuide = `### 🌟 Welcome to ${destinationName}! (College Travel Guide)

*Hey Students! Get ready for an absolute adventure in the scenic landscapes of ${district}, ${state}! Here is your customized collegiate guide.*

#### 📸 Why It's Famous & Best Photo Spots
${destinationName} is famous for its breathtaking views, cool breezes, and rich history. 
- **The Ultimate Group Selfie**: Catch the sunrise/sunset at the primary valley viewpoint or seaside promenade.
- **Instagram Spot**: Gather under the pine forest shadows or next to the historic structures for that epic cohort memory.

#### 🗺️ Hidden Gems & Group Activities
- **The Secret Meadow**: Just 3km off the main route lies a tranquil glade perfect for playing acoustic guitar, trekking, and stargazing.
- **Student Activities**: From row-boating in the lake, group trekking up high points, to hunting for local handcrafts, there is never a dull moment!

#### 🍛 Local Food & Delicacies
Don't leave without tasting:
- Fresh hot local spices and local street tea.
- The iconic dishes unique to this region of ${state}.

#### 🚗 Suggested 2-Day College Itinerary
- **Day 1: Arrival & Core Attractions**: Check-in, grab a local lunch, and visit the famous sights like the central viewpoint, water cascades, and botanical gardens. Gather for a evening group dinner.
- **Day 2: Secret Trek & Departure**: Wake up early for the misty view, trek to the nearby hills or waterfalls, explore local markets for souvenirs, and head back home.

---
*💡 Travel Tip: Keep plastic use to an absolute minimum and travel in certified group vehicles!*`;
      return res.json({ guide: mockGuide, isMock: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text || "No response generated by the model.";
      return res.json({ guide: text, isMock: false });
    } catch (error: any) {
      console.error("Gemini API Error in /api/ai/guide:", error);
      return res.status(500).json({ error: "Failed to generate AI travel guide content. Please check API secrets." });
    }
  });

  // 2. AI Recommendation based on student submission
  app.post("/api/ai/recommendation", async (req, res) => {
    const { studentName, preferredState, preferredDestination, budgetRange, activities, transportPreference, accommodationPreference, foodPreference, suggestions } = req.body;

    if (!preferredDestination) {
      return res.status(400).json({ error: "Preferred destination is required" });
    }

    const prompt = `You are an AI Travel Advisor specializing in student tours. 
Analyze the following student preferences and generate a personalized, exciting recommendation report.

Student Name: ${studentName || "Student"}
Preferred Destination: ${preferredDestination} (State: ${preferredState})
Budget Profile: ${budgetRange}
Selected Group Activities: ${activities ? activities.join(", ") : "Sightseeing"}
Preferred Transport: ${transportPreference}
Preferred Stay: ${accommodationPreference}
Preferred Food: ${foodPreference}
Student Suggestions/Notes: ${suggestions || "None"}

Please generate a beautifully formatted report covering:
1. **Personalized Greeting**: Congratulate the student on their destination choice.
2. **Best Custom Itinerary**: A custom-tailored timeline aligning with their requested activities (${activities ? activities.join(", ") : "Sightseeing"}).
3. **Best Time to Go**: The absolute prime months to visit.
4. **Estimated Expenses & Budget Hacks**: Practical tips to save money, stay within their budget (${budgetRange}), and maximize fun.
5. **Transportation & Stay Advice**: Recommendations customized to their preferences (${transportPreference} and ${accommodationPreference}).
6. **Essential Safety & Group Travel Tips**: Practical advice on staying safe and keeping the group connected.

Keep the tone encouraging, adventurous, and highly relevant to college budgets. Use markdown for clean headings and bullets.`;

    if (!ai) {
      const mockRec = `### 🎒 Personalized AI Trip Plan for ${studentName || "Student"}!
      
Congratulations on picking **${preferredDestination}**! This is going to be an unforgettable adventure.

#### 🗓️ Tailored Itinerary & Activities
Since you love **${activities ? activities.join(", ") : "exploring"}**, we suggest starting Day 1 with high-energy group activities. Set up a campfire or nature walk. On Day 2, explore local food hubs and shopping alleys with your classmates.

#### 💰 Budget Hacks & Expense Estimates (${budgetRange})
- **Group Discounts**: Pool money for shared dormitories/homestays to cut accommodation costs by up to 40%.
- **Transport**: Your preferred **${transportPreference}** is perfect! Block book tickets early to grab deep student discounts.
- **Food**: Eating at authentic local eateries instead of luxury cafes keeps your daily food budget under ₹400 while delivering unmatched regional taste!

#### 🌟 Pro Tips
- Keep power banks handy for scenic treks.
- Respect local ecosystem guidelines and enjoy your college trip to the absolute fullest!`;
      return res.json({ recommendation: mockRec, isMock: true });
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text || "No recommendation generated.";
      return res.json({ recommendation: text, isMock: false });
    } catch (error: any) {
      console.error("Gemini API Error in /api/ai/recommendation:", error);
      return res.status(500).json({ error: "Failed to generate AI recommendation. Please check API secrets." });
    }
  });

  // ----------------------------------------------------
  // VITE & STATIC FILES SERVICE
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
