/**
 * /*============================================================
 *  *          OPENSECRET - Blink Dashboard Integration
 *  *          dashboard-app-uya.caffeine.xyz
 *  *============================================================*/
 *
 * Polls 21 separate Blink wallets, surfaces top 5 by balance,
 * and detects new inbound tips in real time.
 *
 * SECURITY NOTE:
 *   API keys must NOT live in this file in production.
 *   See the "SECURITY" section below for the recommended
 *   backend proxy pattern. The WALLETS array here uses
 *   placeholder strings - populate them server-side or via
 *   environment variables injected at build time.
 *
 * USAGE:
 *   1. Replace placeholder API keys (or use the proxy pattern).
 *   2. Call BlinkDashboard.init({ onTop5Update, onNewTip, onError })
 *      once on page load.
 *   3. Wire the three callbacks into your existing caffeine.ai UI.
 */

// -------------------------------------------------------------
// SECURITY - Backend Proxy Pattern (recommended for production)
//
// Instead of calling api.blink.sv directly from the browser,
// route requests through your own server endpoint, e.g.:
//
//   POST /api/blink-proxy
//   Body: { walletKeyId: "wallet_03", variables: { ... } }
//
// Your server holds the real API keys in env vars and forwards
// the GraphQL request to Blink. The browser never sees a key.
//
// To enable: set USE_PROXY = true and set PROXY_URL below.
// -------------------------------------------------------------
const USE_PROXY = false;
const PROXY_URL = "/api/blink-proxy"; // your server endpoint

