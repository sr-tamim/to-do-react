import { useState } from "react";

const useModal = () => {
    const [modalOpen, setModalOpen] = useState(false)
    const [modalBody, setModalBody] = useState(null)

    function closeModal() {
        setModalOpen(false)
    }

    return {
        modalOpen, setModalOpen,
        modalBody, setModalBody,
        closeModal
    }
};

export default useModal;