import { LimitedSignupBonus, Stage } from "../types/Api";
import { getTimeString } from "./data";
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

export interface BannerItem {
	label: string,
	key: string
}

export const getBonusBanners = (bonuses: Stage["bonuses"] | undefined, signupDate: string | undefined): BannerItem[] => {
	let banners: BannerItem[] = []

	let signupLimitedBonus = bonuses?.signup?.limited_time
	if (signupLimitedBonus && limitedSignupBonusValid(signupDate, signupLimitedBonus)) {
		banners.push({
			label: `Limited signup bonus available. +${signupLimitedBonus.percentage}% bonus if you purchase within ${getTimeString(getTimeLeftLimitedSignupBonus(signupDate, signupLimitedBonus))}`,
			key: "signup-limited"
		})
	}

	let limitedBonus = bonuses?.limited_time
	let limitedDiff = new Date(limitedBonus?.end_date || "").getTime() - Date.now()

	if (limitedDiff && limitedDiff > 0) {
		banners.push({
			label: `Limited time bonus available. +${limitedBonus?.percentage}% bonus if you purchase within ${getTimeString(limitedDiff)}`,
			key: "limited"
		})
	}

	return banners
}