import reset from "styled-reset"
import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    box-sizing: border-box;
  }
  @font-face{
    font-family: "Noto Sans Display", -system-ui, apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
    src: url(${require("./fonts/NotoSansDisplay-Medium.ttf")})
  }
  @font-face{
    font-family: "Noto Sans Display Bold", -system-ui, apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
    src: url(${require("./fonts/NotoSansDisplay-Bold.ttf")})
  }
  body{
    font-family: "Noto Sans Display Bold", -system-ui, apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
    width: 100%;
    height:100%;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  input, button {
    background-color: transparent;
    border: none;
    outline: none;
  }
  h1, h2, h3, h4, h5, h6{
    font-family: "Noto Sans Display Bold",'Maven Pro', sans-serif;
  }
  ol, ul, li {
  list-style: none;
  }
  @media only screen and (max-width: 768px) {
    body {
      font-size: 12px;
    }
  }
  @media only screen and (max-width: 576px) {
    body {
      font-size: 10px;
    }
  }
`

export default GlobalStyle
