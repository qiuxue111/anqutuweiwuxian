// Supabase JS client for browser
(function() {
  if (window.supabasejs) return;
  
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = function() {
    // After load, supabase.createClient should be available
    // The UMD build typically sets window.supabase
    if (window.supabase) {
      window.supabasejs = window.supabase;
    }
  };
  document.head.appendChild(script);
})();
