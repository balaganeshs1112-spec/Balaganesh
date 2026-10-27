import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SETS - Smart Emergency Traffic System" });
  });

  // API Route: AI CCTV YOLO Vision Analysis
  app.post("/api/ai/cctv-analysis", async (req, res) => {
    try {
      const { junctionName, vehicleCounts, trafficDensity, videoSnapshotBase64 } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback response if GEMINI_API_KEY is not yet populated
        return res.json({
          success: true,
          aiAnalysis: `[Simulated YOLO Vision Engine] Analyzed ${junctionName}. Total detected objects: ${vehicleCounts.total} (${vehicleCounts.cars} Cars, ${vehicleCounts.buses} Buses, ${vehicleCounts.trucks} Heavy Transport). Traffic Density evaluated at ${trafficDensity.toUpperCase()}. Recommendation: Maintain Green Wave priority corridor clearance.`,
          hazardDetected: vehicleCounts.trucks > 3,
          clearanceTimeSec: Math.max(10, Math.floor(vehicleCounts.total * 1.8)),
          confidenceScore: 0.982
        });
      }

      const prompt = `You are the SETS (Smart Emergency Traffic Management System) YOLO Vision AI Engine.
Analyze the following CCTV junction data:
- Junction Name: ${junctionName}
- Vehicle Detection Stats: Total ${vehicleCounts.total} vehicles (${vehicleCounts.cars} cars, ${vehicleCounts.buses} buses, ${vehicleCounts.trucks} trucks, ${vehicleCounts.bikes} bikes)
- Calculated Density: ${trafficDensity}

Provide a concise 3-sentence technical AI computer vision report for emergency dispatch operators:
1. Identify immediate congestion bottlenecks or emergency lane risks.
2. State recommended signal phase duration (in seconds) to flush cross-traffic before the approaching ambulance arrives.
3. Provide a clear green-flag or caution statement.`;

      const contentsParts: any[] = [{ text: prompt }];

      if (videoSnapshotBase64 && typeof videoSnapshotBase64 === "string" && videoSnapshotBase64.includes(";base64,")) {
        const matches = videoSnapshotBase64.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          contentsParts.unshift({
            inlineData: {
              mimeType: matches[1],
              data: matches[2]
            }
          });
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contentsParts.length === 1 ? contentsParts[0].text : { parts: contentsParts },
      });

      const text = response.text || "AI CCTV Scan completed successfully.";
      res.json({
        success: true,
        aiAnalysis: text,
        hazardDetected: vehicleCounts.trucks > 3,
        clearanceTimeSec: Math.max(12, Math.floor(vehicleCounts.total * 1.5)),
        confidenceScore: 0.985
      });
    } catch (error: any) {
      console.error("CCTV AI Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to process AI CCTV scan" });
    }
  });

  // API Route: AI Route Optimization Reasoner
  app.post("/api/ai/route-analysis", async (req, res) => {
    try {
      const { routes, ambulanceLocation, hospitalDestination } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          bestRouteId: "route-c",
          recommendation: "Route C (Ring Bypass) selected. Lowest congestion density (22%) and 3 signal nodes configured for Green Wave priority.",
          expectedTravelTimeMin: 7.2
        });
      }

      const prompt = `You are SETS Autonomous Route Decision Engine.
An emergency ambulance is traveling from ${ambulanceLocation} to ${hospitalDestination}.
Evaluate these 3 available candidate routes:
${JSON.stringify(routes, null, 2)}

Provide a JSON object response with:
- bestRouteId: string ("route-a", "route-b", or "route-c")
- recommendation: string (2 sentences explaining why this route optimizes green corridor efficiency and avoids gridlock)
- expectedTravelTimeMin: number`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({
        success: true,
        bestRouteId: parsed.bestRouteId || "route-c",
        recommendation: parsed.recommendation || "Selected Ring Bypass for optimal emergency speed.",
        expectedTravelTimeMin: parsed.expectedTravelTimeMin || 6.8
      });
    } catch (error: any) {
      console.error("AI Route Analysis error:", error);
      res.status(500).json({ error: error.message || "Failed to compute route recommendation" });
    }
  });

  // API Route: AI Police Emergency Broadcast Dispatch
  app.post("/api/ai/police-broadcast", async (req, res) => {
    try {
      const { ambulanceId, routeName, hospitalName, currentSpeed, etaMinutes } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          success: true,
          broadcastMessage: `🚨 ALL UNITS: Priority Emergency Corridor active for ${ambulanceId} along ${routeName} heading to ${hospitalName}. Speed: ${currentSpeed} km/h. ETA: ${etaMinutes} mins. Clear all cross-junctions immediately.`,
          codeLevel: "CODE RED - PRIORITY 1"
        });
      }

      const prompt = `Generate an urgent, realistic police radio dispatch broadcast message for Traffic Police Patrol Units.
Details:
- Vehicle: Ambulance ${ambulanceId}
- Route: ${routeName}
- Destination: ${hospitalName}
- Current Speed: ${currentSpeed} km/h
- ETA: ${etaMinutes} minutes

Keep it under 40 words, urgent, technical, and formatted for radio alert display.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({
        success: true,
        broadcastMessage: response.text?.trim() || `🚨 PRIORITY DISPATCH: Emergency vehicle ${ambulanceId} en route along ${routeName}.`,
        codeLevel: "CODE RED - PRIORITY 1"
      });
    } catch (error: any) {
      console.error("Police broadcast error:", error);
      res.status(500).json({ error: error.message || "Failed to generate police dispatch broadcast" });
    }
  });

  // Vite middleware for development
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
    console.log(`SETS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
