# Contributing

Keep SDD and TDD small. Improve how specifications, tests and implementation agree without turning the skill into a rigid project template or a catalog of tool-specific instructions.

For changes to the method, include a realistic request, the starting artifacts and the observed result. Packaging checks cannot prove that an agent follows the method well. Useful checks include a bug fix with an already-correct specification and a refactor whose public behavior must stay unchanged.

## Development

Edit `skills/sdd-and-tdd/SKILL.md` directly. It is the source of truth; `agents/openai.yaml` provides optional Codex UI metadata. Run the repository checks with Node.js 24+:

```sh
npm test
```

No dependency installation or build is needed. CI checks packaging, release metadata and local documentation links on macOS, Windows and Linux. It does not evaluate agent behavior or guarantee software correctness.

## Releases

Use SemVer in `package.json` for skill releases, including documentation updates:

1. Update the version and `CHANGELOG.md`.
2. Run the checks and review the skill changes.
3. Commit and push main, then create an immutable `v<version>` tag.
4. CI publishes a GitHub release after the checks pass. Verify installation from that tag.

Never move a published tag. GitHub hosts the skill; there is no npm package or runtime to publish. Installed projects update explicitly.

## Pull requests

Explain the outcome and checks performed. Use concise English commit messages. Do not include credentials, private project data or task histories.

Contributions are licensed under this repository's MIT license. No CLA or DCO is required.
