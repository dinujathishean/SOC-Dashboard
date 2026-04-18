/** Shared SOC dashboard types (aligned with API JSON). */

export type SocRole = "admin" | "analyst" | "viewer";

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type AlertStatus = "Open" | "Investigating" | "Escalated" | "Resolved";

/** Normalized telemetry channel */
export type AlertSourceType = "auth" | "web" | "firewall" | "endpoint";

export interface SecurityAlert {
  id: string;
  timestamp: string;
  eventType: string;
  sourceIp: string;
  severity: Severity;
  status: AlertStatus;
  assignedAnalyst: string;
  description: string;
  destination?: string;
  mitreTactic?: string;
  /** MITRE ATT&CK technique ID, e.g. T1110 */
  mitreTechnique?: string;
  sourceType?: AlertSourceType | string;
  relatedIncidentId?: string;
}

export interface TimelineEvent {
  id: string;
  at: string;
  kind: string;
  title: string;
  detail?: string | null;
  alertId?: string | null;
  actor: { id: string; name: string; email: string } | null;
}

export interface AuditEntry {
  id: string;
  createdAt: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string | null;
  actor: { id: string; name: string; email: string } | null;
}

export interface AppNotification {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  read: boolean;
  linkKind?: string | null;
  linkId?: string | null;
}

export type IncidentStatus =
  | "Open"
  | "Investigating"
  | "Escalated"
  | "Contained"
  | "Resolved"
  | "Closed";

export interface IncidentSummary {
  id: string;
  title: string;
  status: IncidentStatus | string;
  severity: string;
  description?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo: { id: string; name: string; email: string } | null;
}

export interface DashboardSummary {
  totalAlerts: number;
  criticalAlerts: number;
  openIncidents: number;
  resolvedIncidents: number;
  suspiciousIps: number;
  failedLogins: number;
}

export interface AnalyticsBundle {
  severity: { name: string; value: number }[];
  status: { name: string; count: number }[];
  attackTrend: { hour: string; events: number }[];
  topAttackSources: { ip: string; count: number; region: string }[];
}

export interface ActivityItem {
  id?: string | number;
  time?: string;
  message: string;
  tone: "crit" | "warn" | "info" | "success";
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: SocRole;
}

export interface DashboardPayload {
  summary: DashboardSummary;
  recentIncidents: IncidentSummary[];
  recentAlerts: SecurityAlert[];
  activity: ActivityItem[];
  analytics: AnalyticsBundle;
}

export interface DetectionRunResult {
  alertsCreated: number;
  incidentsCreated: number;
  rules: string[];
}

export interface SimulationResult {
  logsInserted: number;
  scenario: string;
  summary: string[];
}
