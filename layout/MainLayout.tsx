import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faHome, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import ThemeToggler from "../components/ThemeToggler";
import UserProfile from "../components/UserProfile";
import { useExamSubmissionsData } from "../hooks/useExamsData";
import Timer from "../components/Timer";
import { useRouter } from "next/router";

interface MainLayoutProps {
  children: React.ReactNode;
  examData: {
    id: number;
    title: string;
    isBounded: boolean;
    endTime: string;
    slug: string;
  };
}
//this fucntion takes examId to show the marks obtained in the exam
function MainLayout({ children, examData }: MainLayoutProps) {
  const router = useRouter();
  const { id: examId, slug: examSlug } = examData;
  const title = examData ? examData?.data?.title : "Unknown test";

  const { data: submissionData } = useExamSubmissionsData(examId);
  const { totalMarks, marksObtained } = submissionData?.data || {
    totalMarks: 0,
    marksObtained: 0,
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction={"column"} h={"100vh"}>
      <Flex
        as="nav"
        alignItems={"center"}
        // bg="purple.600"
        // color={"white"}
        w={"100vw"}
        px={2}
        h={"70px"}
      >
        <HStack alignItems={"center"} h={"70px"}>
          <Link href={"/home"}>
            <IconButton
              aria-label="Go back"
              bg={"transparent"}
              icon={
                <FontAwesomeIcon
                  height={"1.2rem"}
                  icon={faLeftLong as IconProp}
                />
              }
            />
          </Link>
          <Link href={"/"}>
            <IconButton
              aria-label="Go home"
              bg={"transparent"}
              icon={
                <FontAwesomeIcon height={"1.2rem"} icon={faHome as IconProp} />
              }
            />
          </Link>
          <Text fontSize="20px" fontWeight={"extrabold"} noOfLines={1}>
            {title}
          </Text>
        </HStack>
        <Spacer />
        <Timer />
        <Spacer />
        <HStack>
          <Text fontWeight={"extrabold"}>
            {marksObtained}/{totalMarks}
          </Text>
          <ThemeToggler />
          <UserProfile />
          <Button variant={"solid"} bg={"red.400"} onClick={onOpen}>
            Finish
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Finish Exam</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Are you sure you want to finish the exam? You can still come
                  to complete the exam
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost">Cancel</Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    router.push("/feedback/" + examSlug);
                  }}
                >
                  Finish
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </HStack>
      </Flex>
      <Flex w={"100vw"} flexGrow={1} overflowY="hidden">
        {children}
      </Flex>
    </Flex>
  );
}

export default MainLayout;
