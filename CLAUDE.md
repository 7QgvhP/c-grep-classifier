# c-grep-classifier

コミットの書式、バージョン、タグ、CHANGELOG の規約（全プロジェクト共通）は、ここには書かない。このファイルは、このリポジトリ固有の事実だけを書く。

## 概要
C言語のソースコードをキーワード検索（grep）し、結果を tree-sitter の構文解析（AST）で「入力」「出力」「定義」「コメント」「その他」に分類して表示する VS Code 拡張機能。

## 技術スタックと主要ディレクトリ
- TypeScript / VS Code 拡張機能 / web-tree-sitter。ビルドは `tsc`（`out/` へ出力）。
- `src/`: 本体（`extension.ts`、`matcher.ts`、`classifier.ts`、`resultDocument.ts`、`types.ts`）
- `media/`: Webview の HTML / CSS / JavaScript
- `bin/`: tree-sitter と C言語パーサーの WASM（バイナリ。変換しない）
- `test/`: `node:test` によるテスト。`test_data/` はテスト用の C ソース
- 詳細は [docs/architecture.md](docs/architecture.md)。出力先の `out/`、`out-test/` は Git 管理外。

## コマンド
```bash
npm install       # 依存関係の取得（初回）
npm test          # ビルド + テストのビルド + node:test
npm run compile   # TypeScript のビルド（out/ へ出力）
```
- lint: なし。
- テストは VS Code を起動せずに実行できる。
- ※ 自動対応でこれらを実行するには、dev-hub の `tools\claude-auto\config.ps1` の `$ExtraTools` で許可が必要。

## コーディング規約
- コメントは日本語。UI の文言・メッセージも日本語。
- 分類の規則を変えたときは、`docs/spec.md` の「分類ルール」と、テスト（`test/classifier.test.ts`）を同じ作業で更新する。
- テスト名の末尾の `(vX.Y.Z)` は、その挙動が確定したバージョンを表す。
- `CHANGELOG.md` の箇条書きは `*` で、文体は「です・ます」。

## バージョンの記録場所
リリースのときに、次をすべて同じコミットで更新する。
- `package.json` の `version`
- `package-lock.json` の `version`（先頭と `packages[""]` の2か所）
- `CHANGELOG.md` の見出し（`## [X.Y.Z] - YYYY-MM-DD`）

`README.md` には、現在のバージョンを書いていない（インストール手順の `X.Y.Z` は例示）。
**GitHub Releases を作るリポジトリ。** 手順は [docs/development.md](docs/development.md#リリース手順)。

## ドキュメント更新ルール
今後の開発で、次の変更を行う際は、同じ作業の中で該当ドキュメントも更新すること。
- 機能の追加・変更・削除 → `docs/spec.md`、`docs/usage.md`、`CHANGELOG.md`
- 構成や設計の変更 → `docs/architecture.md`
- 設定項目の追加・変更 → `docs/configuration.md`
- 技術選定や設計方針を変える判断 → 新しい ADR を `docs/adr/` に追加する（既存の ADR は書き換えず、ステータスを Superseded にして、新しい ADR から参照する）
- バージョンを上げるとき → `CHANGELOG.md` に新しいバージョンの節（`## [X.Y.Z] - YYYY-MM-DD`）を追加し、「バージョンの記録場所」のファイルをすべて同じコミットで更新する

## 注意事項
- `bin/*.wasm` は、ABI 14 互換の C 言語パーサー。差し替えるとパーサーの初期化に失敗することがある（[ADR 0003](docs/adr/0003-load-wasm-as-binary.md)）。
- `.vscodeignore` で、`CLAUDE.md`、`docs/**`、`.github/**`、`src/**`、`test/**`、`test_data/**` などの配布物に不要なファイルを除外している。
