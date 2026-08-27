# GitHub Pages 公開手順

## 初回のみ

1. GitHub Desktopでこのフォルダを開きます。
2. `Publish repository`を押し、任意のリポジトリ名でGitHubへ公開します。
3. GitHubのリポジトリ画面で `Settings` → `Pages` を開きます。
4. `Build and deployment` の `Source` を `GitHub Actions` にします。
5. GitHub Desktopで変更を `Commit to main` し、`Push origin` を押します。
6. GitHubの `Actions` タブで `Deploy GitHub Pages` が緑色になるまで待ちます。
7. `Settings` → `Pages` に表示されるURLからサイトを開きます。

リポジトリ名は自動判定されるため、設定ファイルを手作業で書き換える必要はありません。

## 2回目以降

サイトを更新したら、GitHub Desktopで次の操作だけを行います。

1. 変更内容を確認します。
2. Summaryを入力して `Commit to main` を押します。
3. `Push origin` を押します。

PushのたびにGitHub Actionsが静的サイトを再生成し、GitHub Pagesを更新します。

## 公開に失敗した場合

GitHubのリポジトリで `Actions` → `Deploy GitHub Pages` を開き、赤色になった処理を確認します。`Settings` → `Pages` のSourceが `GitHub Actions` になっていることも確認してください。
