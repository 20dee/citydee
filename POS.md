# Counter POS

A standalone browser-based point-of-sale demo is available at [`pos.html`](pos.html).

Features include searchable product categories, a cart with quantity controls, configurable tax, cash change calculation, demo card/other checkout, and printable receipts. Product catalog, currency, and store identity are sample data; cart and order numbering are saved in the current browser. Checkout is simulated and does not process payments.

Run locally with:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/pos.html`.
