# 0002. 構文解析に web-tree-sitter を使う

- ステータス: Accepted
- 日付: 2026-06-06（v1.0.0）

## 背景（Context）

一致箇所が代入の左辺か右辺か、宣言か参照かを判定するには、C ソースの構文を解析する必要がある。

## 決定内容（Decision）

`web-tree-sitter`（tree-sitter の WebAssembly 版）と C 言語パーサーの WASM を使い、AST の祖先ノードを辿って分類する。

## 理由と検討した代替案（Consequences / Alternatives）

- ネイティブモジュールなしで VS Code 拡張機能から構文解析できる。実行時の依存は `web-tree-sitter` だけになる。
- マクロで構文が崩れる箇所は `ERROR` ノードになりうるため、分類ルールに救済のパターンを持っている。
- 検討した代替案: 正規表現による判定、C 言語サーバー（clangd など）の利用。
