// Escapes user-supplied text before it's used inside `new RegExp()`.
// Without this, characters like ( ) . * + ? [ ] etc. in a search box let a
// user build an expensive/broken pattern (ReDoS risk) or match unintended
// records. Always run free-text search input through this first.
export function escapeRegex(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