const BlinkDashboard = (() => {

  // ---------------------------------------------
  // CONFIGURATION
  // In production: load apiKey values from env vars
  // or inject them server-side - never ship real keys
  // in client-side source.
  // ---------------------------------------------
  const WALLETS = [
    { name: "Open Secret #1",  apiKey: "YOUR_API_KEY_01" },
    { name: "Open Secret #2",  apiKey: "YOUR_API_KEY_02" },
    { name: "Open Secret #3",  apiKey: "YOUR_API_KEY_03" },
    { name: "Open Secret #4",  apiKey: "YOUR_API_KEY_04" },
    { name: "Open Secret #5",  apiKey: "YOUR_API_KEY_05" },
    { name: "Open Secret #6",  apiKey: "YOUR_API_KEY_06" },
    { name: "Open Secret #7",  apiKey: "YOUR_API_KEY_07" },
    { name: "Open Secret #8",  apiKey: "YOUR_API_KEY_08" },
    { name: "Open Secret #9",  apiKey: "YOUR_API_KEY_09" },
    { name: "Open Secret #10", apiKey: "YOUR_API_KEY_10" },
    { name: "Open Secret #11", apiKey: "YOUR_API_KEY_11" },
    { name: "Open Secret #12", apiKey: "YOUR_API_KEY_12" },
    { name: "Open Secret #13", apiKey: "YOUR_API_KEY_13" },
    { name: "Open Secret #14", apiKey: "YOUR_API_KEY_14" },
    { name: "Open Secret #15", apiKey: "YOUR_API_KEY_15" },
    { name: "Open Secret #16", apiKey: "YOUR_API_KEY_16" },
    { name: "Open Secret #17", apiKey: "YOUR_API_KEY_17" },
    { name: "Open Secret #18", apiKey: "YOUR_API_KEY_18" },
    { name: "Open Secret #19", apiKey: "YOUR_API_KEY_19" },
    { name: "Open Secret #20", apiKey: "YOUR_API_KEY_20" },
    { name: "Open Secret #21", apiKey: "YOUR_API_KEY_21" },
  ];

  const BLINK_API_URL    = "https://api.blink.sv/graphql";
  const POLL_INTERVAL_MS = 10000; // 10 seconds

  // ---------------------------------------------
  // GRAPHQL QUERIES - two-step per wallet:
  //
  //  QUERY_WALLETS: gets wallet list + balances to
  //                 identify the BTC walletId.
  //
  //  QUERY_TXS:    gets latest transaction using
  //                defaultAccount.transactions with
  //                walletIds filter - the documented
  //                pattern per the Blink API spec.
  //
  // Fixes applied:
  //  [FIX 1 - HIGH]   transactions at defaultAccount level,
  //                   not on individual Wallet objects.
  //  [FIX 2 - MEDIUM] settlementDisplayAmount (documented)
  //                   instead of settlementAmount.
  //  [FIX 3 - MEDIUM] username with safe null fallback.
  //  [FIX 4 - LOW]    status field queried; only "SUCCESS"
  //                   transactions trigger onNewTip.
  // ---------------------------------------------
  const QUERY_WALLETS = `
    query GetWallets {
      me {
        username
        defaultAccount {
          wallets {
            id
            walletCurrency
            balance
          }
        }
      }
    }
  `;

  const QUERY_TXS = `
    query GetLatestTx($walletId: WalletId!) {
      me {
        defaultAccount {
          transactions(walletIds: [$walletId], first: 1) {
            edges {
              node {
                id
                status
                direction
                settlementDisplayAmount
                settlementCurrency
                memo
                createdAt
              }
            }
          }
        }
      }
    }
  `;

  // ---------------------------------------------
  // HOOKS - defaults log to console until replaced
  // ---------------------------------------------
  let onTop5Update = (wallets) => console.log("[BlinkDashboard] Top 5:", wallets);
  let onNewTip     = (tip)     => console.log("[BlinkDashboard] New tip:", tip);
  let onError      = (wallet, err) =>
    console.warn(`[BlinkDashboard] ${wallet.name}:`, err.message);

  // ---------------------------------------------
  // INTERNAL STATE
  // ---------------------------------------------
  const _lastTxIds    = {};  // walletName -> last seen txId
  const _errorBackoff = {};  // walletName -> consecutive error count
  let   _pollTimer    = null;

  // ---------------------------------------------
  // HTTP helper - direct or proxied
  // ---------------------------------------------
  async function _gql(apiKey, query, variables = {}) {
    const url     = USE_PROXY ? PROXY_URL : BLINK_API_URL;
    const headers = { "Content-Type": "application/json" };

    if (USE_PROXY) {
      // Proxy maps walletKeyId -> real API key on the server.
      // The browser never sees the actual key value.
      headers["X-Wallet-Key-Id"] = apiKey;
    } else {
      headers["X-API-KEY"] = apiKey;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  }

  // ---------------------------------------------
  // FETCH A SINGLE WALLET (two API calls)
  // ---------------------------------------------
  async function _fetchWallet(wallet) {
    // Call 1: get wallet list and balances
    const data1      = await _gql(wallet.apiKey, QUERY_WALLETS);
    const me         = data1?.me;
    if (!me) throw new Error("No user data returned");

    // [FIX 3] username may not be in all schema versions - safe fallback
    const username   = me.username ?? wallet.name;
    const allWallets = me.defaultAccount?.wallets ?? [];

    // Prefer BTC wallet, fall back to first available
    const btcWallet  = allWallets.find(w => w.walletCurrency === "BTC") ?? allWallets[0];
    if (!btcWallet) throw new Error("No BTC wallet found");

    // Call 2: get latest transaction for this specific walletId
    // [FIX 1] transactions queried at defaultAccount level with walletIds filter
    const data2      = await _gql(wallet.apiKey, QUERY_TXS, { walletId: btcWallet.id });
    const account2   = data2?.me?.defaultAccount;
    const latestEdge = account2?.transactions?.edges?.[0];
    const latestTx   = latestEdge?.node ?? null;

    return {
      name:     wallet.name,
      username,
      walletId: btcWallet.id,
      balance:  btcWallet.balance, // integer satoshis
      latestTx: latestTx ? {
        id:        latestTx.id,
        status:    latestTx.status,                 // [FIX 4] "SUCCESS"|"PENDING"|"FAILURE"
        direction: latestTx.direction,               // "RECEIVE" | "SEND"
        amount:    latestTx.settlementDisplayAmount, // [FIX 2] documented string e.g. "500"
        currency:  latestTx.settlementCurrency,      // e.g. "BTC"
        memo:      latestTx.memo ?? "",
        timestamp: latestTx.createdAt,
      } : null,
    };
  }

  // ---------------------------------------------
  // [FIX 5] STAGGERED POLLING - rate limit defence
  //
  // 21 wallets x 2 calls = 42 requests per poll cycle.
  // Split into 3 groups of 7, staggered by 3 seconds each:
  //   Group 1 fires at t=0s  (14 requests)
  //   Group 2 fires at t=3s  (14 requests)
  //   Group 3 fires at t=6s  (14 requests)
  // This spreads load vs. 42 simultaneous requests.
  // ---------------------------------------------
  function _chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
    return chunks;
  }

  async function _pollAll() {
    const groups     = _chunkArray(WALLETS, 7);
    const allResults = [];

    for (let g = 0; g < groups.length; g++) {
      if (g > 0) await new Promise(r => setTimeout(r, 3000)); // 3s stagger

      const groupResults = await Promise.allSettled(
        groups[g].map(w => _fetchWallet(w))
      );

      groupResults.forEach((result, i) => {
        const wallet = groups[g][i];
        if (result.status === "fulfilled") {
          _errorBackoff[wallet.name] = 0;
          allResults.push(result.value);
        } else {
          _errorBackoff[wallet.name] = (_errorBackoff[wallet.name] ?? 0) + 1;
          onError(wallet, result.reason);
        }
      });
    }

    // -- Top 5 by balance ----------------------------------
    const top5 = allResults
      .slice()
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)
      .map(({ name, username, walletId, balance }) => ({
        name,
        username,
        walletId,
        balance,
        balanceSats: balance.toLocaleString(), // e.g. "2,577" - matches dashboard
        balanceBTC:  (balance / 1e8).toFixed(8),
      }));

    onTop5Update(top5);

    // -- New tip detection ---------------------------------
    allResults.forEach(wallet => {
      const tx = wallet.latestTx;
      if (!tx) return;
      if (tx.direction !== "RECEIVE") return;
      if (tx.status    !== "SUCCESS") return; // [FIX 4] skip pending/failed

      const prevId = _lastTxIds[wallet.name];
      if (prevId === tx.id) return; // already seen

      _lastTxIds[wallet.name] = tx.id;
      if (prevId === undefined) return; // first poll - initialise only, don't fire

      onNewTip({
        walletName: wallet.name,   // -> "Artwork" column   e.g. "Open Secret #7"
        username:   wallet.username,
        amount:     tx.amount,     // -> "Latest TX" column e.g. "500"
        currency:   tx.currency,   // e.g. "BTC"
        comment:    tx.memo || "-", // -> "Comment" column  e.g. "Beautiful work"
        txId:       tx.id,
        timestamp:  tx.timestamp,
      });
    });
  }

  // ---------------------------------------------
  // PUBLIC API
  // ---------------------------------------------

  /**
   * Start the dashboard.
   * @param {Object} callbacks
   *   onTop5Update(wallets) - top 5 by balance, fires every poll cycle
   *   onNewTip(tip)         - fires once per new inbound tip detected
   *   onError(wallet, err)  - fires per-wallet on fetch failure [optional]
   */
  function init(callbacks = {}) {
    if (callbacks.onTop5Update) onTop5Update = callbacks.onTop5Update;
    if (callbacks.onNewTip)     onNewTip     = callbacks.onNewTip;
    if (callbacks.onError)      onError      = callbacks.onError;

    _pollAll();
    _pollTimer = setInterval(_pollAll, POLL_INTERVAL_MS);
    console.log("[BlinkDashboard] Started - polling every", POLL_INTERVAL_MS / 1000, "s");
  }

  /** Stop all polling. */
  function stop() {
    if (_pollTimer) {
      clearInterval(_pollTimer);
      _pollTimer = null;
      console.log("[BlinkDashboard] Stopped.");
    }
  }

  /** Force an immediate refresh outside the normal poll cycle. */
  function refresh() { _pollAll(); }

  return { init, stop, refresh };

})();


