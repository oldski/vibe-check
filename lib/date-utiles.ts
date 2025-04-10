
export function parseLocalDate(yyyyMMdd: string): Date {
	const [year, month, day] = yyyyMMdd.split('-').map(Number)
	return new Date(year, month - 1, day)
}