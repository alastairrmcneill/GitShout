import * as vscode from "vscode";

let timeout: NodeJS.Timeout | undefined;
const branchesToCheck = ["main", "master"]; // TODO: Make this configurable

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

  // User typed something - Check if in main
  vscode.workspace.onDidChangeTextDocument((event) => {
    // TODO: Need to do some debouncing here
    checkAndWarnBranch(repo);
  });

  // User has unstaged changes - Check if in main
  repo.state.onDidChange(async () => {
    checkAndWarnBranch(repo);
  });

  // User switched branches - Check if in main
  repo.state.onDidChangeRepository(async () => {
    checkAndWarnBranch(repo);
  });
}

export function deactivate() {}

function checkAndWarnBranch(repo: any) {
  // TODO: show every time there is a commit or branch change
  // TODO: only show once per coding session for typing?

  const isWarningBranch = branchesToCheck.includes(repo.state.HEAD?.name.toLowerCase());

  if (isWarningBranch) {
    vscode.window.showWarningMessage(`You're editing ${repo.state.HEAD?.name} branch!`);
  }
}
