import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { classify, classifyInFunction } from './support/parse';

// docs/classification_spec.md に記載した分類仕様を検証する。
// テスト名末尾の (vX.Y.Z) は、その挙動が確定したバージョンを表す。
describe('出力（書き込み）の分類', () => {
    test('代入の左辺は出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('hoge = 1;', 'hoge'), ['出力/代入']);
    });

    test('複合代入の左辺も出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('hoge += 1;', 'hoge'), ['出力/代入']);
    });

    test('後置インクリメントは出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('hoge++;', 'hoge'), ['出力/インクリメント']);
    });

    test('前置デクリメントは出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('--hoge;', 'hoge'), ['出力/インクリメント']);
    });

    test('アドレス渡しは出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('func(&hoge);', 'hoge'), ['出力/アドレス渡し']);
    });

    test('構造体メンバへの代入は出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('hoge.member = 1;', 'hoge'), ['出力/代入']);
    });

    test('ポインタ経由の書き込みは出力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('*hoge = 5;', 'hoge'), ['出力/代入']);
    });

    test('配列本体への書き込みは出力 (v3.1.1)', async () => {
        assert.deepEqual(await classifyInFunction('hoge[i] = 0;', 'hoge'), ['出力/代入']);
    });

    test('入れ子の構造体メンバへの代入も出力', async () => {
        assert.deepEqual(await classifyInFunction('ptr->a.b.c.hoge = 0;', 'hoge'), ['出力/代入']);
    });
});

describe('入力（読み取り）の分類', () => {
    test('代入の右辺は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('x = hoge;', 'hoge'), ['入力/代入の右辺']);
    });

    test('演算を経た代入の右辺も代入の右辺と判定する (v3.1.0)', async () => {
        assert.deepEqual(await classifyInFunction('x = a + hoge;', 'hoge'), ['入力/代入の右辺']);
    });

    test('宣言の初期化値は入力 (v1.1.1)', async () => {
        assert.deepEqual(await classifyInFunction('int x = hoge;', 'hoge'), ['入力/初期化値']);
    });

    test('if の条件式は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('if (hoge) { }', 'hoge'), ['入力/条件判定']);
    });

    test('比較演算を含む条件式も条件判定と判定する (v3.1.0)', async () => {
        assert.deepEqual(await classifyInFunction('if (a == hoge + 1) { }', 'hoge'), ['入力/条件判定']);
    });

    test('while の条件式は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('while (hoge != 0) { }', 'hoge'), ['入力/条件判定']);
    });

    test('switch の評価対象は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('switch (hoge) { }', 'hoge'), ['入力/条件判定']);
    });

    test('関数の引数は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('func(hoge);', 'hoge'), ['入力/関数引数']);
    });

    test('演算を経た関数の引数も関数引数と判定する (v3.1.0)', async () => {
        assert.deepEqual(await classifyInFunction('func(a + hoge);', 'hoge'), ['入力/関数引数']);
    });

    test('return の値は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('return hoge;', 'hoge'), ['入力/戻り値']);
    });

    test('文脈のない演算は参照とする (v3.1.0)', async () => {
        assert.deepEqual(await classifyInFunction('a + hoge;', 'hoge'), ['入力/参照']);
    });

    test('文字列リテラル内は入力 (v1.0.0)', async () => {
        assert.deepEqual(await classifyInFunction('puts("hoge");', 'hoge'), ['入力/文字列']);
    });

    test('インクルードパスは入力 (v3.0.0)', async () => {
        assert.deepEqual(await classify('#include <hoge.h>', 'hoge'), ['入力/文字列']);
    });
});

describe('定義（宣言）の分類', () => {
    test('変数宣言は定義 (v1.0.0)', async () => {
        assert.deepEqual(await classify('int hoge;', 'hoge'), ['定義/変数宣言']);
    });

    test('初期化付きの変数宣言も定義 (v1.1.1)', async () => {
        assert.deepEqual(await classify('int hoge = 0;', 'hoge'), ['定義/変数宣言']);
    });

    test('関数定義は定義 (v1.0.0)', async () => {
        assert.deepEqual(await classify('void hoge(void) { }', 'hoge'), ['定義/関数定義']);
    });

    test('関数のパラメータは定義 (v1.0.0)', async () => {
        assert.deepEqual(await classify('void f(int hoge) { }', 'hoge'), ['定義/関数引数']);
    });

    test('typedef の型名は定義 (v1.8.1)', async () => {
        assert.deepEqual(await classify('typedef int hoge;', 'hoge'), ['定義/型定義']);
    });

    test('構造体のタグ名は定義 (v1.0.0)', async () => {
        assert.deepEqual(await classify('struct hoge { int a; };', 'hoge'), ['定義/タグ名']);
    });

    test('構造体のメンバ宣言は定義 (v1.7.0)', async () => {
        assert.deepEqual(await classify('struct s { int hoge; };', 'hoge'), ['定義/構造体メンバ']);
    });

    test('マクロ名は定義 (v1.0.0)', async () => {
        assert.deepEqual(await classify('#define hoge 1', 'hoge'), ['定義/マクロ定義']);
    });

    test('enum の定数名は定義 (v1.8.1)', async () => {
        assert.deepEqual(await classify('enum e { hoge };', 'hoge'), ['定義/enum定数']);
    });

    test('初期値を持つ enum 定数名も定義 (v3.1.9)', async () => {
        assert.deepEqual(await classify('enum e { hoge = 1 };', 'hoge'), ['定義/enum定数']);
    });
});

