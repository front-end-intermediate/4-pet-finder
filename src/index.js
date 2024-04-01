import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import { Pet } from "./Pet";
import NewPetModal from "./NewPetModal";
import { listPets, createPet } from "./api";
import "./index.css";

const App = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isNewPetOpen, setNewPetOpen] = useState(false);

  const addPet = async (pet) => {
    return createPet(pet).then((newPet) => {
      setPets([...pets, newPet]);
      setNewPetOpen(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    listPets()
      .then((pets) => setPets(pets))
      .finally(() => setLoading(false));
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
          onSave={addPet}
          // isOpen={isNewPetOpen}
          onCancel={() => setNewPetOpen(false)}
        />
      )}
    </main>
  );
};

const container = document.getElementById("app");
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);

// const container = document.getElementById("app");
// Modal.setAppElement(container);
// ReactDOM.render(<App />, el);
