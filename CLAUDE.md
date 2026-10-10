# c-grep-classifier

共通ルール（コミットの書式、バージョン、タグ、CHANGELOG）は、ここには書きません。このファイルは、このリポジトリ固有の事実だけを書きます。

## 概要
C言語のソースコードをキーワード検索（grep）し、結果を tree-sitter の構文解析（AST）で「入力」「出力」「定義」「コメント」「その他」に分類して表示する VS Code 拡張機能です。

## 構成と技術
- TypeScript / VS Code 拡張機能 / web-tree-sitter。ビルドは `tsc`。
- `src/extension.ts`: 拡張機能の本体（Webview View Provider、検索の実行）
- `src/matcher.ts`: 出現位置の列挙と、AST ノードへの対応付け
- `src/classifier.ts`: データフローの分類ロジック
- `src/types.ts`: 型定義とカテゴリ定義
- `media/`: Webview の HTML / CSS / JavaScript
- `bin/`: tree-sitter と C言語パーサーの WASM（バイナリ。変換しない）
- `test/`: `node:test` によるテスト。`test_data/` はテスト用の C ソース
- `docs/`: 分類ロジックの技術仕様書
- 出力先の `out/`、`out-test/` は Git 管理外

## ビルド・テストの手順
```bash
npm install       # 依存関係の取得（初回）
npm test          # ビルド + テストのビルド + node:test
npm run compile   # TypeScript のビルド（out/ へ出力）
```
- テストは VS Code を起動せずに実行できます。
- テスト名の末尾の `(vX.Y.Z)` は、その挙動が確定したバージョンを表します。
- ※ 自動対応でこれらを実行するには、dev-hub の `tools\claude-auto\config.ps1` の `$ExtraTools` で許可が必要です。

## バージョンの記録場所
リリースのときに、次をすべて同じコミットで更新します。
- `package.json` の `version`
- `package-lock.json` の `version`（先頭と `packages[""]` の2か所）
- `CHANGELOG.md` の見出し（`## [X.Y.Z] - YYYY-MM-DD`）

`README.md` には、現在のバージョンを書いていません（リリース手順の例にあるバージョン番号は、例示です）。

## 注意事項
- **GitHub Releases を作るリポジトリです。** `v` で始まるタグを push すると、`.github/workflows/release.yml` が、テストの実行、タグと `package.json` のバージョンの一致確認、vsix の作成、Releases への添付を行います。バージョンが一致しないと、リリースは失敗します。
- `CHANGELOG.md` の箇条書きは `*` で、文体は「です・ます」です。
