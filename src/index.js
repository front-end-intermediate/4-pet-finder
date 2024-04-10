import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Modal from "react-modal";
import NewPetModal from "./NewPetModal";
import EditPetModal from "./EditPetModal";
import { Pet } from "./Pet";
import { listPets, createPet, updatePet } from "./api";
import "./index.css";

const App = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isNewPetOpen, setNewPetOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  useEffect(() => {
    setLoading(true);
    listPets()
      .then((pets) => setPets(pets))
      .finally(() => setLoading(false));
  }, []);

  const addPet = async (pet) => {
    return createPet(pet).then((newPet) => {
      setPets([...pets, newPet]);
      setNewPetOpen(false);
    });
  };

  const savePet = async (pet) => {
    return updatePet(pet).then((updatedPet) => {
      setPets((pets) =>
        pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet))
      );
      setCurrentPet(null);
    });
  };

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
                <Pet
                  pet={pet}
                  onEdit={() => {
                    console.log("pet", pet);
                    setCurrentPet(pet);
                  }}
                />
              </li>
            ))}
          </ul>
          <button onClick={() => setNewPetOpen(true)}>Add a Pet</button>
        </>
      )}

      {isNewPetOpen && (
        <NewPetModal onSave={addPet} onCancel={() => setNewPetOpen(false)} />
      )}
      {currentPet && (
        <EditPetModal
          pet={currentPet}
          onCancel={() => setCurrentPet(null)}
          onSave={savePet}
        />
      )}
    </main>
  );
};

const container = document.getElementById("root");
Modal.setAppElement(container);
const root = createRoot(container);
root.render(<App />);
