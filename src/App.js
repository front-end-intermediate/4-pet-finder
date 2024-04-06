import { useEffect, useState } from "react";
import { listPets, createPet, updatePet, deletePet } from "./api";
import { Pet } from "./Pet";
import NewPetModal from "./NewPetModal";
import EditPetModal from "./EditPetModal";

export const App = () => {
  const [pets, setPets] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isNewPetOpen, setNewPetOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

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

  const removePet = (byePet) => {
    const result = window.confirm(
      `Are you sure you want to adopt ${byePet.name}`
    );
    if (result) {
      deletePet(byePet).then(() => {
        setPets((pets) => pets.filter((pet) => pet.id !== byePet.id));
      });
    }
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
                <Pet
                  onRemove={() => removePet(pet)}
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
        <NewPetModal
          onSave={addPet}
          // isOpen={isNewPetOpen}
          onCancel={() => setNewPetOpen(false)}
        />
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