describe('コメントとその他の分類', () => {
    test('行コメント内はコメント (v1.0.0)', async () => {
        assert.deepEqual(await classify('// hoge の説明', 'hoge'), ['コメント']);
    });

    test('ブロックコメント内はコメント (v1.0.0)', async () => {
        assert.deepEqual(await classify('/* hoge の説明 */', 'hoge'), ['コメント']);
    });

    test('goto ラベルはその他 (v3.0.0)', async () => {
        const code = 'void f(void) {\nhoge_label:\n    goto hoge_label;\n}';
        assert.deepEqual(await classify(code, 'hoge_label', true), ['その他', 'その他']);
    });

    test('呼び出される関数名そのものはその他', async () => {
        assert.deepEqual(await classifyInFunction('hoge();', 'hoge'), ['その他']);
    });
});

describe('過去の不具合の再発防止', () => {
    test('同一行に部分一致する別変数があっても取り違えない (v1.7.1)', async () => {
        assert.deepEqual(
            await classifyInFunction('hoge = hogemax;', 'hoge'),
            ['出力/代入', '入力/代入の右辺']
        );
    });

    test('前置マクロ付きの宣言を定義として救済する (v1.8.1)', async () => {
        assert.deepEqual(await classify('GLOBAL BYTE hoge;', 'hoge'), ['定義/変数宣言']);
    });

    test('インクルードガード内の前置マクロ付き宣言も定義とする (v2.4.3)', async () => {
        const code = [
            '#ifndef HOGE_H',
            '#define HOGE_H',
            'typedef union { BYTE a; } HOGE_T;',
            'GLOBAL HOGE_T hoge_u;',
            'GLOBAL SBYTE hoge_es;',
            '#endif'
        ].join('\n');
        assert.deepEqual(await classify(code, 'hoge_es', true), ['定義/変数宣言']);
    });

    test('文字列と識別子が同じ行にあっても重複しない (v2.2.1)', async () => {
        assert.deepEqual(
            await classifyInFunction('printf("hoge=%d", hoge);', 'hoge'),
            ['入力/文字列', '入力/関数引数']
        );
    });

    test('コードと行コメントが同じ行にあっても取り違えない (v2.2.1)', async () => {
        assert.deepEqual(
            await classifyInFunction('hoge = 1; // hoge を更新', 'hoge'),
            ['出力/代入', 'コメント']
        );
    });

    test('配列添字として読まれる変数は入力 (v3.1.1)', async () => {
        assert.deepEqual(await classifyInFunction('arr[hoge] = 0;', 'hoge'), ['入力/参照']);
    });

    test('配列本体と添字が同名でも役割ごとに分かれる (v3.1.1)', async () => {
        assert.deepEqual(
            await classifyInFunction('hoge[hoge] = 0;', 'hoge'),
            ['出力/代入', '入力/参照']
        );
    });

    test('配列サイズは入力 (v3.1.9)', async () => {
        assert.deepEqual(await classify('int buf[hoge];', 'hoge'), ['入力/参照']);
    });

    test('enum 定数の初期値は入力 (v3.1.9)', async () => {
        assert.deepEqual(await classify('enum e { X = hoge };', 'hoge'), ['入力/初期化値']);
    });

    test('マクロ定義の右辺は入力 (v3.1.10)', async () => {
        assert.deepEqual(await classify('#define MAX (hoge + 1)', 'hoge'), ['入力/参照']);
    });

    test('マクロの名前と右辺が同名でも役割ごとに分かれる (v3.1.10)', async () => {
        assert.deepEqual(
            await classify('#define hoge hoge', 'hoge'),
            ['定義/マクロ定義', '入力/参照']
        );
    });

    test('関数マクロの引数は定義、右辺は入力 (v3.1.10)', async () => {
        assert.deepEqual(
            await classify('#define FUNC(hoge) ((hoge) * 2)', 'hoge'),
            ['定義/マクロ引数', '入力/参照']
        );
    });
});
