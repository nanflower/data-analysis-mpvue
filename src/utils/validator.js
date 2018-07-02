export const isNum = (str, limit = 20) => {
  if (!str) return false
  let reg = new RegExp('^\\d{1,' + limit + '}$')
  return reg.test(str)
}
