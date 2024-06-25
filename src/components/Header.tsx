import styled from "styled-components";

const Wrapper = styled.header`
    padding: 0.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    left: 0;
    backdrop-filter: blur(10px);
`;

const Title = styled.h1`
    font-size: 1.0rem;
    font-weight: normal;
`;

const Nav = styled.nav`
    ul {
        display: flex;
        gap: 2rem;
    }
    
    li {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4B5261;
    }
    a {
        text-decoration: none;
        color: #4B5261;
        transition: color 0.3s;
    }
    
    a:hover {
        color: #7C869C;
    }
`;

export default function Header() {
    return (
        <Wrapper>
            <Title>&lt;😄&nbsp;/&gt; emojin Playground</Title>
            <Nav>
                <ul>
                    <li><a href="https://github.com/itsu-dev/emojin">GitHub</a></li>
                </ul>
            </Nav>
        </Wrapper>
    );
}