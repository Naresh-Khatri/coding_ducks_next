import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { faClock, faHome, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useContext } from "react";
// import Sidebar from "../components/Sidebar";
import ThemeToggler from "../components/ThemeToggler";
import UserProfile from "../components/UserProfile";
import { submissionsContext } from "../contexts/submissionsContext";

function MainLayout({ children, title }) {
  const { totalMarks, marks } = useContext(submissionsContext);
  return (
    <Flex direction={"column"} h={"100vh"}>
      <Flex
        as="nav"
        alignItems={"center"}
        bg="purple.600"
        color={"white"}
        w={"100vw"}
        px={2}
        h={"70px"}
      >
        <HStack alignItems={"center"} h={"70px"}>
          <Link href={"/home"}>
            <IconButton
              bg={"transparent"}
              icon={<FontAwesomeIcon height={"1.2rem"} icon={faLeftLong} />}
            />
          </Link>
          <Link href={"/"}>
            <IconButton
              bg={"transparent"}
              icon={<FontAwesomeIcon height={"1.2rem"} icon={faHome} />}
            />
          </Link>
          <Text fontSize="20px" fontWeight={"extrabold"} noOfLines={1}>
            {title}
          </Text>
        </HStack>
        <Spacer />
        <HStack>
          <FontAwesomeIcon height={"1.2rem"} icon={faClock} />
          <Text fontWeight={"extrabold"}> Unbounded </Text>
        </HStack>
        <Spacer />
        <HStack>
          <Text fontWeight={"extrabold"}>
            {marks}/{totalMarks}
          </Text>
          <ThemeToggler />
          <UserProfile />

          {/* <Button variant={"solid"} bg={"red.400"} disabled>
            Finish
          </Button> */}
        </HStack>
      </Flex>
      <Flex w={"100vw"} flexGrow={1} overflowY="hidden">
        {/* <Sidebar /> */}
        {children}
      </Flex>
    </Flex>
  );
}

export default MainLayout;
