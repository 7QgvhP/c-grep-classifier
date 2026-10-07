import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, countInText, findIn } from './support/parse';

// 一致箇所の列挙（matcher）の挙動を検証する。
// v3.0.0 以降、列挙はテキスト検索で行うため、件数はVS Code標準検索と一致する。
describe('検索結果の網羅性', () => {
    const SOURCE = [
        '#define BASE 0x8011',
        'typedef unsigned char BYTE;',
        'int counter;',
        'void loop_func(void) {',
        '    int i = 0;',
        '    counter = counter + 1;',
        '    if (counter < 0x8011) { }',
        '    printf("counter=%d", counter);'
    ].join('\n');

    for (const query of ['counter', '0x8011', 'BYTE', 'int']) {
        test(`テキスト上の出現数と検出件数が一致する: "${query}" (v3.0.0)`, async () => {
            const matches = await findIn(SOURCE, query);
            assert.equal(matches.length, countInText(SOURCE, query));
        });
    }

    test('型名も検出される (v3.0.0)', async () => {
        assert.equal((await findIn('void f(HogeStruct *p) { }', 'HogeStruct', true)).length, 1);
    });

    test('数値定数も検出される (v3.0.0)', async () => {
        assert.deepEqual(await classify('void f(void) { x = 0x8011; }', '0x8011', true), ['入力/代入の右辺']);
    });

    test('1つの出現につき結果は1件で重複しない (v2.2.1)', async () => {
        const code = 'void f(void) { puts("hoge"); puts("hoge"); }';
        assert.equal((await findIn(code, 'hoge')).length, 2);
    });
});

describe('一致範囲と位置', () => {
    test('ハイライト範囲は一致した文字列そのもの (v3.0.0)', async () => {
        const [match] = await findIn('int hoge_max;', 'hoge');
        assert.equal(match.charStart, 4);
        assert.equal(match.charEnd, 8);
    });

    test('複数行コメント内でも正しい行番号を返す (v1.9.1)', async () => {
        const code = ['/**', ' * 1行目', ' * hoge の説明', ' */'].join('\n');
        const [match] = await findIn(code, 'hoge');
        assert.equal(match.line, 2);
        assert.equal(code.split('\n')[match.line].slice(match.charStart, match.charEnd), 'hoge');
    });
});

describe('単語全体に一致', () => {
    test('部分一致では続きのある識別子にもヒットする (v1.9.0)', async () => {
        assert.equal((await findIn('int hoge; int hoge_max; int myhoge;', 'hoge')).length, 3);
    });

    test('単語全体一致では続きのある識別子を除外する (v1.9.0)', async () => {
        assert.equal((await findIn('int hoge; int hoge_max; int myhoge;', 'hoge', true)).length, 1);
    });

    test('日本語でも単語境界を判定できる (v3.1.2)', async () => {
        const code = ['// 温度 の説明', '// 室内温度 を測る'].join('\n');
        assert.equal((await findIn(code, '温度', true)).length, 1);
    });
});

describe('所属関数の特定', () => {
    test('関数内の一致には関数名が付く (v2.2.0)', async () => {
        const code = 'void update_hoge(void) {\n    hoge = 1;\n}';
        const [match] = await findIn(code, 'hoge', true);
        assert.equal(match.functionName, 'update_hoge');
    });

    test('ポインタを返す関数でも関数名を取得できる (v2.2.0)', async () => {
        const code = 'void *make_hoge(void) {\n    hoge = 1;\n}';
        const [match] = await findIn(code, 'hoge', true);
        assert.equal(match.functionName, 'make_hoge');
    });

    test('関数外の一致には関数名が付かない (v2.2.0)', async () => {
        const [match] = await findIn('int hoge;', 'hoge', true);
        assert.equal(match.functionName, undefined);
    });
});
