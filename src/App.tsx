import {useEffect, useState} from "react";
import Interpreter from "./interperter/interpreter.ts";
import Header from "./components/Header.tsx";
import Editor from "./components/Editor.tsx";
import styled from "styled-components";
import Console, {ConsoleText} from "./components/Console.tsx";
import Help from "./components/Help.tsx";

const Wrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Container = styled.main`
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
    padding: 0 2rem 2rem;
    width: 100%;
`;

const EditorContainer = styled.div`
    display: grid;
    grid-template-rows: 2fr 1fr;
    row-gap: 0.5rem;
    width: 100%;
    height: 100%;
`;

export default function App() {

    const INITIAL_PROGRAM =
`🪧FizzBuzz プログラム
♻️❤️🌀0️⃣➰5️⃣0️⃣🔜
  🤔❤️🪣3️⃣⚖️0️⃣🫂❤️🪣5️⃣⚖️0️⃣🔜
    📢💬FizzBuzz💬⛔️
  🔚🧐❤️🪣3️⃣⚖️0️⃣🔜
    📢💬Fizz💬⛔️
  🔚🧐❤️🪣5️⃣⚖️0️⃣🔜
    📢💬Buzz💬⛔️
  🔚☹️🔜
    📢❤️⛔️
  🔚
🔚`;

    const DEFAULT_LOGS: ConsoleText[] = [
        {type: "info", text: "👋 emojin へようこそ！"},
        {type: "info", text: "プログラムを入力して、右上の「🌀 実行」ボタンを押してください！ヘルプは右側を参照してください。"},
        {type: "info", text: "-------------------------------------------------------"},
        {type: "info", text: "🎉 emojin 2.1.0 リリース！ 🎉"},
        {type: "info", text: "✅ while 構文（🔁）のサポート"},
        {type: "info", text: "✅ 変数代入式のサポート"},
        {type: "info", text: "✅ 式文のサポート"},
        {type: "info", text: "💡 詳しい使用方法はヘルプをご覧ください。"},
        {type: "info", text: "-------------------------------------------------------"},
    ]

    const [program, setProgram] = useState(INITIAL_PROGRAM);
    const [logs, setLogs] = useState<ConsoleText[]>(DEFAULT_LOGS);

    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setProgram(event.target.value);
    }

    const stdOut = (text: string) => {
        setLogs((logs) => [...logs, {text, type: "info"}]);
    }

    const stdErr = (text: string) => {
        setLogs((logs) => [...logs, {text, type: "error"}]);
    }

    const run = () => {
        setLogs([]);
        Interpreter(program, stdOut, stdErr).launch();
    }

    const onClickButton = (type: "run") => {
        switch (type) {
            case "run":
                run();
                break;
        }
    }

    useEffect(() => {
        if (window.innerWidth < 768) {
            alert("Oops! emojin は絶賛開発中で、スマートフォンにはまだ対応しておりません...😢　デスクトップからのアクセスをお願いします！");
        }
    }, []);

    return (
        <Wrapper>
            <Header />
            <Container>
                <EditorContainer>
                    <Editor value={program} onChange={onChange} onClickButton={onClickButton} />
                    <Console logs={logs} />
                </EditorContainer>
                <Help />
            </Container>
        </Wrapper>
    );

}