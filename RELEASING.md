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

## Pre-releases

The version number decides the channel, following the Marketplace's recommended convention:

| Version | Published as |
|---|---|
| Even minor: `4.0.x`, `4.2.x`, … | Normal release |
| Odd minor: `4.1.x`, `4.3.x`, … | Pre-release (GitHub *Pre-release*, Marketplace and Open VSX `--pre-release`) |

So to ship a pre-release, bump to an odd minor (`npm version 4.1.0 --no-git-tag-version`) and merge as usual. Users get it only if they choose **Switch to Pre-Release Version** on the extension page in VS Code. A version number can be used only once across both channels.

## One-time setup

### 1. VS Code Marketplace: Trusted Publishing (no token needed)

Azure DevOps retires global Personal Access Tokens on **December 1, 2026**. The workflow therefore publishes with Trusted Publishing (OpenID Connect) and stores no Marketplace token in GitHub. You do **not** need to create a PAT.

1. Open <https://marketplace.visualstudio.com/manage/publishers/universaltools> and sign in with the account that owns the **universaltools** publisher.
2. Click the **Trusted Publishing** tab (next to *Extensions*, *Details*, *Members*).
3. Expand **Create** and fill in the form exactly like this (fields are case-sensitive):

   | Field | Enter |
   |---|---|
   | Policy name | `Release workflow` |
   | Provider | `GitHub Actions` (already selected) |
   | Repository owner | `otabekoff` |
   | Repository | `universaltools` |
   | Workflow | `release.yml` |
   | Environment | `marketplace` |

   ![Trusted Publishing form](docs/trusted-publishing-form.png)

4. Click **Create**. The policy appears in the list on the same tab.

The repository is public, so the policy has no 48-hour activation deadline; it activates the first time the Release workflow publishes.

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

Open VSX serves VSCodium, Cursor, Windsurf and other VS Code–based editors. It also supports Trusted Publishing, but only for an extension that **already exists** there, so the very first version is published once with a token. Source: [Open VSX Trusted Publishing](https://github.com/eclipse/openvsx/wiki/Trusted-Publishing).

1. **Publisher Agreement:** on open-vsx.org, open **Profile**, choose **Log in with Eclipse** (create an eclipse.org account with the same GitHub username if needed), then **Show Publisher Agreement** → **Agree**.
2. **Namespace:** in user settings, click **+** next to *Namespaces* and create `universaltools`, all lower-case. It must match `"publisher"` in `package.json` exactly, or Trusted Publishing is rejected.
3. **Ownership:** creating a namespace does not make you its verified owner, and Trusted Publishing requires an owner. Open an issue at [EclipseFdn/open-vsx.org](https://github.com/EclipseFdn/open-vsx.org/issues/new/choose) with the namespace template. Because `universaltools` is also your VS Code Marketplace publisher, include a link showing you control it (the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=universaltools.universaltools) and this repository).
4. **First publish, once, with a token:** under **Access Tokens**, generate a token, then from this folder:
   ```sh
   npx ovsx publish universaltools-4.0.0.vsix -p <token>
   ```
   Delete the token afterwards; it is not needed again.
5. **Trusted Publisher:** under **Trusted Publishers**, choose the `universaltools` namespace and the extension, provider **GitHub Actions**, and enter:

   | Field | Enter |
   |---|---|
   | Organization or User name | `otabekoff` |
   | Repository name | `universaltools` |
   | Workflow filename | `release.yml` |
   | Environment name | `marketplace` |

6. **Switch it on:**
   ```sh
   gh variable set PUBLISH_OPENVSX --body true --repo otabekoff/universaltools
   ```

From the next release on, the workflow publishes to Open VSX with `ovsx publish --trusted-publishing`; no token is stored in GitHub.

## Publishing by hand (fallback)

```sh
npm ci
npm test                   # verify + package + install test
npx vsce login universaltools
npx vsce publish --packagePath universaltools-X.Y.Z.vsix
```
