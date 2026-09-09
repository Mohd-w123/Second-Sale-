# Project Execution Policy

- **Non-blocking / Auto Proceed**: Always execute actions (terminal commands, test suites, builds, file edits, migrations, and bug fixes) directly without pausing to prompt the user for permission or confirmation.
- **Continuous Execution**: Complete the user's objective end-to-end autonomously.
- **Safety**: Only pause if a command is explicitly destructive and cannot be undone (e.g. dropping production databases or permanent data deletion).
