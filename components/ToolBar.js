import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Box,
  HStack,
  Select,
  Spacer,
  IconButton,
  Text,
  Input,
  InputRightElement,
  InputGroup,
  useColorModeValue,
} from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import { useContext, useState } from "react";
import { userContext } from "../contexts/userContext";
import { faReact } from "@fortawesome/free-brands-svg-icons";
// import { filesRoute } from "../apiRoutes";
// import axios from "axios";

export default function ToolBar({
  isLoading,
  runCode,
  lang,
  setLang,
  theme,
  setTheme,
  saveBtnLoading,
}) {
  return (
    <Box>
      <HStack p={2} justifyContent="end">
        <Select
          bg="purple.500"
          color="white"
          maxW={40}
          value={lang}
          onChange={(e) => {
            setLang(e.target.value);
          }}
        >
          <option style={{ color: "black" }} value="py">
            Python
          </option>
          <option style={{ color: "black" }} value="js">
            Javascript
          </option>
          <option style={{ color: "black" }} value="cpp">
            C++
          </option>
          <option style={{ color: "black" }} value="c">
            C
          </option>
          <option style={{ color: "black" }} value="java">
            Java
          </option>
        </Select>
        <Select
          maxW={40}
          onChange={(e) => setTheme(e.target.value)}
          bg="purple.500"
          color="white"
        >
          <option style={{ color: "black" }} value="dracula">
            Dracula
          </option>
          <option style={{ color: "black" }} value="atomone">
            Atom One
          </option>
          <option style={{ color: "black" }} value="eclipse">
            Eclipse
          </option>
          <option style={{ color: "black" }} value="okaidia">
            Okaidia
          </option>
          <option style={{ color: "black" }} value="githubDark">
            Github Dark
          </option>
          <option style={{ color: "black" }} value="githubLight">
            Github Light
          </option>
          <option style={{ color: "black" }} value="duotoneDark">
            Duotone Dark
          </option>
          <option style={{ color: "black" }} value="duotoneLight">
            Duotone Light
          </option>
          <option style={{ color: "black" }} value="xcodeDark">
            Xcode Dark
          </option>
          <option style={{ color: "black" }} value="xcodeLight">
            Xcode Light
          </option>
        </Select>
      </HStack>
    </Box>
  );
}
