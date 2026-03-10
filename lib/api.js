// lib/api.js

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// ---------- Token Helper ----------

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

// ---------- Core Request Helper ----------

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let json = null;

  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    const message = json?.message || "Request failed";
    throw new Error(message);
  }

  // unwrap { success, data }
  return json.data || json;
}

// ---------- Auth APIs ----------

export function signup(payload) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return request("/api/auth/me");
}

// ---------- Students ----------

export function createStudent(payload) {
  return request("/api/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getStudents() {
  return request("/api/students");
}

// ---------- Lessons ----------

export function createLesson(payload) {
  return request("/api/lessons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLessons() {
  return request("/api/lessons");
}

// ---------- Bookings ----------

export function createBooking(payload) {
  return request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------- Sessions ----------

export function createSession(payload) {
  return request("/api/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLessonSessions(lessonId) {
  return request(`/api/lessons/${lessonId}/sessions`);
}

// ---------- LLM Summarization ----------

export function summarizeText(text) {
  return request("/api/llm/summarize", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}