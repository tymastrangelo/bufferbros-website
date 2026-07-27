/* Remounts on every navigation, giving each page a soft fade-up entrance. */
export default function Template({ children }) {
  return <div className="page-enter">{children}</div>;
}
