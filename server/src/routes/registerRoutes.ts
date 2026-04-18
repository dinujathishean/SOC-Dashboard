import type { Express } from "express";
import { Router } from "express";
import { healthGet } from "../controllers/healthController.js";
import { metricsGet } from "../controllers/metricsController.js";
import { summaryGet } from "../controllers/summaryController.js";
import { analyticsGet } from "../controllers/analyticsController.js";
import { alertsGet, alertsPatch } from "../controllers/alertsController.js";
import { alertConvertPost } from "../controllers/alertConvertController.js";
import {
  incidentByIdGet,
  incidentsGet,
  incidentPatch,
  incidentStatusPatch,
} from "../controllers/incidentsController.js";
import { activityGet } from "../controllers/activityController.js";
import { logsUploadPost } from "../controllers/logsController.js";
import { detectionRunPost } from "../controllers/detectionController.js";
import { tickIngestPost, tickLivePost } from "../controllers/tickController.js";
import { authLoginPost, authMeGet } from "../controllers/authController.js";
import { usersGet } from "../controllers/usersController.js";
import { dashboardGet } from "../controllers/dashboardController.js";
import { simulationRunPost } from "../controllers/simulationController.js";
import { searchGet } from "../controllers/searchController.js";
import { exportAlertsCsvGet, exportIncidentsCsvGet } from "../controllers/exportController.js";
import {
  notificationsGet,
  notificationReadPatch,
  notificationsReadAllPost,
} from "../controllers/notificationsController.js";
import { auditGet } from "../controllers/auditController.js";
import { authMiddleware, requireAnalyst, requireAuth } from "../middleware/auth.js";

export function registerRoutes(app: Express) {
  const api = Router();

  api.get("/health", healthGet);
  api.post("/auth/login", authLoginPost);

  api.use(authMiddleware);
  api.use(requireAuth);

  api.get("/auth/me", authMeGet);

  api.get("/dashboard", dashboardGet);
  api.get("/metrics", metricsGet);
  api.get("/summary", summaryGet);
  api.get("/analytics", analyticsGet);

  api.get("/search", searchGet);

  api.get("/export/alerts", exportAlertsCsvGet);
  api.get("/export/incidents", exportIncidentsCsvGet);

  api.get("/notifications", notificationsGet);
  api.patch("/notifications/:id/read", notificationReadPatch);
  api.post("/notifications/read-all", notificationsReadAllPost);

  api.get("/audit", auditGet);

  api.get("/users", usersGet);

  api.get("/alerts", alertsGet);
  api.post("/alerts/:id/convert", requireAnalyst, alertConvertPost);
  api.patch("/alerts/:id", requireAnalyst, alertsPatch);

  api.get("/incidents", incidentsGet);
  api.get("/incidents/:id", incidentByIdGet);
  api.patch("/incidents/:id/status", requireAnalyst, incidentStatusPatch);
  api.patch("/incidents/:id", requireAnalyst, incidentPatch);

  api.get("/activity", activityGet);

  api.post("/logs/upload", requireAnalyst, logsUploadPost);
  api.post("/detection/run", requireAnalyst, detectionRunPost);
  api.post("/simulation/run", requireAnalyst, simulationRunPost);

  api.post("/tick/live", requireAnalyst, tickLivePost);
  api.post("/tick/ingest", requireAnalyst, tickIngestPost);

  app.use("/api", api);
}
