import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
        "Hiragino Sans", "Noto Sans", Meiryo, sans-serif;
        background-color: #f4f5f7;
        color: #333333;
    }
    
    * {
        box-sizing: border-box;
    }
`;

export default GlobalStyle;