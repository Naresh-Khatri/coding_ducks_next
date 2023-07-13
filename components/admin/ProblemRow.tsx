import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Td,
  Text,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ProblemDeleteModal from "./ProblemDeleteModal";
import ProblemEditor from "./ProblemEditor";
import { IExam, IProblem } from "../../types";

function ProblemRow({
  problem,
  fetchProblems,
  examsList,
}: {
  problem: IProblem;
  fetchProblems: () => void;
  examsList: IExam[];
}) {
  const {
    id,
    exam,
    examId,
    order,
    frontendProblemId,
    difficulty,
    title,
    description,
    tags,
  } = problem;
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
    <>
      <Td>{id}</Td>
      <Td w={"30px"}>{frontendProblemId}</Td>
      <Td>
        <Text>{title}</Text>
      </Td>
      <Td>{difficulty}</Td>
      <Td>{examId ? `${examId}. ${exam?.title}` : <Badge>Na</Badge>}</Td>
      <Td>{examId ? `${order}` : <Badge>Na</Badge>}</Td>
      <Td>
        <HStack>
          <IconButton
            aria-label="Edit Problem"
            icon={<FontAwesomeIcon icon={faEdit as IconProp} />}
            onClick={onEditOpen}
          />
          {isEditOpen && (
            <ProblemEditor
              problemData={problem}
              examsList={examsList}
              isOpen={isEditOpen}
              onClose={onEditClose}
              onEditSuccess={() => {
                fetchProblems();
                onEditClose();
              }}
            />
          )}
          <IconButton
            aria-label="Delete Problem"
            bg="red.500"
            icon={<FontAwesomeIcon icon={faTrash as IconProp} />}
            onClick={onDeleteOpen}
          />
          <ProblemDeleteModal
            problemData={problem}
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            onDeleteSuccess={() => {
              fetchProblems();
              onDeleteClose();
            }}
          />
        </HStack>
      </Td>
    </>
  );
}

export default ProblemRow;
