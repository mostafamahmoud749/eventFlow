# EventFlow

A frontend-only event discovery and ticketing portfolio project, built with Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4, and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables, backend, database, or account credentials are needed.

## Checks and static build

```bash
npm run lint
npm run typecheck
npm run build
```

Run these commands sequentially: Next.js regenerates route types during its build. Development uses `.next-dev/`, and production uses `.next/`, so a running preview cannot overwrite build manifests. `npm run build` exports the entire frontend into `out/`. Serve that folder with any static host supporting directory index files. For example, `python -m http.server 3000 --directory out`.

`npm run format` applies the same Prettier settings as Zamazon. No frontend test suite or testing dependency is included, as requested.

## Pages

| Route                                | Purpose                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| `/`                                  | Home, featured events, categories, and search                           |
| `/events`                            | Search, category/date/price/location filters, saved events, and sorting |
| `/events/[id]`                       | Event details and ticket prices                                         |
| `/events/[id]/seats`                 | Seat selection with keyboard controls and a live summary                |
| `/events/[id]/checkout`              | Contact form and demo booking confirmation                              |
| `/booking/confirmed?booking=EF-1043` | Confirmation for a booking created in this browser                      |
| `/login`, `/register`                | Controlled forms and local demo sign-in                                 |
| `/profile`                           | Editable profile, notification preference, and recent ticket            |
| `/tickets`                           | Upcoming/past demo bookings and downloadable text tickets               |
| `/dashboard`                         | Organizer overview calculated from sample data                          |
| `/dashboard/events`                  | Organizer events and saved drafts                                       |
| `/dashboard/events/new`              | Details → date/venue → seating → review                                 |
| `/dashboard/events/new?edit=...`     | Edit an existing event                                                  |
| `/dashboard/events/manage?id=...`    | Overview, reservations, seating, and settings                           |
| `/dashboard/reservations`            | Search sample reservations                                              |
| `/dashboard/settings`                | Organization preferences                                                |

## How the demo works

- Example events live in `data/events.ts`. Shared `Event`, `Seat`, `User`, and booking types live in `types/index.ts`.
- `components/common/DemoProvider.tsx` uses React context and local state. It saves profile preferences, favorite events, drafts, demo bookings, and the current hold under `eventflow-demo-v1` in localStorage. Clearing that key resets the demo. Storage failure keeps changes in memory and displays a notice.
- Login accepts any valid email with a password of at least eight characters. Passwords are never stored or transmitted; this is not authentication. Organizer and account pages stay accessible so the frontend can be explored directly.
- Selecting seats starts no timer. Continue starts a ten-minute **local demo hold**. Checkout reads that hold across navigation and refreshes, rejects expired holds, and creates a local ticket. It collects no card data and makes no payment or reservation request.
- All pricing uses EGP. Standard C7 + C8 are EGP 900, the illustrative 5% fee is EGP 45, and the total is EGP 945. The initial map is A–H with 12 seats per row, VIP A–B and Standard C–H.
- The initial ticket EF-1042 belongs to Mostafa Mahmoud, mostafa@example.com, Damietta. It is an illustrative reference ticket, so it does not consume the sample map’s C7/C8 seats. New demo tickets do mark their seats sold during this browser session and after refresh.
- Organizer counts use the 96-seat map, rather than the separate 240-seat reporting scenario illustrated in the PDF. Statistics are examples, not live sales.
- Images selected in the event form are read locally (up to 2 MB). Saving or publishing adds the event to this browser only. Local published events use `/events/local?event=...` and matching seat/checkout routes; this lets a static export show events created after the build.
- Incomplete drafts can be saved. Published events require validated details. Seat layouts and prices are fixed once a sample or demo booking exists.
- No API routes, server actions, middleware, database, Express server, real authentication, or payment integration are included. Next.js server components only render static pages at build time.

## Code organization and style

```text
app/                  Next.js pages and layouts
components/common/    Button, Input, Logo, shared demo context
components/layout/    Public header and footer
components/events/    Event cards, filters, details
components/seats/     Seat map, summary, checkout, confirmation
components/auth/      Login/register form and layout
components/profile/   Profile and tickets
components/dashboard/ Organizer pages and event form
data/                 Mock events and categories
lib/                  Small formatting, seat, and event helpers
types/                Shared TypeScript models
public/images/        Local event photography
```

Before implementation, the requested files in [Zamazon](https://github.com/mostafamahmoud749/Zamazon) were reviewed, along with its component tree, cart provider, and deals filtering component. EventFlow follows its functional default exports, PascalCase filenames, `type` props, destructured parameters, named handlers, controlled inputs, `@/` imports, feature folders, direct Tailwind classes, and exact Prettier configuration. The EventFlow PDF supplies the separate visual identity: Manrope/Inter, forest green, warm ivory, coral, and the spacing and surface tokens in `app/globals.css`.

Fonts are bundled through Fontsource; production builds do not fetch Google Fonts. Event photos are stored locally from Unsplash: [jazz](https://images.unsplash.com/photo-1511192336575-5a79af67a629), [sports](https://images.unsplash.com/photo-1522778119026-d647f0596c20), [pottery](https://images.unsplash.com/photo-1578749556568-bc2c40e68b61), [music](https://images.unsplash.com/photo-1501612780327-45045538702b), [theatre](https://images.unsplash.com/photo-1503095396549-807759245b35), and [art](https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5). They are illustrative photographs, not claims about real listed events.
