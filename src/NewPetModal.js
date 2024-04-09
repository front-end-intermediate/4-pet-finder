import Modal from "react-modal";

const NewPetModal = ({ isOpen, onCancel }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onCancel}>
      <h2>New Pet</h2>
    </Modal>
  );
};

export default NewPetModal;
