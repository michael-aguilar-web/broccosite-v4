## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Design tokens

Shared colors, radii, focus rings, and heading spacing come from the Brocco design system in the brocco monorepo (`~/Documents/GitHub/brocco`, `packages/tokens`). `src/styles/brocco-tokens.css` is a copy of it, so don't edit that file here. To change a shared value, edit the tokens in the monorepo, then run this from the monorepo root to refresh the copy:

```
pnpm tokens:copy ../../Projects/broccosite-v4/src/styles/brocco-tokens.css
```

Commit the refreshed file here. `src/styles/global.css` points this site's variables (`--ink`, `--link`, `--radius-card`, and so on) at the tokens; site-only styling such as layout, callouts, and card hover stays in this repo's stylesheets. Pushing `main` deploys the site to GitHub Pages.

## UI copy

Do not add decorative or superfluous interface text—such as taglines, slogans, personality copy, helper labels, or explanatory microcopy—unless the user explicitly requests it. Preserve concise existing wording when making visual changes.
