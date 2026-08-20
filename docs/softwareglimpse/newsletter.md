# Newsletter

## Provider abstraction

```ts
interface NewsletterProvider {
  subscribe(...)
  unsubscribe(...)
  confirm?(token)
  getStatus?(email)
}
```

Default local implementation: `FakeNewsletterProvider` (double opt-in; pending ≠ subscribed).

Enable public signup only when `newsletter.enabled` and a real provider is configured.

## Config

`newsletter` in site foundation:

- name, description, frequency expectation (do not promise weekly unless operational)
- `consentCopy` (separate from cookie consent)
- popup trigger: `manual` | `scroll` | `second-page` | `exit-intent` (exit-intent desktop-only; not default)

## Placements

`source`: header | footer | article-inline | article-end | category | tool-result | popup | exit-intent | manual

Attribution fields: `contentId`, `pageType`, `placement` — analytics only after consent allows analytics events.

## Popup rules

- Never on first paint without engagement/config
- Persist dismissed / subscribed / lastShownAt
- Suppress: subscribed, legal/newsletter paths, tools workflows, while cookie UI open
- Never stack with cookie consent modal

## Routes

- `/newsletter/confirm/` — confirmation-required | confirmed | already-subscribed | error
- `/newsletter/thanks/`
- `/newsletter/preferences/` — stub

## Contact vs newsletter

Contact form never auto-subscribes. Marketing consent is explicit on newsletter forms only.
