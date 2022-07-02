import { LimitedSignupBonus } from "../types/Api";
import { capitalize } from "./string";

export const limitedSignupBonusValid = (signupDate: string | undefined, bonus: LimitedSignupBonus): boolean => {
	let endDate = new Date(signupDate || "").getTime() + bonus.minutes_after_signup * 60 * 1000
	if (Date.now() > endDate) return false
	return true
}

export const getTimeLeftLimitedSignupBonus = (signupDate: string | undefined, bonus: LimitedSignupBonus): number => {
	let endDate = new Date(signupDate || "").getTime() + bonus.minutes_after_signup * 60 * 1000
	return Date.now() - endDate
}

const nameMap: Record<string, string> = {
	"base_bonus": "Stage Bonus",
	"spending_bonus": "Spending Bonus",
	"limited_time_bonus": "Limited Time Bonus",
	"first_purchase_bonus": "First Purchase Bonus"
}

export const getBonusName = (bonusKey: string) => {
	if (nameMap[bonusKey]) return nameMap[bonusKey];
	return bonusKey.split("_").map((str) => capitalize(str)).join(" ");
}