# Brew Loyalty MVP - Project CLAUDE.md

## What this is
A no-app digital punch card for independent coffee shops.
First live pilot: Odds Cafe, West Asheville (Audrie).

## Stack
- Next.js 15 App Router, TypeScript, Tailwind CSS 4
- Supabase (Postgres + Auth + Row Level Security)
- Resend for transactional + weekly email
- Vercel deployment

## Three user types
1. Owner - dashboard, customer list, weekly report
2. Barista - PIN-protected stamp/redeem screen on shared device
3. Customer - punch card view, no login required

## Hard scope rules - do not violate without explicit Juan approval
- No POS integration
- No SMS
- No native apps (PWA only)
- No multi-location features per shop
- No customer login (magic link or phone lookup only)
- No tiered pricing (one price, one product)
- Customer-facing pages show SHOP branding, not Brew Loyalty branding

## Current pilot status
- Odds Cafe: ACTIVE - barista flow live, weekly emails running
- Dynamite Roasting: warm prospect, not started
- Bad Manners: cold prospect, not started

## Active sprint
See SESSION-BRIEF.md in this directory when present.

## Inherited context
Global PKDO identity and constraints apply.
See global CLAUDE.md for working style, communication preferences, and AI playbook.
