# careshift

careshift is a scheduling system for medical caregivers, monitoring, incetives management and two way sync across multiple CRMs.

![Careshift](/img/ss/careshift-mobile.webp)

(These are screenshots of the actual app, not designs, sorry)

Ux of csv imports, I can talk on this for hours. Turns out building a comprehensive csv import is tricky.

- Mapping — how to visually map fields, so that its intuitive
- Feedbacks — proper feedbacks, so user knows whats going on
- SYNC — we needed to build a system to sync data (not one way import) across multiple CRMs.

![Careshift](/img/careshift-dashboard.png)

## notifications + incentives

nearby nurses would recieve in-app or sms notifications when an shift is open to be picked up.

all overtime shifts are tracked and incentives are given out. this can be automatic (gift cards are sent to nurses) or manually done by admins (for cash bonuses).

## organizations

organizations can be created, with multiple roles and fine grained permissions can be set on roles.

## audit logs

every operations is logged - creating or modifying shift, users, organizations, etc. these logs are available for admins.
