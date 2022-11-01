import { ThemeProvider } from "styled-components";
import { StickyProvider } from "./features/sticky/contexts/StickyContext";
import { StickyNotesContainer } from "./features/sticky/layouts";
import GlobalStyle from "./styles/global";
import theme from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <StickyProvider>
        <GlobalStyle />
        <StickyNotesContainer />
      </StickyProvider>
    </ThemeProvider>
  );
}

export default App;
