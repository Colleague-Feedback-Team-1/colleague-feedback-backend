import validator from 'validator'

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function isValidUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9]+$/
  return regex.test(username)
}

interface Section {
  sectionName: string;
  questions: Question[];
}

interface Question {
  score?: number;
  openFeedback?: string;
}

export function validateFeedbackData(requestid: string, employeeid: string, sections: Section[]): boolean {
  if (!validator.isAlphanumeric(requestid) || !validator.isAlphanumeric(employeeid)) {
    return false
  }
  for (const section of sections) {
    // Validate sectionName field
    if (!validator.whitelist(section.sectionName, 'a-zA-Z0-9\\s')) {
      return false
    }
    for (const question of section.questions) {
      // Validate question field
      if (
        question.score !== undefined &&
        (!validator.isInt(String(question.score), { min: 1, max: 5 }) || isNaN(question.score))
      ) {
        return false
      }
      if (
        question.openFeedback !== undefined &&
        !validator.whitelist(question.openFeedback, 'a-zA-Z0-9\\s')
      ) {
        return false
      }
    }
  }
  return true
}
