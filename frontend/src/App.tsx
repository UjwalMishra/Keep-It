import { Button } from "./components/ui/Button";
import "./App.css";
import { AddIcon } from "./icons/AddIcon";
import { ShareIcon } from "./icons/ShareIcon";
import { Card } from "./components/ui/Card";
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

      <div className="flex m-4 gap-8">
        <Card
          title="Raftaar"
          link="https://www.youtube.com/watch?v=XCIYHCXQoxQ&list=RDXCIYHCXQoxQ&start_radio=1"
          type="youtube"
        ></Card>

        <Card
          title="Mussu"
          link="https://x.com/smitadeshmukh/status/1940341545745723674"
          type="x"
        ></Card>
      </div>
    </>
  );
}

export default App;
