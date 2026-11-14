# 開発者向けガイド

## 開発環境の構築

- Node.js と npm。GitHub Actions では Node 24 を使っている。TODO(要確認): 手元で必要な Node.js の最小バージョンは記録がない。
- 依存関係を取得する。

```bash
npm install
```

## ビルド

```bash
npm run compile   # TypeScript のビルド（out/ へ出力）
npm run watch     # 変更を監視してビルドする
```

デバッグ実行は、VS Code で `F5`（Run Extension）。

vsix は GitHub Actions が作る（下記「リリース手順」）。手元で作る場合は `npx --yes @vscode/vsce package`（未検証。ワークフローと同じコマンド）。

## テスト

```bash
npm test
```

ビルド、テストのビルド（`tsconfig.test.json` で `out-test/` に出力）、`node --test` を順に実行する。2026-11-15 の確認時は 63 件すべて成功した。

- VS Code を起動しないヘッドレス方式（[ADR 0005](adr/0005-headless-tests-with-node-test.md)）。分類ロジック（`src/classifier.ts`）と一致箇所の列挙（`src/matcher.ts`）を直接呼び出して検証する。
- `src/types.ts` と `src/matcher.ts` は `vscode` を型としてのみ参照しているため（`import type`）、Node 単体で読み込める。
- テストのビルドは `out-test/` に出力し、配布物の `out/` には影響しない。
- テスト名の末尾の `(vX.Y.Z)` は、その挙動が確定したバージョンを表す。

## lint / フォーマット

なし。

## ブランチ運用とコミット

全プロジェクト共通の Git 運用ルールに従う。このリポジトリ固有の事情はない。

## リリース手順

1. 更新するファイルは、[CLAUDE.md](../CLAUDE.md) の「バージョンの記録場所」を参照する。
2. `v` で始まるタグを push すると、GitHub Actions（`.github/workflows/release.yml`）が次を行う。
   1. `npm ci`
   2. タグと `package.json` のバージョンが一致することを確認する（一致しないとリリースは作られない）
   3. `npm test`（npm test はビルドも行うため、ビルドの検証も兼ねる）
   4. `npx --yes @vscode/vsce package` で vsix を作り、GitHub Releases に添付する（説明文は空。既にリリースがある場合は vsix の差し替えのみ）
3. 過去のタグをリリースし直す場合は、GitHub の Actions → release → Run workflow でタグを指定する。
