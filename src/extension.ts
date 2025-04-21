import * as vscode from "vscode";

let timeout: NodeJS.Timeout | undefined;
let branchesToCheck: string[] = [];
let hasWarnedDuringTyping = false;

export async function activate(context: vscode.ExtensionContext) {
  const gitExtension = vscode.extensions.getExtension("vscode.git");

  if (!gitExtension) {
    return;
  }

  if (!gitExtension.isActive) {
    await gitExtension.activate();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 sec
  }

  const gitApi = gitExtension.exports.getAPI(1);

  if (!gitApi) {
    return;
  }

  const repo = gitApi.repositories[0];

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

function handleChange(repo: any) {
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

function checkAndWarnBranch(repo: any) {
  const isWarningBranch = branchesToCheck.includes(repo.state.HEAD?.name.toLowerCase());

  if (isWarningBranch) {
    vscode.window.showWarningMessage(`You're editing ${repo.state.HEAD?.name} branch!`);
  }
}

function updateBranchConfig() {
  const config = vscode.workspace.getConfiguration("gitshout");
  branchesToCheck = config.get<string[]>("warningBranches", ["main", "master"]);
}
