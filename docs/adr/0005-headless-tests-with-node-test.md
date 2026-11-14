# 0005. テストを `node:test` で、VS Code を起動せずに行う

- ステータス: Accepted
- 日付: 2026-10-07（v3.1.11 のコミット「node:test によるヘッドレステストを整備し、CIの検証をテスト実行に戻す」）

## 背景（Context）

リリースの GitHub Actions で、変更を検証する手段が必要だった。

## 決定内容（Decision）

- テストは Node 標準の `node:test` で書く。追加のテストフレームワークは使わない。
- 分類ロジック（`classifier.ts`）と一致箇所の列挙（`matcher.ts`）を直接呼び出し、VS Code を起動せずに検証する。`matcher.ts` と `types.ts` は `vscode` を型としてのみ参照する。
- リリースの GitHub Actions でも `npm test` を実行する。

## 理由と検討した代替案（Consequences / Alternatives）

- テストは数百ミリ秒で終わり、CI でも実行できる。
- 理由のうち、`node:test` を選んだ理由：TODO(要確認)（記録はない）。
- 検討した代替案：TODO(要確認)（コミットメッセージの「CIの検証をテスト実行に戻す」から、以前は別の方法で検証していたことがわかるが、その内容は記録されていない）。
