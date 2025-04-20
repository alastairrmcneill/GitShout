import * as vscode from "vscode";
import { API as GitAPI, GitExtension, Repository } from './typings/git'; 

let timeout: NodeJS.Timeout | undefined;
let branchesToCheck: string[] = [];
let hasWarnedDuringTyping = false;
let enabled = true;

export async function activate(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;

  if (!gitExtension) {
    return;
  }

  const gitApi: GitAPI = gitExtension.getAPI(1);

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

export function deactivate() {}

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

  if (isWarningBranch && enabled) {
    vscode.window.showWarningMessage(
      `You're editing ${repo.state.HEAD?.name} branch!`,
      "Checkout to another branch",
      "Don't remind me again"
    ).then((selection) => {
      if (selection === "Checkout to another branch") {
        vscode.commands.executeCommand("git.checkout");
      }
      if (selection === "Don't remind me again") {
        enabled = false;
      }
    });
  }
}

function updateBranchConfig() {
  const config = vscode.workspace.getConfiguration("gitshout");
  branchesToCheck = config.get<string[]>("warningBranches", ["main", "master"]).map((branch) => branch.toLowerCase()); // Convert to lowercase for case-insensitive comparison
}
