/* Indeva Studio — shared sign-in extras for Supabase email/password pages.
 * Adds: show/hide password, "Forgot password?" (email reset link), set-new-password after the link,
 * and "Change password" for a signed-in user.
 * Usage (after supabase.createClient):  AuthKit.init(sb, { form, email, password, changeBefore, toggleLogin })
 */
(function () {
  // Capture the reset-link result before supabase-js clears the URL hash.
  const h = new URLSearchParams((location.hash || "").replace(/^#/, ""));
  const q = new URLSearchParams(location.search);
  const RECOVERY = h.get("type") === "recovery" || q.get("type") === "recovery";
  const LINK_ERROR = h.get("error_description") || q.get("error_description");
  const MIN = 8;

  const css = `
  .ak-pw{position:relative;display:block}
  .ak-pw input{padding-right:64px !important}
  .ak-eye{position:absolute;right:6px;top:50%;transform:translateY(-50%);border:0;background:none;padding:6px 8px;
    font:inherit;font-size:13px;font-weight:600;color:var(--muted,#6B706C);cursor:pointer;border-radius:6px}
  .ak-eye:hover{color:var(--ink,#1E2422)}
  .ak-link{border:0;background:none;padding:2px 0;font:inherit;font-size:14px;font-weight:600;color:var(--ink,#1E2422);
    text-decoration:underline;text-underline-offset:3px;cursor:pointer;justify-self:start}
  .ak-msg{font-size:14px;min-height:1em}
  .ak-msg.err{color:var(--out,#A5432F)} .ak-msg.ok{color:var(--in,#2E6A4C)}
  .ak-overlay{position:fixed;inset:0;z-index:1000;background:var(--paper,#F5F5F0);display:grid;place-items:center;padding:24px 16px;overflow:auto}
  .ak-dlg{border:1px solid var(--line,#DCDDD5);border-radius:12px;padding:0;max-width:400px;width:calc(100% - 32px);background:var(--card,#fff);color:inherit}
  .ak-dlg::backdrop{background:rgba(30,36,34,.35)}
  .ak-form{display:grid;gap:14px;width:100%;max-width:360px}
  .ak-dlg .ak-form{padding:20px;max-width:none}
  .ak-form h2{margin:0;font-size:22px;font-weight:800;letter-spacing:-.01em}
  .ak-form label{display:grid;gap:5px;font-size:13px;font-weight:600;color:var(--muted,#6B706C)}
  .ak-form input{width:100%;border:1px solid var(--line,#DCDDD5);background:var(--card,#fff);border-radius:8px;padding:10px 12px;font:inherit;font-size:16px;font-weight:500;color:inherit}
  .ak-row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap}
  .ak-hint{font-size:12px;color:var(--muted,#6B706C);margin-top:-8px}`;
  const style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const say = (node, text, ok) => { node.textContent = text || ""; node.className = "ak-msg " + (ok ? "ok" : "err"); };
  const busy = (btn, on, label) => { btn.disabled = on; if (label) btn.textContent = label; };

  function addToggle(input) {
    if (!input || input.dataset.akEye) return;
    input.dataset.akEye = "1";
    const wrap = document.createElement("span"); wrap.className = "ak-pw";
    input.parentNode.insertBefore(wrap, input); wrap.appendChild(input);
    const b = el(`<button type="button" class="ak-eye" aria-label="Show password" aria-pressed="false">Show</button>`);
    b.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      b.textContent = show ? "Hide" : "Show";
      b.setAttribute("aria-pressed", String(show)); b.setAttribute("aria-label", show ? "Hide password" : "Show password");
      input.focus();
    });
    wrap.appendChild(b);
  }
  function hideAll(root) { root.querySelectorAll(".ak-pw input").forEach((i) => (i.type = "password")); root.querySelectorAll(".ak-eye").forEach((b) => { b.textContent = "Show"; b.setAttribute("aria-pressed", "false"); }); }

  function checkNew(pw, confirm) {
    if (pw.length < MIN) return `Use at least ${MIN} characters.`;
    if (pw !== confirm) return "The two new passwords don't match.";
    return "";
  }
  const friendly = (e) => {
    const m = String(e?.message || e || "");
    if (/rate limit|too many|security purposes/i.test(m)) return "Too many attempts. Please wait a few minutes and try again.";
    if (/same.*password|different from the old/i.test(m)) return "Choose a password different from your current one.";
    if (/weak|short/i.test(m)) return `That password is too weak. Use at least ${MIN} characters with a mix of letters and numbers.`;
    return m || "Something went wrong. Please try again.";
  };

  function init(sb, opts) {
    const form = document.querySelector(opts.form);
    const emailIn = document.querySelector(opts.email);
    const passIn = document.querySelector(opts.password);
    if (opts.toggleLogin !== false) addToggle(passIn);

    /* ---- Forgot password ---- */
    const forgot = el(`<form class="ak-form" hidden novalidate>
      <div><h2>Reset your password</h2><div class="ak-hint" style="margin-top:4px">We'll email you a link to set a new password.</div></div>
      <label>Email <input type="email" autocomplete="username" required></label>
      <button class="btn primary" type="submit">Send reset link</button>
      <div class="ak-msg" role="status"></div>
      <button type="button" class="ak-link">Back to sign in</button></form>`);
    form.parentNode.insertBefore(forgot, form.nextSibling);
    const fEmail = forgot.querySelector("input"), fBtn = forgot.querySelector(".btn"), fMsg = forgot.querySelector(".ak-msg");
    const link = el(`<button type="button" class="ak-link">Forgot password?</button>`);
    const submit = form.querySelector('[type="submit"]');
    submit.parentNode.insertBefore(link, submit.nextSibling);
    link.addEventListener("click", () => { fEmail.value = emailIn.value.trim(); say(fMsg, ""); form.hidden = true; forgot.hidden = false; fEmail.focus(); });
    forgot.querySelector(".ak-link").addEventListener("click", () => { forgot.hidden = true; form.hidden = false; });
    forgot.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = fEmail.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) return say(fMsg, "Enter the email you sign in with.");
      busy(fBtn, true, "Sending…");
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
      busy(fBtn, false, "Send reset link");
      if (error && /rate limit|too many|security purposes/i.test(error.message)) return say(fMsg, friendly(error));
      // Same message whether or not the account exists, so emails can't be probed.
      say(fMsg, "If an account exists for " + email + ", a reset link is on its way. Check your inbox and spam folder.", true);
    });

    /* ---- Set new password (after clicking the emailed link) ---- */
    let overlay = null;
    function showRecovery() {
      if (overlay) return;
      overlay = el(`<div class="ak-overlay" role="dialog" aria-modal="true" aria-labelledby="akRecT"><form class="ak-form" novalidate>
        <div><h2 id="akRecT">Set a new password</h2><div class="ak-hint" style="margin-top:4px">Choose a password you haven't used here before.</div></div>
        <label>New password <input type="password" autocomplete="new-password" required></label>
        <div class="ak-hint">At least ${MIN} characters.</div>
        <label>Confirm new password <input type="password" autocomplete="new-password" required></label>
        <button class="btn primary" type="submit">Save new password</button>
        <div class="ak-msg" role="status"></div></form></div>`);
      document.body.appendChild(overlay);
      const [p1, p2] = overlay.querySelectorAll("input"); addToggle(p1); addToggle(p2);
      const f = overlay.querySelector("form"), b = f.querySelector(".btn"), m = f.querySelector(".ak-msg");
      p1.focus();
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const bad = checkNew(p1.value, p2.value); if (bad) return say(m, bad);
        busy(b, true, "Saving…");
        const { error } = await sb.auth.updateUser({ password: p1.value });
        busy(b, false, "Save new password");
        if (error) return say(m, friendly(error));
        say(m, "Password updated. You're signed in.", true);
        history.replaceState(null, "", location.pathname);
        setTimeout(() => { overlay.remove(); overlay = null; }, 1200);
      });
    }
    if (RECOVERY) showRecovery();
    sb.auth.onAuthStateChange((evt) => { if (evt === "PASSWORD_RECOVERY") showRecovery(); });
    if (LINK_ERROR) {
      history.replaceState(null, "", location.pathname);
      fEmail.value = ""; form.hidden = true; forgot.hidden = false;
      say(fMsg, /expired|invalid/i.test(LINK_ERROR) ? "That reset link has expired or was already used. Send yourself a new one." : LINK_ERROR);
    }

    /* ---- Change password (signed in) ---- */
    const anchor = opts.changeBefore && document.querySelector(opts.changeBefore);
    if (anchor) {
      const btn = el(`<button type="button" class="${anchor.className || "btn small"}">${opts.changeHtml || "Change password"}</button>`);
      if (opts.beforeChangeOpen) btn.addEventListener("click", opts.beforeChangeOpen);
      anchor.parentNode.insertBefore(btn, anchor);
      const dlg = el(`<dialog class="ak-dlg" aria-labelledby="akChT"><form class="ak-form" novalidate>
        <h2 id="akChT">Change password</h2>
        <label>Current password <input type="password" autocomplete="current-password" required></label>
        <label>New password <input type="password" autocomplete="new-password" required></label>
        <div class="ak-hint">At least ${MIN} characters.</div>
        <label>Confirm new password <input type="password" autocomplete="new-password" required></label>
        <div class="ak-msg" role="status"></div>
        <div class="ak-row"><button type="button" class="btn" value="cancel">Cancel</button><button class="btn primary" type="submit">Update password</button></div>
      </form></dialog>`);
      document.body.appendChild(dlg);
      const [cur, n1, n2] = dlg.querySelectorAll("input"); [cur, n1, n2].forEach(addToggle);
      const f = dlg.querySelector("form"), m = f.querySelector(".ak-msg"), ok = f.querySelector('[type="submit"]');
      const close = () => { f.reset(); hideAll(dlg); say(m, ""); dlg.close(); };
      f.querySelector('[value="cancel"]').addEventListener("click", close);
      btn.addEventListener("click", () => { f.reset(); hideAll(dlg); say(m, ""); dlg.showModal(); cur.focus(); });
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!cur.value) return say(m, "Enter your current password.");
        const bad = checkNew(n1.value, n2.value); if (bad) return say(m, bad);
        if (n1.value === cur.value) return say(m, "Choose a password different from your current one.");
        busy(ok, true, "Updating…");
        const { data: { user } } = await sb.auth.getUser();
        const email = user?.email;
        if (!email) { busy(ok, false, "Update password"); return say(m, "Your session has ended. Please sign in again."); }
        const re = await sb.auth.signInWithPassword({ email, password: cur.value });
        if (re.error) { busy(ok, false, "Update password"); return say(m, /invalid/i.test(re.error.message) ? "Current password is incorrect." : friendly(re.error)); }
        const { error } = await sb.auth.updateUser({ password: n1.value });
        busy(ok, false, "Update password");
        if (error) return say(m, friendly(error));
        say(m, "Password updated.", true);
        setTimeout(close, 1200);
      });
    }
  }
  window.AuthKit = { init };
})();
