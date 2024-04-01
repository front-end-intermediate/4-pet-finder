export const Pet = ({ pet }) => {
  return (
    <div>
      <h2>{JSON.stringify(pet, null, 2)}</h2>
      <h2>{pet.name}</h2>
    </div>
  );
};
