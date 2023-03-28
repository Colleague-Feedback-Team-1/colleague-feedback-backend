export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/
  return regex.test(username)
}
