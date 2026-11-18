# 0006. 単語全体一致の境界を Unicode の単語文字で判定する

- ステータス: Accepted
- 日付: 2026-07-31（v3.1.2）

## 背景（Context）

JavaScript の `\b` と `\w` は、単語文字を ASCII に限定する。そのため、日本語などの非 ASCII 文字を含む検索語が、単語全体一致でヒットしなかった。

## 決定内容（Decision）

単語文字を `[\p{L}\p{N}\p{M}_]`（Unicode 対応）と定義し、検索語の前後が単語文字でない位置だけを一致とする（`matcher.ts` の `buildWholeWordRegex`）。

## 理由と検討した代替案（Consequences / Alternatives）

- 日本語を含む検索語でも、VS Code の検索（ripgrep）と同じ結果になる（例: `温度` は `室内温度` や `温度センサ` にはヒットしない）。
- 検討した代替案: 正規表現の `\b`（v3.1.1 まで）。非 ASCII 文字を扱えないため変更した。
