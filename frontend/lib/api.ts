const DEFAULT_API_PORT = "8000";

export function getApiBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (typeof window === "undefined") {
    return `http://localhost:${DEFAULT_API_PORT}`;
  }

  return `${window.location.protocol}//${window.location.hostname}:${DEFAULT_API_PORT}`;
}

export function getBackendConnectionHint() {
  if (typeof window === "undefined") {
    return "Start FastAPI on http://localhost:8000.";
  }

  const backendUrl = getApiBaseUrl();
  const networkHint =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? ""
      : " If you opened the frontend from a network URL, start FastAPI with `uvicorn app.main:app --reload --host 0.0.0.0`.";

  return `Could not connect to the backend at ${backendUrl}.${networkHint}`;
}
