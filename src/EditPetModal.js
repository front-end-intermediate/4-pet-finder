import { useState, useRef } from "react";
import Modal from "react-modal";

const EditPetModal = ({ pet, onCancel, onSave }) => {
  const [name, setName] = useState(pet.name);
  const [kind, setKind] = useState(pet.kind);
  const [photo, setPhoto] = useState(pet.photo);

  const [errors, setErrors] = useState(null);
  const [saving, setSaving] = useState(false);
  const photoInput = useRef();

  const submit = (event) => {
    event.preventDefault();
    setSaving(true);
    onSave({
      ...pet,
      name,
      kind,
      photo,
    }).catch((error) => {
      console.error(error);
      setErrors(error);
      setSaving(false);
    });
  };

  const updatePhoto = () => {
    const file = photoInput.current.files && photoInput.current.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Modal isOpen={true} onRequestClose={onCancel}>
      <h2>Edit Pet</h2>
      <form className="pet-form" onSubmit={submit}>
        {photo && <img alt="the pet" src={photo} />}
        <label htmlFor="photo">Photo</label>
        <input type="file" id="photo" ref={photoInput} onChange={updatePhoto} />

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors && errors.name && <div className="error">{errors.name}</div>}

        <label htmlFor="kind">Kind</label>
        <select
          name="kind"
          id="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">Choose a kind</option>
          <option value="cat">Cat</option>
          <option value="dog">Dog</option>
        </select>
        {errors && errors.kind && <div className="error">{errors.kind}</div>}

        <button type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" disabled={saving}>
          Save
        </button>
      </form>
    </Modal>
  );
};

export default EditPetModal;
