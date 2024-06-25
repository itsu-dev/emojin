import styled from "styled-components";

const Wrapper = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const TextArea = styled.textarea`
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 0 11px -7px #a2a0a0;
    font-size: 0.95rem;
    font-family: "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", "Noto Sans", Meiryo, sans-serif;
    
    &:focus {
        outline: none;
    }
`;

const Title = styled.h2`
    font-size: 0.8rem;
    font-weight: normal;
    color: #4B5261;
    margin: 0.5rem 0;
`;

const Header = styled.header`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Controls = styled.div`
    display: flex;
    align-items: center;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #4B5261;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
        background-color: #D5D9E0;
    }
`;

type Props = {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
    onClickButton: (type: "run") => void,
}

export default function Editor({value, onChange, onClickButton}: Props) {
    return (
        <Wrapper>
            <Header>
                <Title>✏️&nbsp;エディタ</Title>
                <Controls>
                    <Button onClick={() => onClickButton("run")}>🌀&nbsp;実行</Button>
                </Controls>
            </Header>
            <TextArea value={value} onChange={onChange}></TextArea>
        </Wrapper>
    );
}
