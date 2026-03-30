/** Format VND: 15990000 → "15.990.000" */
export function formatVND(value: number): string {
  return value.toLocaleString('vi-VN')
}

/** Format date: ISO string → "dd/MM/yyyy" */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
