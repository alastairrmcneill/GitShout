import * as vscode from "vscode";
import { API as GitAPI, GitExtension, Repository } from './typings/git'; 
import { on } from "events";

let timeout: NodeJS.Timeout | undefined;
let branchesToCheck: string[] = [];
let hasWarnedDuringTyping = false;

export async function activate(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;

  if (!gitExtension) {
    return;
  }

  const gitApi: GitAPI = gitExtension.getAPI(1);

  if (gitApi.state !== 'initialized') {
    gitApi.onDidChangeState(() => {onGitAPIInitialised(gitApi);});
  }
}

export function deactivate() {}

function onGitAPIInitialised(gitApi: GitAPI) {
  const repo: Repository = gitApi.repositories[0];

  // Load initial configuration
  updateBranchConfig();

  // Listen for configuration changes
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("gitshout.warningBranches")) {
      updateBranchConfig();
    }
  });

  // User typed something - Check if in main
  vscode.workspace.onDidChangeTextDocument(() => {
    handleChange(repo);
  });

  // User has unstaged changes - Check if in main
  repo.state.onDidChange(() => {
    if (repo.state.workingTreeChanges.length > 0) {
      handleChange(repo);
    }
  });
}

function handleChange(repo: Repository) {
  if (!hasWarnedDuringTyping) {
    checkAndWarnBranch(repo);
    hasWarnedDuringTyping = true;
  }

  // Reset warning state after 10 seconds of inactivity
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    hasWarnedDuringTyping = false;
  }, 10000); // 10 second reset
}

function checkAndWarnBranch(repo: Repository) {
  const isWarningBranch = branchesToCheck.includes(repo.state.HEAD?.name?.toLowerCase() ?? '');

  if (isWarningBranch) {
    vscode.window.showWarningMessage(`You're editing ${repo.state.HEAD?.name} branch!`);
  }
}

function updateBranchConfig() {
  const config = vscode.workspace.getConfiguration("gitshout");
  branchesToCheck = config.get<string[]>("warningBranches", ["main", "master"]).map(branch => branch.toLowerCase());
}
