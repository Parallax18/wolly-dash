import { LimitedSignupBonus } from "../types/Api";

export const limitedSignupBonusValid = (signupDate: string | undefined, bonus: LimitedSignupBonus): boolean => {
	let endDate = new Date(signupDate || "").getTime() + bonus.minutes_after_signup * 60 * 1000
	if (Date.now() > endDate) return false
	return true
}

export const getTimeLeftLimitedSignupBonus = (signupDate: string | undefined, bonus: LimitedSignupBonus): number => {
	let endDate = new Date(signupDate || "").getTime() + bonus.minutes_after_signup * 60 * 1000
	return Date.now() - endDate
}