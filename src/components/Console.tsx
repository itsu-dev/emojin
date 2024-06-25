import styled from "styled-components";
import {useEffect, useRef} from "react";

const Wrapper = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const ConsoleArea = styled.pre`
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 0 11px -7px #a2a0a0;
    background-color: #ffffff;
    margin: 0;
    overflow: auto;
`;

const Title = styled.h2`
    font-size: 0.8rem;
    font-weight: normal;
    color: #4B5261;
    margin: 0.5rem 0;
`;

const P = styled.p`
    margin: 0.2rem;  
`;

export type ConsoleText = {
    text: string,
    type: "info" | "error",
}

type Props = {
    logs: ConsoleText[],
}

export default function Console({logs}: Props) {
    const ref = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (ref.current) {
            const bb = ref.current.getBoundingClientRect();
            ref.current.style.maxHeight = `${bb.height}px`;
            console.log(bb, ref.current);
        }
    }, []);

    return (
        <Wrapper>
            <Title>🖥️&nbsp;コンソール</Title>
            <ConsoleArea ref={ref}>
                {logs.map((log, index) => (
                    <P key={index} style={{color: log.type === "info" ? "#333333" : "#ff0000"}}>{log.text}</P>
                ))}
            </ConsoleArea>
        </Wrapper>
    );
}