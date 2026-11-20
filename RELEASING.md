# Releasing UniversalTools

Releases are automatic. When a pull request that changes `"version"` in `package.json` is merged into `master`, the [Release workflow](.github/workflows/release.yml):

1. checks every extension in the pack against the Marketplace (`npm run verify`),
2. builds the `.vsix` and installs it into a clean VS Code to check every extension arrives,
3. creates the GitHub release `vX.Y.Z` with the `.vsix` attached and the matching `CHANGELOG.md` section as notes,
4. publishes to the VS Code Marketplace, and to Open VSX if enabled.

Merges that do not change the version do nothing. Pushing a tag `vX.Y.Z` that matches `package.json` also releases.

## Making a release

1. In your branch, bump the version: `npm version minor --no-git-tag-version` (or `patch` / `major`).
2. Add a `## [X.Y.Z]` section at the top of `CHANGELOG.md`.
3. Open a PR. CI runs the same checks without publishing.
4. Merge it. The release follows within a few minutes; watch it under **Actions → Release**.

The Marketplace accepts only `major.minor.patch` versions, and each version can be published once.

## One-time setup

### 1. VS Code Marketplace: Trusted Publishing (no token needed)

Azure DevOps retires global Personal Access Tokens on **December 1, 2026**. The workflow therefore publishes with Trusted Publishing (OpenID Connect) and stores no Marketplace token in GitHub.

1. Sign in to the [Marketplace publisher management page](https://marketplace.visualstudio.com/manage) and open the publisher **universaltools**.
2. Select **Trusted Publishing** → **Create**, and enter:
   - **Policy name:** `Release workflow`
   - **Repository owner:** `otabekoff`
   - **Repository:** `universaltools`
   - **Workflow:** `release.yml`
   - **Environment:** `marketplace`
3. Select **Create**.

### 2. GitHub environment

The publishing jobs run in the `marketplace` environment, which only `master` and `v*` tags may deploy to. It is created with:

```sh
gh api -X PUT repos/otabekoff/universaltools/environments/marketplace \
  --input - <<'EOF'
{ "deployment_branch_policy": { "protected_branches": false, "custom_branch_policies": true } }
EOF
gh api -X POST repos/otabekoff/universaltools/environments/marketplace/deployment-branch-policies -f name=master -f type=branch
gh api -X POST repos/otabekoff/universaltools/environments/marketplace/deployment-branch-policies -f name='v*' -f type=tag
```

To approve every publish by hand, add yourself as a required reviewer under **Settings → Environments → marketplace**.

### 3. Open VSX (optional)

Open VSX serves VSCodium, Cursor, Windsurf and other VS Code–based editors.

1. Sign in at [open-vsx.org](https://open-vsx.org) with GitHub, sign the publisher agreement, and create an access token in your profile settings.
2. Create the namespace once: `npx ovsx create-namespace universaltools -p <token>`.
3. Store the token and switch publishing on:

```sh
gh secret set OVSX_PAT --env marketplace --repo otabekoff/universaltools   # paste the token when asked
gh variable set PUBLISH_OPENVSX --body true --repo otabekoff/universaltools
```

## Publishing by hand (fallback)

```sh
npm ci
npm test                   # verify + package + install test
npx vsce login universaltools
npx vsce publish --packagePath universaltools-X.Y.Z.vsix
```
