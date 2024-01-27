import AddButton from "./AddButton";
import Calendar from "./Calendar";

import "./styles/App.css";

export default function App() {
  return (
    <div className="app">
      <Calendar />
      <AddButton />
    </div>
  );
}
