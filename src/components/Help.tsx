import styled from "styled-components";
import {useEffect, useRef} from "react";

const Wrapper = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const Container = styled.div`
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    padding: 1.2rem 1.5rem 1rem;
    border-radius: 8px;
    box-shadow: 0 0 11px -7px #a2a0a0;
    background-color: #ffffff;
    margin: 0;
    font-family: "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", "Noto Sans", Meiryo, sans-serif;
    font-size: 0.9rem;
    overflow-y: auto;

    h3 {
        font-size: 0.8rem;
        font-weight: normal;
        color: #4B5261;
        margin: 1.5rem 0 0.1rem;
    }

    p {
        margin: 0.4rem 0 1rem;
    }
`;

const Title = styled.h2`
    font-size: 0.8rem;
    font-weight: normal;
    color: #4B5261;
    margin: 0.5rem 0;
`;

const Footer = styled.footer`
    width: 100%;
    text-align: center;
    color: #4B5261;
    
    a {
        text-decoration: underline;
        color: #4B5261;
    }
    
    a:visited {
        color: #4B5261;
    }
`;

export default function Help() {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            const bb = ref.current.getBoundingClientRect();
            ref.current.style.maxHeight = `${window.innerHeight - 32 - bb.top}px`;
        }
    }, []);

    return (
        <Wrapper>
            <Title>💡&nbsp;ヘルプ</Title>
            <Container ref={ref}>
                <p>emojin 2.0.0
                    は絵文字で記述する、まったく新しいプログラミング言語です。文字列を除くほとんどの記号やキーワードなどが絵文字に置き換わっています。</p>

                <h3>コメント</h3>
                <p>emojin ではコメントを 🪧（看板）で始めます。コメントは行末まで続きます。</p>

                <h3>数値</h3>
                <p>emojin では、数値は 0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣ の絵文字を使って表します。.
                    を用いることで小数も表すことができます。</p>
                <p>例：1️⃣2️⃣3️⃣, 1️⃣2️⃣.3️⃣4️⃣</p>

                <h3>文字列</h3>
                <p>emojin では文字列は 💬（吹き出し）で囲みます。文字列中に 💬 を使うことはできません。</p>
                <p>例："Hello, World!"</p>

                <h3>真偽値</h3>
                <p>emojin では真偽値は ✅（チェックマーク）と ❌（X）で表します。</p>

                <h3>null</h3>
                <p>null は 🫥（輪郭が点線の顔）で表します。</p>

                <h3>算術演算</h3>
                <p>emojin における算術演算子には次のようなものがあります：➕➖✖️➗。これらの演算子の意味はそれぞれの記号が表す意味に一致しますが、剰余を求めるときにのみ
                    🪣（バケツ）を使用します。</p>
                <p>式の記述は通常のプログラミング言語同様に中置記法により行います。演算子の優先順位は高い順に ✖️➗🪣, ➕➖
                    です。</p>
                <p>例（3.3 を生成）：1️⃣➕2️⃣.3️⃣</p>
                <p>式の両辺が文字列である場合のみ、➕ によって結合することもできます。</p>
                <p>例（Hello, World! を生成）："Hello, "➕"World!"</p>

                <h3>論理演算</h3>
                <p>emojin では論理演算子に
                    🫂（ハグ）と 💫（流れ星）が使えます。それぞれ AND と OR を表します。</p>

                <h3>比較演算</h3>
                <p>emojin では比較演算子に等価を⚖️（天秤）、&lt; を 👈（左向きの手）、&lt;= を 👈⚖️（左向きの手と天秤）、&gt; を 👉（左向きの手）、=&gt; を ⚖️👉（右向きの手と天秤）を使って表します。</p>
                <p>例（変数 😇が 5 よりも大きい）：😇👈5️⃣</p>

                <h3>PRINT 文</h3>
                <p>PRINT 文は 📢（メガホン）で始まり、その後に出力する式を記述します。また PRINT 文の最後には必ず
                    ⛔️（行き止まり）を記述する必要があります。</p>
                <p>例（3.3 と出力）：📢1️⃣➕2️⃣.3️⃣⛔️</p>

                <h3>変数</h3>
                <p>変数を宣言するには、🔖（タグ）から文を始めます。続いて変数名を記述し、🫵（指差し）を記述したのち初期化式を記述します。文末には
                    PRINT 文同様に ⛔️
                    を記述します。変数名にはこの言語において予約語として使用されていない全ての絵文字とアルファベット、日本語、数字を使用することができます。</p>
                <p>例（変数 😇 に "Hello, World!" を代入する）：🔖😇🫵"Hello, World!"⛔️</p>

                <p>🫵 以降の初期化式は省略することができ、この場合は null で初期化されます。</p>

                <h3>条件分岐（IF 文）</h3>
                <p>IF 文は 🤔（考え中の顔）で始まり、その後に条件式を記述します。条件式の後にはその条件が成立した時の文を
                    🔜（開始）と 🔚（終了）で囲って記述します。</p>
                <p>他のプログラミング言語でいう ELSE-IF 節は 🧐（メガネをしている顔）から始めます。そのあとは IF
                    文と同様です。</p>
                <p>ELSE 節は ☹️（しょんぼりした顔）で始めます。その後には 🔜（開始）と 🔚（終了）で囲われた文が生起します。</p>
                <p>例（変数 ❤️ の偶奇判定）：🤔❤️🪣2️⃣⚖️0️⃣🔜💬"偶数"⛔️🔚☹️🔜💬"奇数"⛔️🔚</p>

                <h3>繰り返し（FOR 文）</h3>
                <p>FOR 文は ♻️（リサイクル）で始まり、その後にカウンタとなる変数名を記述します。そのあとには「〜の間」を示す
                    🌀（サイクロン）を記述し、続いてカウンタの初期化式を記述します。その後、「〜まで」を示すまでの記号
                    ➰（輪っか）を記述して最大値を与える式を記述します。最後にループごとに実行する文を 🔜（開始）と
                    🔚（終了）で囲って記述します。</p>
                <p>例（1〜10 の数字を出力する）：♻️❤️🌀0️⃣➰1️⃣0️⃣🔜💬❤️➕1️⃣⛔️🔚</p>

                <Footer>
                    <p>emojin by <a href={"https://x.com/chururi_"}>@chururi_</a></p>
                </Footer>
            </Container>
        </Wrapper>
    )
}