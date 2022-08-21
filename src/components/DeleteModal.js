import {
    Button,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { useContext } from "react";
import { ModalContext } from "../App";

const DeleteModal = () => {
    const { closeModal } = useContext(ModalContext)

    return (
        <>
            <DialogHeader>Are you sure?</DialogHeader>
            <DialogBody>
                Deleting a task is permanent. This can't be undone. There is no recycle bin for your deleted tasks. So be 100% sure before clicking "Delete" button.
            </DialogBody>
            <DialogFooter className="gap-4">
                <Button color="red" variant="gradient" >Delete</Button>
                <Button onClick={closeModal} variant="gradient" >Don't Delete</Button>
            </DialogFooter>
        </>
    );
};

export default DeleteModal;