# 設定リファレンス

VS Code の設定画面で `C-Grep Classifier` を検索すると変更できる。環境変数とコマンドラインオプションはない。

## 設定ファイル

VS Code の設定（`settings.json`）に書く。

| 名前 | 説明 | 型 | デフォルト値 | 必須 |
|---|---|---|---|---|
| `cGrepClassifier.includePattern` | 検索対象とするファイルの glob パターン（例: `**/*.{c,h,inc}`） | 文字列 | `**/*.{c,h}` | いいえ |
| `cGrepClassifier.excludePatterns` | 検索対象から除外する glob パターンの一覧（例: `**/build/**`） | 文字列の配列 | `["**/node_modules/**"]` | いいえ |
| `cGrepClassifier.useDefaultExcludes` | VS Code 標準の除外設定（`files.exclude`、`search.exclude`）も併せて適用する | 真偽値 | `true` | いいえ |
| `cGrepClassifier.showEnclosingFunction` | 各一致箇所に、属する関数名を表示する（サイドバー・エディタ共通） | 真偽値 | `true` | いいえ |
| `cGrepClassifier.detailLevel` | 分類の細かさ。`category`（大分類のみ）または `detailed`（サブ分類を追加） | 文字列（列挙） | `category` | いいえ |

## 参照する VS Code 標準の設定

| 名前 | 用途 |
|---|---|
| `files.encoding` | ファイルの文字コード。この値でデコードしてから検索する |
| `files.exclude`、`search.exclude` | `cGrepClassifier.useDefaultExcludes` が `true` のとき、除外に加える |