// ===========================================================
// WIRE-UP - connect to your caffeine.ai frontend
//
// Replace querySelector selectors with your actual element
// IDs / class names. Column mapping matches your dashboard:
//
//  BALANCE table -> Position | Artwork      | Balance
//  TIPS table    -> Latest TX | Artwork     | Comment
// ===========================================================

BlinkDashboard.init({

  // -- BALANCE TABLE ------------------------------------------
  // Fires every poll cycle with top 5 sorted by balance.
  onTop5Update(wallets) {
    // wallets[0] = #1 (highest), wallets[4] = #5
    // { name, balanceSats, balanceBTC, username }

    wallets.forEach((w, i) => {
      const row = document.querySelector(`#balance-row-${i + 1}`);
      if (!row) return;
      row.querySelector(".col-artwork").textContent = w.name;        // "Open Secret #7"
      row.querySelector(".col-balance").textContent = w.balanceSats; // "2,577"
    });
  },

  // -- TIPS TABLE ---------------------------------------------
  // Fires once per new inbound tip. Prepends so newest is
  // always the top row.
  onNewTip(tip) {
    // tip.amount     -> "Latest TX" column  e.g. "500"
    // tip.walletName -> "Artwork" column    e.g. "Open Secret #7"
    // tip.comment    -> "Comment" column    e.g. "Beautiful work"

    const tbody = document.querySelector("#tips-table tbody");
    if (!tbody) return;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="col-latest-tx">${tip.amount}</td>
      <td class="col-artwork">${tip.walletName}</td>
      <td class="col-comment">${tip.comment}</td>
    `;
    tbody.prepend(tr);
  },

  onError(wallet, error) {
    console.warn(`[${wallet.name}] fetch failed: ${error.message}`);
  }

});
