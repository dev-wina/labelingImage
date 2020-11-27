import baseStyled, {css, CSSProp, ThemedStyledInterface} from "styled-components"

const sizes: { [key: string]: number } = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
}

type BackQuoteArgs = string[]

interface Media {
    mobile: (...args: BackQuoteArgs) => CSSProp | undefined
    tablet: (...args: BackQuoteArgs) => CSSProp | undefined
    desktop: (...args: BackQuoteArgs) => CSSProp | undefined
}

const media: Media = {
    // @ts-ignore
    desktop: (...args: BackQuoteArgs) => undefined,
    // @ts-ignore
    tablet: (...args: BackQuoteArgs) => undefined,
    // @ts-ignore
    mobile: (...args: BackQuoteArgs)=> undefined,
}

Object.keys(sizes).reduce((acc: Media, label: string) => {
    switch (label) {
        case "desktop":
            // @ts-ignore
            acc.desktop = (...args: BackQuoteArgs) => css`@media only screen and (min-width: ${sizes.desktop}px) {${args}}`;
            break;
        case "tablet":
            acc.tablet= (...args: BackQuoteArgs) => css`@media only screen and (max-width: ${sizes.desktop}px) and (min-width: ${sizes.tablet}px) {${args}}`;
            break;
        case "mobile":
            acc.mobile= (...args: BackQuoteArgs) => css`@media only screen and (max-width: ${sizes.tablet}px) {${args}}`;
            break;
        default:
            break;
    }
    return acc;
}, media)

const color = {
    Primary: "#0000ff",
    Secondary: "#00ff00",
    Danger: "#ff0000",
    BtnActive: "#d5d9e2",
    BtnDefault: "#fafafa",
}

const secondaryColors = {}
const fontSizes: string[] = []

const theme = {
    color,
    fontSizes,
    secondaryColors,
    media,
    sizes,
}

export type Theme = typeof theme
export const styled = baseStyled as ThemedStyledInterface<Theme>
export default theme
