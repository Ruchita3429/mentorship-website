const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...getAuthHeaders(),
    },
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors for empty responses
  }

  if (!res.ok) {
    const message =
      data?.message || data?.error || `Request failed with ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// Auth
export function signup(payload) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiRequest("/api/auth/me", {
    method: "GET",
  });
}

// Students
export function createStudent(payload) {
  return apiRequest("/api/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStudents() {
  return apiRequest("/api/students", {
    method: "GET",
  });
}

// Lessons
export function createLesson(payload) {
  return apiRequest("/api/lessons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLessons() {
  return apiRequest("/api/lessons", {
    method: "GET",
  });
}

// Bookings (reserved for later use)
export function createBooking(payload) {
  return apiRequest("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// LLM summarize
export function summarizeText(text) {
  return apiRequest("/api/llm/summarize", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

