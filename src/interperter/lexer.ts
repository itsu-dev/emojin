export enum TokenType {
    NUMBER,
    STRING,
    IDENTIFIER,
    PLUS,
    MINUS,
    MUL,
    DIV,
    MOD,
    AND,
    OR,
    EQUAL,
    LT,
    GT,
    LE,
    GE,
    LPAREN,
    RPAREN,
    LBRACE,
    RBRACE,
    SEMICOLON,
    NULL,
    TRUE,
    FALSE,
    IF,
    ELSE_IF,
    ELSE,
    PRINT,
    TAG,
    ASSIGN,
    FOR,
    TO,
    IN,
    WHILE,
    EOF,
}

enum Tokens {
    ZERO = '0️⃣',
    ONE = '1️⃣',
    TWO = '2️⃣',
    THREE = '3️⃣',
    FOUR = '4️⃣',
    FIVE = '5️⃣',
    SIX = '6️⃣',
    SEVEN = '7️⃣',
    EIGHT = '8️⃣',
    NINE = '9️⃣',
    DOT = '.',
    PLUS = '➕',
    MINUS = '➖',
    TIMES = '✖️',
    DIV = '➗',
    MOD = '🪣',
    STAR = '💫',
    HUGGING = '🫂',
    BALANCE_SCALE = '⚖️',
    LPAREN = '(',
    RPAREN = ')',
    SPEECH_BALLOON = '💬',
    SIGN = '🪧',
    SOON = '🔜',
    END = '🔚',
    CHECK = '✅',
    CROSS = '❌',
    DOTTED_FACE = '🫥',
    THINKING_FACE = '🤔',
    MONOCLE_FACE = '🧐',
    ASTONISHED_FACE = '☹️',
    LOUD_SPEAKER = '📢',
    RECYCLE = '♻️',
    CURL = '➰',
    CYCLONE = '🌀',
    REPEAT = '🔁',
    LEFT_HAND = '👈',
    RIGHT_HAND = '👉',
    TAG = '🔖',
    FINGER = '🫵',
    STOP = '⛔️',
    EOF = '',
}

export type Token = {
    type: TokenType,
    position: number,
    column: number,
    line: number;
    value?: string,
}

const isDigit = (char: string) => {
    return char === Tokens.ZERO
        || char === Tokens.ONE
        || char === Tokens.TWO
        || char === Tokens.THREE
        || char === Tokens.FOUR
        || char === Tokens.FIVE
        || char === Tokens.SIX
        || char === Tokens.SEVEN
        || char === Tokens.EIGHT
        || char === Tokens.NINE;
}

const toNumberString = (char: string) => {
    switch (char) {
        case Tokens.ZERO:
            return '0';
        case Tokens.ONE:
            return '1';
        case Tokens.TWO:
            return '2';
        case Tokens.THREE:
            return '3';
        case Tokens.FOUR:
            return '4';
        case Tokens.FIVE:
            return '5';
        case Tokens.SIX:
            return '6';
        case Tokens.SEVEN:
            return '7';
        case Tokens.EIGHT:
            return '8';
        case Tokens.NINE:
            return '9';
        case Tokens.DOT:
            return '.';
        default:
            return '';
    }
}

type Segment = {
    segment: string,
    index: number,
}

type ReturnType = {
    lex: () => Token[],
}

