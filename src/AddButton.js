import { useState } from 'react';
import { createEvent } from './actions/actions';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import './styles/add-button.css';

Modal.setAppElement('#root');

export default function AddButton() {
  const [isModalOpen, setIsModelOpen] = useState(false);
  const [userInput, setUserInput] = useState('');

  const openModal = () => {
    setIsModelOpen(true);
  };

  const closeModal = () => {
    setIsModelOpen(false);
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createEvent(userInput);
    setUserInput('');
    closeModal();
  };
      
  return (
    <button className="add-button" onClick={openModal}>
        <FontAwesomeIcon icon={faPlus} />
        <Modal
          className="modal"
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          overlayClassName="overlay"
          shouldCloseOnOverlayClick={true}>
            <form onSubmit={handleSubmit}>
                <input
                className="prompt"
                autoFocus
                type="text"
                placeholder='Enter your prompt'
                value={userInput}
                onChange={handleInputChange}/>
            </form>
        </Modal>
    </button>
  );
}
