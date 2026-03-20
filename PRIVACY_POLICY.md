# Privacy Policy — TabFlow

**Last updated:** March 20, 2026

## Overview

TabFlow is a browser extension for tab and session management. It is designed with privacy as a core principle — your data never leaves your browser.

## Data Collection

TabFlow does **not** collect, transmit, or share any personal data. Specifically:

- **No analytics or tracking** — no usage data is collected
- **No external network requests** — TabFlow makes zero HTTP requests to any server
- **No accounts or sign-in** — no authentication is required
- **No third-party services** — no ads, no analytics SDKs, no telemetry

## Data Storage

All data is stored **locally on your device** using the browser's built-in `chrome.storage.local` API. This includes:

- Saved sessions (tab groups and URLs)
- Theme preference (light/dark mode)

This data stays on your machine and is never transmitted anywhere. If you uninstall TabFlow, all stored data is automatically removed by the browser.

## Export / Import

TabFlow provides a manual export/import feature that saves your sessions as a JSON file to your local filesystem. This file is created by you and stays on your device — it is not uploaded anywhere.

## Permissions

TabFlow requests the following browser permissions:

| Permission | Purpose |
|---|---|
| `tabs` | Read open tab titles and URLs to display and manage them |
| `tabGroups` | Read and create Chrome tab groups |
| `storage` | Save sessions and preferences locally |

## Changes to This Policy

If this policy is updated, the changes will be posted in the GitHub repository.

## Contact

If you have questions about this privacy policy, open an issue at [github.com/rizrepos/tab-flow](https://github.com/rizrepos/tab-flow/issues).
