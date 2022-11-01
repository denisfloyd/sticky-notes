import { StickyProvider } from "./features/sticky/contexts/StickyContext";
import { StickyNotesContainer } from "./features/sticky/layouts";
import GlobalStyle from "./styles/global";

function App() {
  return (
    <StickyProvider>
      <GlobalStyle />
      <StickyNotesContainer />
    </StickyProvider>
  );
}

export default App;
