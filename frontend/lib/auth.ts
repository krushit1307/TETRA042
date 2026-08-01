const AUTH_KEY = "sasya_admin_session"

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@sasyaai.com"
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123"

export function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return localStorage.getItem(AUTH_KEY) === "true"
}

export function login(email: string, password: string): boolean {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem(AUTH_KEY, "true")
        return true
    }
    return false
}

export function logout(): void {
    localStorage.removeItem(AUTH_KEY)
}
