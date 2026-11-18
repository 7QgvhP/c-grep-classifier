# 設計判断記録（ADR）

重要な設計判断を、1判断1ファイルで記録する。

## ファイル命名規則

`NNNN-短い題名.md`（`NNNN` は4桁の連番。題名は英小文字とハイフン）

## ステータス

| ステータス | 意味 |
|---|---|
| Proposed | 提案中 |
| Accepted | 採用済み |
| Deprecated | 廃止（後継なし） |
| Superseded | 別の ADR で置き換えられた（置き換えた ADR へのリンクを書く） |

## 運用

- 既存の ADR は書き換えない。判断を変えるときは新しい ADR を追加し、古い ADR のステータスを Superseded にする。

## 一覧

| 番号 | 題名 | ステータス | 日付 |
|---|---|---|---|
| [0001](0001-record-architecture-decisions.md) | ADR で設計判断を記録する | Accepted | 2026-11-15 |
| [0002](0002-use-tree-sitter-for-parsing.md) | 構文解析に web-tree-sitter を使う | Accepted | 2026-06-06 |
| [0003](0003-load-wasm-as-binary.md) | パーサーの WASM をバイナリとして直接読み込む | Accepted | 2026-06-06 |
| [0004](0004-text-search-first.md) | 出現位置はテキスト検索で列挙し、後から AST で分類する | Accepted | 2026-07-30 |
| [0005](0005-headless-tests-with-node-test.md) | テストを `node:test` で、VS Code を起動せずに行う | Accepted | 2026-10-10 |
| [0006](0006-unicode-word-boundary.md) | 単語全体一致の境界を Unicode の単語文字で判定する | Accepted | 2026-07-31 |

日付は、その判断を含むリリースの日付。
