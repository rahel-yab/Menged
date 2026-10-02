export type CrowdLevel = "low" | "moderate" | "busy" | "unknown";

export interface Terminal {
  id: number;
  name: string;
  nameAm: string;
  area: string;
  areaAm: string;
  latitude: number;
  longitude: number;
  routes: string[];
  crowdLevel: CrowdLevel;
  estimatedWaitMinutes: number | null;
  verified: boolean;
}