/**
 * Blink Dashboard API Integration
 * Fetches data for 21 wallets, tracks top 5 by balance,
 * and surfaces the latest tip (tx) per wallet in real time.
 *
 * Usage:
 *   1. Fill in WALLETS config below with each wallet's name and API key.
 *   2. Call BlinkDashboard.init() on page load.
 *   3. Implement the three callback hooks to wire into your existing UI:
 *        onTop5Update(wallets)   â€” fired when top 5 balances change
 *        onNewTip(tip)           â€” fired when a new transaction is detected
 *        onError(wallet, error)  â€” fired on any fetch failure
 */

const BlinkDashboard = (() => {

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CONFIGURATION â€” fill in your 21 wallets here
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const WALLETS = [
    { name: "Wallet 01", apiKey: "YOUR_API_KEY_01" },
    { name: "Wallet 02", apiKey: "YOUR_API_KEY_02" },
    { name: "Wallet 03", apiKey: "YOUR_API_KEY_03" },
    { name: "Wallet 04", apiKey: "YOUR_API_KEY_04" },
    { name: "Wallet 05", apiKey: "YOUR_API_KEY_05" },
    { name: "Wallet 06", apiKey: "YOUR_API_KEY_06" },
    { name: "Wallet 07", apiKey: "YOUR_API_KEY_07" },
    { name: "Wallet 08", apiKey: "YOUR_API_KEY_08" },
    { name: "Wallet 09", apiKey: "YOUR_API_KEY_09" },
    { name: "Wallet 10", apiKey: "YOUR_API_KEY_10" },
    { name: "Wallet 11", apiKey: "YOUR_API_KEY_11" },
    { name: "Wallet 12", apiKey: "YOUR_API_KEY_12" },
    { name: "Wallet 13", apiKey: "YOUR_API_KEY_13" },
    { name: "Wallet 14", apiKey: "YOUR_API_KEY_14" },
    { name: "Wallet 15", apiKey: "YOUR_API_KEY_15" },
    { name: "Wallet 16", apiKey: "YOUR_API_KEY_16" },
    { name: "Wallet 17", apiKey: "YOUR_API_KEY_17" },
    { name: "Wallet 18", apiKey: "YOUR_API_KEY_18" },
    { name: "Wallet 19", apiKey: "YOUR_API_KEY_19" },
    { name: "Wallet 20", apiKey: "YOUR_API_KEY_20" },
    { name: "Wallet 21", apiKey: "YOUR_API_KEY_21" },
  ];

  const API_URL = "https://api.blink.sv/graphql";
  const POLL_INTERVAL_MS = 10000; // Poll every 10 seconds

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // HOOKS â€” wire these into your existing UI
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Called whenever the top 5 balances change.
   * @param {Array} wallets - Sorted array of top 5 wallet objects:
   *   [{ name, balance, username, walletId }, ...]
   *   balance is in satoshis (integer)
   */
  let onTop5Update = (wallets) => {
    console.log("[BlinkDashboard] Top 5 updated:", wallets);
  };

  /**
   * Called whenever a NEW tip (inbound transaction) is detected on any wallet.
   * Fires once per new transaction, in real time (within one poll cycle).
   * @param {Object} tip - { walletName, username, amount, memo, txId, timestamp }
   *   amount is in satoshis (integer)
   */
  let onNewTip = (tip) => {
    console.log("[BlinkDashboard] New tip:", tip);
  };

  /**
   * Called when a wallet fetch fails.
   * @param {Object} wallet - The wallet config { name, apiKey }
   * @param {Error} error
   */
  let onError = (wallet, error) => {
    console.warn(`[BlinkDashboard] Error fetching ${wallet.name}:`, error.message);
  };

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // INTERNAL STATE
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const _lastTxIds = {}; // walletName -> last seen txId
  let _pollTimer = null;

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // GRAPHQL QUERY
  // Fetches username, BTC balance, and the latest transaction
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const QUERY = `
    query DashboardWalletData {
      me {
        username
        defaultAccount {
          wallets {
            id
            walletCurrency
            balance
            transactions(first: 1) {
              edges {
                node {
                  id
                  direction
                  settlementAmount
                  memo
                  createdAt
                }
              }
            }
          }
        }
      }
    }
  `;

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // FETCH A SINGLE WALLET
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function _fetchWallet(wallet) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": wallet.apiKey,
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const me = json.data?.me;
    if (!me) throw new Error("No user data returned");

    const username = me.username;
    const wallets = me.defaultAccount?.wallets ?? [];

    // Prefer the BTC wallet; fall back to first wallet
    const btcWallet = wallets.find(w => w.walletCurrency === "BTC") ?? wallets[0];
    if (!btcWallet) throw new Error("No wallet found");

    const balance = btcWallet.balance; // satoshis
    const walletId = btcWallet.id;

    const latestEdge = btcWallet.transactions?.edges?.[0];
    const latestTx = latestEdge?.node ?? null;

    return {
      name: wallet.name,
      username,
      walletId,
      balance,
      latestTx: latestTx ? {
        id: latestTx.id,
        direction: latestTx.direction,   // "RECEIVE" | "SEND"
        amount: latestTx.settlementAmount, // satoshis, negative for sends
        memo: latestTx.memo ?? "",
        timestamp: latestTx.createdAt,
      } : null,
    };
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // POLL ALL 21 WALLETS IN PARALLEL
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async function _pollAll() {
    const results = await Promise.allSettled(
      WALLETS.map(w => _fetchWallet(w))
    );

    const successful = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        successful.push(result.value);
      } else {
        onError(WALLETS[i], result.reason);
      }
    });

    // â”€â”€ Top 5 by balance â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const top5 = successful
      .slice()
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5)
      .map(({ name, username, walletId, balance }) => ({
        name, username, walletId, balance,
        balanceBTC: (balance / 1e8).toFixed(8),        // formatted BTC string
        balanceSats: balance.toLocaleString() + " sats" // formatted sats string
      }));

    onTop5Update(top5);

    // â”€â”€ New tips detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // A "tip" is any RECEIVE transaction we haven't seen before
    successful.forEach(wallet => {
      const tx = wallet.latestTx;
      if (!tx) return;
      if (tx.direction !== "RECEIVE") return;

      const prevId = _lastTxIds[wallet.name];
      if (prevId === tx.id) return; // already seen

      // It's new â€” fire the hook
      _lastTxIds[wallet.name] = tx.id;

      // Skip firing on the very first poll (just initialise state)
      if (prevId === undefined) return;

      onNewTip({
        walletName: wallet.name,
        username: wallet.username,
        amount: tx.amount,
        amountBTC: (tx.amount / 1e8).toFixed(8),
        amountSats: tx.amount.toLocaleString() + " sats",
        memo: tx.memo,
        txId: tx.id,
        timestamp: tx.timestamp,
      });
    });
  }

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PUBLIC API
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  /**
   * Start the dashboard polling.
   * @param {Object} callbacks
   *   {
   *     onTop5Update: (wallets) => void,
   *     onNewTip:     (tip) => void,
   *     onError:      (wallet, error) => void   [optional]
   *   }
   */
  function init(callbacks = {}) {
    if (callbacks.onTop5Update) onTop5Update = callbacks.onTop5Update;
    if (callbacks.onNewTip)     onNewTip     = callbacks.onNewTip;
    if (callbacks.onError)      onError      = callbacks.onError;

    // Run immediately, then on interval
    _pollAll();
    _pollTimer = setInterval(_pollAll, POLL_INTERVAL_MS);

    console.log("[BlinkDashboard] Started. Polling every", POLL_INTERVAL_MS / 1000, "seconds.");
  }

  /** Stop polling. */
  function stop() {
    if (_pollTimer) {
      clearInterval(_pollTimer);
      _pollTimer = null;
      console.log("[BlinkDashboard] Stopped.");
    }
  }

  /** Trigger an immediate refresh outside of the poll cycle. */
  function refresh() {
    _pollAll();
  }

  return { init, stop, refresh };

})();


// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// EXAMPLE â€” wire into your existing dashboard UI
// Remove or replace with your actual UI code.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

BlinkDashboard.init({

  // Called whenever top 5 balances change
  onTop5Update(wallets) {
    // wallets = [{ name, username, balance, balanceBTC, balanceSats }, ...]
    // Example: update your leaderboard rows
    wallets.forEach((w, i) => {
      const row = document.querySelector(`#top5-row-${i + 1}`);
      if (!row) return;
      row.querySelector(".wallet-name").textContent  = w.name;
      row.querySelector(".wallet-balance").textContent = w.balanceSats;
    });
  },

  // Called when a new inbound tip is detected
  onNewTip(tip) {
    // tip = { walletName, username, amount, amountSats, amountBTC, memo, txId, timestamp }
    // Example: prepend to your Tips feed
    const feed = document.querySelector("#tips-feed");
    if (!feed) return;

    const item = document.createElement("div");
    item.className = "tip-item";
    item.innerHTML = `
      <span class="tip-wallet">${tip.walletName}</span>
      <span class="tip-amount">${tip.amountSats}</span>
      <span class="tip-memo">${tip.memo || "â€”"}</span>
    `;
    feed.prepend(item); // newest tip at top
  },

  // Optional: handle errors per wallet
  onError(wallet, error) {
    console.warn(`Could not reach ${wallet.name}: ${error.message}`);
  }

});
