# Release Runbook

This document describes the steps needed to release a new version of Gokiburi:

## 1. Preparations

1.  [ ] Ensure latest code is fetched: `git pull --rebase origin main`
2.  [ ] Tidy go dependencies: `go mod tidy`
3.  [ ] Tidy frontend dependencies in `web/app`: `npm install; npm prune`
4.  [ ] Check for vulnerable code and dependencies: `make audit`
5.  [ ] Check code is correctly formatted: `make lint-all`
6.  [ ] Check all tests pass: `make test-all`
7.  [ ] Build new snapshot binary: `goreleaser build --snapshot --single-target`
8.  [ ] Run binary: `./dist/gokiburi_*/gokiburi`
9.  [ ] Confirm web UI loads on `http://localhost:9393/`

## 2. Manual Acceptance Test

1.  [ ] Confirm no errors in developer console
2.  [ ] Toggle on sound notifications in app bar
3.  [ ] Open settings and confirm sound notifications are active for all events
4.  [ ] Press **Run All Tests** app bar button
5.  [ ] Confirm sound notification is played
6.  [ ] Click on test and confirm output and start time are shown
7.  [ ] Click on coverage button and confirm code coverage is rendered
8.  [ ] Perform search and confirm tests are filtered
9.  [ ] Modify other filter options and confirm tests are filtered
10. [ ] Open settings and disable sound notifications for passing tests
11. [ ] Modify source file and confirm package tests are run
12. [ ] Confirm sound notification is NOT played
13. [ ] Press **Pause Automatic Test Runs** app bar button
14. [ ] Modify source file and confirm package tests are NOT run
15. [ ] Press **Resume Automatic Test Runs** app bar button
16. [ ] Confirm state goes back to **Live**
17. [ ] Press **Clear All Results** and confirm test results are cleared
18. [ ] Confirm no new errors in developer console
19. [ ] Reload UI and confirm test results are cleared
20. [ ] Press `Ctrl+C` in terminal and confirm application shuts down with no errors

## 3. Release

1.  [ ] Get next semantic release version: `make version-next`
2.  [ ] Run [Release workflow] with next version
3.  [ ] Go to [Releases page] and verify new draft release
4.  [ ] Edit release and check **Create a discussion for this release** and press the **Publish release** button

[Release workflow]: https://github.com/michenriksen/gokiburi/actions/workflows/release.yml
[Releases page]: https://github.com/michenriksen/gokiburi/releases
