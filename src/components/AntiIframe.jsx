export default function AntiIframe({ children }) {
  if (typeof window !== 'undefined' && window.top !== window.self) {
    window.top.location = window.self.location;
    return null;
  }
  return children;
}
