# demo-shop API

| Method | Path | Notes |
|---|---|---|
| POST | /auth/register | create a user, returns a session token |
| POST | /auth/login | exchange credentials for a session token |
| POST | /auth/refresh | rotate a session token |
| POST | /auth/unlock/:userId | clear an account's failed-login lockout (admin) |
| POST | /orders | create an order (charges the card) |
| GET  | /orders/:id | fetch an order |
| POST | /charges/:id/refund | refund a captured charge |

## Auth notes

Accounts lock after `LOCKOUT_MAX` (default 5) consecutive failed logins. An
operator can clear a lockout via `POST /auth/unlock/:userId`, which also drops
the account's active sessions. There is currently **no rate limiting** on
`/auth/login` beyond the failed-login counter.
