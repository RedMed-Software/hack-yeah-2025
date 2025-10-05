export const formatDateRange = ({ start, end }) => {
  if (start === end) {
    return start
  }
  return `${start} – ${end}`
}
