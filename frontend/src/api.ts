export type CrowdLevel = "low" | "moderate" | "busy" | "unknown";

export type Terminal = {
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
};

export type RouteStop = Pick<
  Terminal,
  "id" | "name" | "nameAm" | "area" | "latitude" | "longitude"
>;

export type RouteResult = {
  from: RouteStop;
  to: RouteStop;
  stops: RouteStop[];
  legs: {
    routeName: string;
    routeLongName: string;
    headsign: string;
    from: RouteStop;
    to: RouteStop;
    stops: RouteStop[];
    shape: [number, number][];
    headwayMinutes: number | null;
  }[];
  transfers: number;
  note: string;
  verified: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  messageKey?: string;
  count?: number;
};

const apiBase = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request<T>(path: string): Promise<ApiResponse<T>> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`);
  } catch {
    throw new Error("apiUnavailable");
  }

  const result = await response.json().catch(() => null) as ApiResponse<T> | null;
  if (!response.ok || !result?.success) {
    throw new Error(result?.message ?? "apiRequestFailed");
  }
  return result;
}

export async function getTerminals(): Promise<Terminal[]> {
  const result = await request<Terminal[]>("/api/terminals");
  return result.data;
}

export async function searchRoutes(from: string, to: string): Promise<ApiResponse<RouteResult[]>> {
  const params = new URLSearchParams({ from, to });
  return request<RouteResult[]>(`/api/routes/search?${params.toString()}`);
}
