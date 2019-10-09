/* eslint-disable no-irregular-whitespace */
/* eslint-disable  func-names */
/* eslint-disable max-len */
/* eslint quote-props: ['error', 'consistent'] */
module.exports = {
  'COMMAND_EN_US':{
    'save_changeset':'Git stash will temporarily store any changes you have made since your last commit.',
    'restore_changeset':'Git stash pop or git stash apply will restore the most recently stashed files',
    'get_changeset':'Git stash list, lists all stashed changesets',
    'remove_changeset':'Git stash drop, will discards the most recently stashed changeset',
    'get_history':'Git log lists version history for the current branch, Git log dash dash follow [file],Lists version history for a file, including renames',
    'get_differences':'Git diff shows file differences not yet staged, Git diff [first-branch]…[second-branch] shows content differences between two branches',
    'get_commit':'Git show [commit] outputs metadata and content changes of the specified commit',
    'undo_commit':'Git reset [commit] undoes all commits afer [commit], preserving changes locally, git reset --hard [commit] discards all history and changes back to the specified commit',
    'get_branch':'git branch lists all local branches in the current repository',
    'add_file':'Git add [file] snapshots the file in preparation for versioning',
    'add_commit':'Git commit dash m "[descriptive message]" records file snapshots permanently in version history',
    'add_branch':'git push [alias] [branch] uploads all local branch commits to GitHub',
    'get_repository':'Git pull downloads bookmark history and incorporates changes, basically a git fetch and git merge in one!',
    'create_repository':'Git init creates a new local repository with the specified name',
    'copy_repository':'Git clone [url] downloads a project and its entire version history',
    'get_file':'Git status lists all new or modified files to be commited',
    'undo_file':'Git reset [file] unstages the file, but preserve its contents',
    'create_branch':'git branch-name creates a new branch, git branch -b [branch-name] creates a new branch and switches your working branch to that branch',
    'switch_branch':'git checkout [branch-name] switches to the specified branch and updates the working directory',
    'merge_branch':'git merge [branch] combines the specified branch’s history into the current branch',
    'remove_branch':'git branch dash d [branch-name] deletes the specified branch locally, git push -d <remote_name> <branch_name>,Pushes the delete to remote',
    'remove_file':'git rm [file] deletes the file from the working directory and stages the deletion, git rm --cached [file] removes the file from version control but preserves the file locally',
    'update_file':'git mv [file-original] [file-renamed] changes the file name and prepares it for commit'
  }
};
