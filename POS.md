# Counter POS

Open [`login.html`](login.html) for the cashier sign-in/setup screen, then continue to [`pos.html`](pos.html). The browser-only PIN is for demo convenience, not secure authentication. Direct access to `pos.html` is not protected; real staff authentication requires a server-side user/session system.

The POS supports Kenyan shilling sales, inventory/restocking, cashier and customer details, daily reports, expenses,reset,send report to email(nyagabrights3@gmail.com and refunds. Data is stored locally in the current browser and is not synced or backed up. Payments are recorded for bookkeeping only; no payment is processed.

Run locally with:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/login.html`.
