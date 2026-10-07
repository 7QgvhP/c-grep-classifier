import * as fs from 'fs';
import * as path from 'path';
import Parser from 'web-tree-sitter';
import type * as vscode from 'vscode';
import { findMatches } from '../../src/matcher';
import { GrepMatch } from '../../src/types';

// matcher はURIを型としてしか使わないため、テストではダミーで代用する
const DUMMY_URI = { toString: () => 'file:///test.c' } as unknown as vscode.Uri;

let parserPromise: Promise<Parser> | undefined;

/**
 * C言語パーサーを用意する。
 * 初期化はWASMの読み込みを伴い重いため、1度だけ実行して使い回す。
 */
export async function getParser(): Promise<Parser> {
    if (!parserPromise) {
        parserPromise = (async () => {
            await Parser.init();
            // out-test/test/support から見たリポジトリルート
            const wasmPath = path.resolve(__dirname, '..', '..', '..', 'bin', 'tree-sitter-c.wasm');
            const language = await Parser.Language.load(fs.readFileSync(wasmPath));
            const parser = new Parser();
            parser.setLanguage(language);
            return parser;
        })();
    }
    return parserPromise;
}

// ソースを解析し、検索キーワードの一致箇所をすべて取得する
export async function findIn(code: string, query: string, matchWholeWord = false): Promise<GrepMatch[]> {
    const parser = await getParser();
    const source = code.endsWith('\n') ? code : code + '\n';
    const tree = parser.parse(source);
    return findMatches(tree, query, DUMMY_URI, source, source.split(/\r?\n/), matchWholeWord);
}

// 分類結果を「カテゴリ/サブ分類」の文字列配列として取得する（サブ分類が無い場合はカテゴリのみ）
export async function classify(code: string, query: string, matchWholeWord = false): Promise<string[]> {
    const matches = await findIn(code, query, matchWholeWord);
    return matches.map(m => (m.detail ? `${m.category}/${m.detail}` : m.category));
}

// 文を関数の中に置いたうえで分類する（文単体の検証用）
export async function classifyInFunction(statement: string, query: string, matchWholeWord = false): Promise<string[]> {
    return classify(`void f(void) {\n    ${statement}\n}\n`, query, matchWholeWord);
}

// テキスト上の出現数を数える（VS Code標準検索の件数に相当）
export function countInText(text: string, query: string): number {
    let count = 0;
    let index = text.indexOf(query);
    while (index !== -1) {
        count++;
        index = text.indexOf(query, index + query.length);
    }
    return count;
}
