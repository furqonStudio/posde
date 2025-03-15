/**
 * Converts a number into Indonesian Rupiah (IDR) currency format.
 *
 * @param {number} amount - The numeric value to format.
 * @returns {string} - The formatted currency string, e.g., "Rp1.500.000".
 *
 * @example
 * console.log(formatCurrency(1500000)); // "Rp1.500.000"
 */
export const formatIndonesianCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Converts a timestamp into a 24-hour WIB (Western Indonesian Time) format.
 *
 * Mengonversi timestamp ke dalam format 24 jam WIB (Waktu Indonesia Barat).
 *
 * @param {string} dateTime - A timestamp in the format "YYYY-MM-DD HH:mm:ss". (Timestamp dalam format "YYYY-MM-DD HH:mm:ss".)
 * @returns {string} - A formatted string, e.g., "05:55 WIB, 4 Maret 2025". (String yang diformat, contoh: "05:55 WIB, 4 Maret 2025".)
 *
 * @example
 * console.log(formatDateTime("2025-03-04 05:55:47")); // "12:55 WIB, 4 Maret 2025"
 */
export const formatIndonesianDateTime = (dateTime: string): string => {
  const date = new Date(dateTime + ' UTC')

  return (
    date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }) +
    ' WIB, ' +
    date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  )
}
