// Convert country code to flag emoji
export function getFlagEmoji(countryCode) {
  if (typeof countryCode !== "string" || countryCode.length !== 2) {
    return "";
  }
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
