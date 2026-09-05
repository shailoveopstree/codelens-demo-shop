# demo-shop API

| Method | Path | Notes |
|---|---|---|
| POST | /auth/register | create a user, returns a session token |
| POST | /auth/login | exchange credentials for a session token |
| POST | /auth/refresh | rotate a session token |
| POST | /orders | create an order (charges the card) |
| GET  | /orders/:id | fetch an order |
| POST | /charges/:id/refund | refund a captured charge |

## Auth notes

Accounts lock after 5 consecutive failed logins. There is currently **no rate
limiting** on `/auth/login` beyond that counter.
