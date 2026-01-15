export default function ThemeScript() {
  const code = `
  (function () {
    try {
      var saved = localStorage.getItem('theme'); // 'light' | 'dark' | 'system'
      if (!saved) saved = 'light';               // match SSR default
      document.documentElement.setAttribute('data-theme', saved);
    } catch (e) {}
  })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}