# C-Grep Classifier

C言語のキーワード検索の結果を、構文解析で「入力」「出力」「定義」「コメント」「その他」に分類して表示する VS Code 拡張機能。

## 概要

単なる文字列一致ではなく、キーワードが代入の左辺か右辺か、宣言か参照かを構文木（`web-tree-sitter`）から判定する。
「この変数はどこで書き換えられているのか」を短時間で把握できる。
一致件数は VS Code 標準の検索と同じ方法で数え、分類できない箇所も「その他」として必ず表示する。

## 主な機能

- 一致箇所を、入力・出力・定義・コメント・その他に分類し、カテゴリとファイルごとにまとめて表示する
- 各一致箇所が属する関数名を表示する。関数名だけの一覧にも切り替えられる
- 検索結果を、エディタのタブにテキストで一覧表示する
- 部分一致と単語全体一致の切り替え、サブ分類（条件判定・代入の右辺など）の表示
- `files.encoding` に従った文字コードの自動追従と、未保存のバッファの解析

## クイックスタート

前提：VS Code 1.75.0 以降。

[GitHub Releases](https://github.com/7QgvhP/c-grep-classifier/releases) から vsix をダウンロードしてインストールし、アクティビティバーの「C-Grep Classifier」の検索窓にキーワードを入力して Enter を押す。

```bash
code --install-extension c-grep-classifier-X.Y.Z.vsix
```

詳しくは [docs/usage.md](docs/usage.md) を参照。

## ドキュメント

| ファイル | 内容 |
|---|---|
| [docs/spec.md](docs/spec.md) | 仕様（何をするか。分類ルールを含む） |
| [docs/usage.md](docs/usage.md) | 使用方法 |
| [docs/architecture.md](docs/architecture.md) | 設計（どう作っているか） |
| [docs/development.md](docs/development.md) | 開発者向けガイド（ビルド、テスト、リリース） |
| [docs/configuration.md](docs/configuration.md) | 設定リファレンス |
| [docs/adr/](docs/adr/README.md) | 設計判断記録（ADR） |
| [CHANGELOG.md](CHANGELOG.md) | 変更履歴 |

## ライセンス

TODO(要確認): LICENSE ファイルがなく、`package.json` にも `license` の指定がない。
