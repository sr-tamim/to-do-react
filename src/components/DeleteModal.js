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
            <DialogBody divider>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus ad
                reprehenderit omnis perspiciatis aut odit! Unde architecto
                perspiciatis, dolorum dolorem iure quia saepe autem accusamus eum
                praesentium magni corrupti explicabo!
            </DialogBody>
            <DialogFooter>
                <Button>Delete</Button>
                <Button onClick={closeModal}>Don't Delete</Button>
            </DialogFooter>
        </>
    );
};

export default DeleteModal;