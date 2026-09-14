import { ArrowLeft, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ToolsPage() {
  const navigate = useNavigate();
  const origin = window.location.origin;

  // Minified, cross-compatible bookmarklet logic
  const bookmarkletCode = `javascript:(function(){
    try {
      var d = document, u = location.href;
      var expectedId = (u.match(/\\/([0-9]+)(?:\\/buy|\\?|$)/i) || [])[1];
      var p = { url: u, merchant: location.hostname.replace(/^www\\./, ''), title: '', image: '', price: null };
      
      if (u.includes('myntra.com')) {
        var scripts = Array.from(d.scripts);
        var myxScript = scripts.find(function(s) { return s.textContent.includes('window.__myx ='); });
        if (myxScript) {
          var match = myxScript.textContent.match(/window\\.__myx\\s*=\\s*(\\{.*\\})/s);
          if (match) {
            var myx = JSON.parse(match[1]);
            if (myx && myx.pdpData && (!expectedId || myx.pdpData.id == expectedId)) {
              var pdp = myx.pdpData;
              p.title = pdp.name;
              p.price = (pdp.price && (pdp.price.discounted || pdp.price.mrp)) || null;
              p.merchant = pdp.brand ? pdp.brand.name : 'Myntra';
              var img = pdp.media && pdp.media.albums && pdp.media.albums[0] && pdp.media.albums[0].images && pdp.media.albums[0].images[0];
              p.image = img ? (img.secureSrc || img.src || img.imageURL) : '';
              if (p.image) p.image = p.image.replace('h_($height),q_($qualityPercentage),w_($width)', 'h_1080,q_100,w_1080');
            }
          }
        }
      }
      
      if (!p.title) {
        p.title = (d.querySelector('meta[property="og:title"]') || {}).content || d.title;
        p.image = (d.querySelector('meta[property="og:image"]') || {}).content || '';
        var priceMeta = d.querySelector('meta[property="product:price:amount"]') || d.querySelector('meta[property="og:price:amount"]');
        if (priceMeta) p.price = parseFloat(priceMeta.content);
      }
      
      var encoded = btoa(encodeURIComponent(JSON.stringify(p)));
      window.open('${origin}/capture?payload=' + encoded, '_blank');
    } catch(e) {
      alert('TRYBUY Capture failed: ' + e.message);
    }
  })();`.replace(/\n/g, '').replace(/\s{2,}/g, ' ');

  return (
    <div className="min-h-screen bg-paper pb-24">
      <header className="px-6 py-4 bg-paper-raised border-b border-line flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          aria-label="Go back"
          className="p-2 -ml-2 rounded-full hover:bg-closed-bg focus:ring-2 focus:ring-black outline-none flex-shrink-0 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-ink" />
        </button>
        <span className="font-medium font-display text-ink tracking-tight text-lg">Capture Anywhere</span>
        <div className="w-9" />
      </header>

      <main className="px-6 py-8">
        <div className="bg-paper-raised p-6 rounded-2xl border border-line shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-bg text-blue rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-medium font-display text-ink mb-3">The Bookmarklet</h2>
          <p className="text-sm text-closed mb-8">
            Can't install the Chrome Extension? The Bookmarklet works immediately on any site, including Myntra and Amazon, with zero installation. 
          </p>

          <div className="bg-closed-bg p-4 rounded-xl border border-line mb-8 text-sm text-ink font-medium">
            Drag the button below into your browser's bookmarks bar.
          </div>

          <a 
            href={bookmarkletCode}
            onClick={(e) => { e.preventDefault(); alert("Drag this button to your bookmarks bar. Don't click it here!"); }}
            className="inline-block bg-ink text-paper px-8 py-3 rounded-full font-semibold shadow-md hover:opacity-90 transition-opacity"
          >
            Save to TRYBUY
          </a>
        </div>

        <div className="mt-8 px-2 space-y-4 text-sm text-closed">
          <h3 className="font-medium font-display text-ink uppercase tracking-wider text-xs">How it works</h3>
          <p>
            The bookmarklet runs our secure extraction logic directly inside the page you are viewing. Since it never leaves your browser, retail sites like Myntra cannot block it as a bot.
          </p>
          <p>
            When you're on a product page, simply click "Save to TRYBUY" in your bookmarks bar, and it will instantly transfer the product here.
          </p>
        </div>
      </main>
    </div>
  );
}
