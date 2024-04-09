import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import NewPetModal from "./NewPetModal";
import { Pet } from "./Pet";
import "./index.css";

const App = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isNewPetOpen, setNewPetOpen] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/pets");
        const pets = await res.json();
        setPets(pets);
        setLoading(false);
      } catch (err) {
        console.warn(err);
        setLoading(false);
      }
    }
    getData();
  }, []);

  return (
    <main>
      <h1>Adopt-a-Pet</h1>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <ul>
            {pets.map((pet) => (
              <li key={pet.id}>
                <Pet pet={pet} />
              </li>
            ))}
          </ul>
          <button onClick={() => setNewPetOpen(true)}>Add a Pet</button>
        </>
      )}

      {isNewPetOpen && (
        <NewPetModal
          isOpen={isNewPetOpen}
          onCancel={() => setNewPetOpen(false)}
        />
      )}
    </main>
  );
};

const container = document.getElementById("root");
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);
