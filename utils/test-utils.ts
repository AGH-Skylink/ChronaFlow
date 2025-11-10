/**
 * @deprecated Feature modules now expose their own timing helpers.
 */
export function randomTime(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

/**
 * @deprecated Feature modules now expose their own emoji helpers.
 */
export function randomEmoji(): string {
  const emojis = [
    "🌙",
    "🌑",
    "🌓",
    "🌕",
    "🌠",
    "⭐",
    "🌟",
    "🪐",
    "🚀",
    "🛸",
    "🌌",
    "☄️",
  ];
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
}