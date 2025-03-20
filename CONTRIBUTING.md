# 📜 Contributing to [Your VS Code Extension Name]

Thank you for considering contributing to **GitShout**! 🎉  
We welcome contributions from the community and appreciate your help in making this project better.

---

## 🚀 How to Contribute

### 1️⃣ Fork the Repository
1. Go to the **[GitHub Repository](https://github.com/alastairrmcneill/GitShout)**.
2. Click the **"Fork"** button in the top-right corner.
3. This will create a copy of the repository under your GitHub account.

### 2️⃣ Clone Your Fork
```sh
git clone https://github.com/alastairrmcneill/GitShout.git
cd GitShout
```

### 3️⃣ Install Dependencies
Make sure you have **Node.js** installed. Then run:
```sh
npm install
```

### 4️⃣ Create a New Branch
Before making any changes, create a new branch:
```sh
git checkout -b feature/your-feature-name
```

### 5️⃣ Make Your Changes
- Modify the **VS Code extension source code** inside `src/`.
- Ensure your changes follow best practices.
- Run **tests** before submitting:
  ```sh
  npm run test
  ```
- Run the extension locally in VS Code:
  ```sh
  code --extensionDevelopmentPath=.
  ```

### 6️⃣ Commit Your Changes
Follow the **Conventional Commits** style:
```sh
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

### 7️⃣ Create a Pull Request (PR)
1. Go to your **GitHub Fork**.
2. Click the **"New Pull Request"** button.
3. Select your branch and compare it with `main` of the original repository.
4. Provide a clear description of your changes.
5. Submit the PR and wait for review.

---

## 🔥 Code Guidelines
- Follow the **[VS Code Extension API](https://code.visualstudio.com/api)**.
- Ensure your code is **clean, modular, and well-documented**.
- Follow the **ESLint rules** (`npm run lint`).
- Write **tests** if applicable.

---

## 🛠 Running & Debugging the Extension
1. Open the project in **VS Code**.
2. Press `F5` to start the **Extension Host** in a new window.
3. Test the extension features interactively.

---

## ✅ Getting Your PR Merged
- A project maintainer will review your PR.
- Address any requested changes.
- Once approved, your PR will be merged!

---

## 🤝 Code of Conduct
By participating, you agree to follow our **[Code of Conduct](CODE_OF_CONDUCT.md)**.

---

### 🎉 Thank You for Contributing! 🚀
If you have any questions, feel free to open a **[GitHub Issue](https://github.com/alastairrmcneill/GitShout/issues)**.

Happy coding! 💻✨
