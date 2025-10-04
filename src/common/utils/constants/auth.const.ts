export const AUTH_EXCEPTION_COMMENTS = Object.freeze({
  EMAIL_CONFLICT: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_BLOCKED: 'User is blocked',
} as const)

export const AUTH_CONTROLLER_ROUTE = 'auth'

export const AUTH_ROUTES = {
  REGISTER: 'register',
  LOGIN: 'login',
}
