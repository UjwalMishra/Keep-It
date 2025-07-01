import { Button } from "./components/ui/Button";
import "./App.css";
import { AddIcon } from "./icons/AddIcon";
import { ShareIcon } from "./icons/ShareIcon";
function App() {
  return (
    <>
      <Button
        variant="primary"
        text="Add"
        size="md"
        onClick={() => {}}
        startIcon={<AddIcon size="lg" />}
      ></Button>
      <Button
        variant="secondary"
        text="Share"
        size="md"
        onClick={() => {}}
        startIcon={<ShareIcon size="lg" />}
      ></Button>
    </>
  );
}

export default App;
