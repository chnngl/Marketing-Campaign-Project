const API_BASE_URL = "http://localhost:4000/api";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    console.log("Fetching:", `${API_BASE_URL}${path}`);
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    let message = "Request failed";
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // ignore JSON parsing failure
    }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}