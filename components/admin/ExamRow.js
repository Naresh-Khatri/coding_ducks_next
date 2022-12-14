import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  CloseButton,
  HStack,
  IconButton,
  Td,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";
import ExamDeleteModal from "./ExamDeleteModal";
import ExamEditor from "./ExamEditor";

function ExamRow({ exam, fetchExams }) {
  const { id, coverImg, title, description, endTime, startTime, active } = exam;
  const {
    onOpen: onEditOpen,
    onClose: onEditClose,
    isOpen: isEditOpen,
  } = useDisclosure();

  const {
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
    isOpen: isDeleteOpen,
  } = useDisclosure();

  return (
    <Tr>
      <Td>{id}</Td>
      <Td>
        <Image
          src={coverImg}
          width={"100"}
          height={"100"}
          alt={title + " cover image"}
          style={{ borderRadius: "10%" }}
        />
      </Td>
      <Td>{title}</Td>
      <Td>{startTime}</Td>
      <Td>
        {active ? (
          <CheckIcon color={"green.400"} />
        ) : (
          <CloseIcon color={"red.600"} />
        )}
      </Td>
      <Td>
        <HStack>
          <IconButton
            icon={<FontAwesomeIcon icon={faEdit} />}
            onClick={onEditOpen}
          />
          <ExamEditor
            examData={exam}
            isOpen={isEditOpen}
            onClose={onEditClose}
            onOpen={onEditOpen}
            onEditSuccess={() => {
              fetchExams();
              onEditClose();
            }}
          />
          <IconButton
            bg="red.300"
            icon={<FontAwesomeIcon icon={faTrash} />}
            onClick={onDeleteOpen}
          />
          <ExamDeleteModal
            examData={exam}
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            onOpen={onDeleteOpen}
            onDeleteSuccess={() => {
              fetchExams();
              onDeleteClose();
            }}
          />
        </HStack>
      </Td>
    </Tr>
  );
}

export default ExamRow;