export default function Lexer(program: string): ReturnType {

    // @ts-ignore
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    const reservedTokens: string[] = Object.values(Tokens);

    const lex = (): Token[] => {
        const tokens: Token[] = [];

        const segments: Segment[] = [...segmenter.segment(program)];

        let position = 0;
        let column = 1;
        let line = 1;

        const isToken = (char: string) => {
            return reservedTokens.includes(char);
        }

        const createToken = (type: TokenType, position: number, column: number, line: number, value?: string) => {
            tokens.push({type, position, column, line, value});
        }

        while (position < segments.length) {
            const char = segments[position].segment;

            if (char === Tokens.PLUS) {
                createToken(TokenType.PLUS, position, column, line);
                column++;
            } else if (char === Tokens.MINUS) {
                createToken(TokenType.MINUS, position, column, line);
                column++;
            } else if (char === Tokens.TIMES) {
                createToken(TokenType.MUL, position, column, line);
                column++;
            } else if (char === Tokens.DIV) {
                createToken(TokenType.DIV, position, column, line);
                column++;
            } else if (char === Tokens.MOD) {
                createToken(TokenType.MOD, position, column, line);
                column++;
            } else if (char === Tokens.STAR) {
                createToken(TokenType.OR, position, column, line);
                column++;
            } else if (char === Tokens.HUGGING) {
                createToken(TokenType.AND, position, column, line);
                column++;
            } else if (char === Tokens.BALANCE_SCALE) {
                if (position + 1 !== segments.length && segments[position + 1].segment === Tokens.RIGHT_HAND) {
                    createToken(TokenType.LE, position, column, line);
                    position++;
                    column += 2;
                } else {
                    createToken(TokenType.EQUAL, position, column, line);
                    column++;
                }
            } else if (char === Tokens.LPAREN) {
                createToken(TokenType.LPAREN, position, column, line);
                column++;
            } else if (char === Tokens.RPAREN) {
                createToken(TokenType.RPAREN, position, column, line);
                column++;
            } else if (char === Tokens.LEFT_HAND) {
                if (position + 1 !== segments.length && segments[position + 1].segment === Tokens.BALANCE_SCALE) {
                    createToken(TokenType.GE, position, column, line);
                    position++;
                    column += 2;
                } else {
                    createToken(TokenType.GT, position, column, line);
                    column++;
                }
            } else if (char === Tokens.RIGHT_HAND) {
                createToken(TokenType.LT, position, column, line);
                column++;
            } else if (char === Tokens.STOP) {
                createToken(TokenType.SEMICOLON, position, column, line);
                column++;
            } else if (char === Tokens.SOON) {
                createToken(TokenType.LBRACE, position, column, line);
                column++;
            } else if (char === Tokens.END) {
                createToken(TokenType.RBRACE, position, column, line);
                column++;
            } else if (char === Tokens.CHECK) {
                createToken(TokenType.TRUE, position, column, line);
                column++;
            } else if (char === Tokens.CROSS) {
                createToken(TokenType.FALSE, position, column, line);
                column++;
            } else if (char === Tokens.DOTTED_FACE) {
                createToken(TokenType.NULL, position, column, line);
                column++;
            } else if (char === Tokens.THINKING_FACE) {
                createToken(TokenType.IF, position, column, line);
                column++;
            } else if (char === Tokens.MONOCLE_FACE) {
                createToken(TokenType.ELSE_IF, position, column, line);
                column++;
            } else if (char === Tokens.ASTONISHED_FACE) {
                createToken(TokenType.ELSE, position, column, line);
                column++;
            } else if (char === Tokens.LOUD_SPEAKER) {
                createToken(TokenType.PRINT, position, column, line);
                column++;
            } else if (char === Tokens.TAG) {
                createToken(TokenType.TAG, position, column, line);
                column++;
            } else if (char === Tokens.FINGER) {
                createToken(TokenType.ASSIGN, position, column, line);
                column++;
            } else if (char === Tokens.RECYCLE) {
                createToken(TokenType.FOR, position, column, line);
                column++;
            } else if (char === Tokens.CURL) {
                createToken(TokenType.TO, position, column, line);
                column++;
            } else if (char === Tokens.CYCLONE) {
                createToken(TokenType.IN, position, column, line);
                column++;
            } else if (char === Tokens.REPEAT) {
                createToken(TokenType.WHILE, position, column, line);
                column++;
            } else if (isDigit(char)) {
                let c = segments[position].segment;
                let value = toNumberString(c);
                while (position + 1 !== segments.length && (isDigit(segments[position + 1].segment) || segments[position + 1].segment === Tokens.DOT)) {
                    c = segments[++position].segment;
                    value += toNumberString(c);
                }
                createToken(TokenType.NUMBER, position, column, line, value);
                column += value.length;
            } else if (char === Tokens.SPEECH_BALLOON) {
                let c = segments[++position].segment;
                let value = '';
                while (c !== Tokens.SPEECH_BALLOON) {
                    if (position + 1 === segments.length) {
                        break;
                    }

                    value += c;
                    c = segments[++position].segment;
                }
                createToken(TokenType.STRING, position, column, line, value);
                column += value.length;
            } else if (char === Tokens.SIGN) {
                let c = segments[++position].segment;
                while (c !== '\n') {
                    if (position + 1 === segments.length) {
                        break;
                    }

                    c = segments[++position].segment;
                }
                line++;
                column = 1;
            } else if (char !== ' ' && char !== '\n' && !isToken(char)) {
                let value = char;
                let length = 1;
                while (position + 1 !== segments.length && !isToken(segments[position + 1].segment)
                    && segments[position + 1].segment !== ' ' && segments[position + 1].segment !== '\n') {
                    value += segments[++position].segment;
                    length++;
                }
                createToken(TokenType.IDENTIFIER, position, column, line, value);
                column += length;
            } else if (char === ' ') {
                column++;
            } else if (char === '\n') {
                line++;
                column = 1;
            }

            position++;
        }

        createToken(TokenType.EOF, position, column, line);

        return tokens;
    }

    return {
        lex,
    }
}