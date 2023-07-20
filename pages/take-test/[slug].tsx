import React, { useCallback, useEffect, useState } from "react";
import { Box, Flex, Skeleton, useDisclosure, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Split from "react-split";
import axios from "../../lib/axios";

import ToolBar from "../../components/ToolBar";
import CodeEditor from "../../components/CodeEditor";
import ProblemStatement from "../../components/ExamProblemStatement";
import LeftProblemsList from "../../components/LeftProblemsList";
import MainLayout from "../../layout/MainLayout";
import SubmissionModal from "../../components/modals/Submission";

import BottomActions from "../../components/BottomActions";
import NewConsole from "../../components/NewConsole";
import {
  useExamData,
  useExamProblemsData,
  useExamSubmissionsData,
} from "../../hooks/useExamsData";
import { useLastSubmissionData } from "../../hooks/useSubmissionsData";
import WarnOnTabLeave from "../../components/WarnOnTabLeave";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { Output } from "../../types";
import SetMeta from "../../components/SEO/SetMeta";

function TakeTest() {
  const router = useRouter();
  const { slug } = router.query;
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("py");
  const [theme, setTheme] = useState("dracula");
  const [output, setOutput] = useState<Output>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentProblemIdx, setCurrentProblemIdx] = useState(1);
  const [lastSubmissionPassed, setLastSubmissionPassed] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  const toast = useToast();

  const {
    data: examData,
    refetch: refetchExamData,
    isLoading: examDataLoading,
    isError: examDataError,
  } = useExamData(slug as string);

  const {
    data: problemsData,
    refetch: refetchProblemsData,
    isLoading: problemsDataLoading,
    isError: problemsDataIsError,
    error: problemsDataError,
  } = useExamProblemsData({ examId: examData?.id as number });

  const {
    isOpen: isSubmissionModalOpen,
    onOpen: onSubmissionModalOpen,
    onClose: onSubmissionModalClose,
  } = useDisclosure();

  const {
    isOpen: isCodeResetModalOpen,
    onOpen: onCodeResetModalOpen,
    onClose: onCodeResetModalClose,
  } = useDisclosure();

  const {
    isOpen: isCodeRetrievalModalOpen,
    onOpen: onCodeRetrievalModalOpen,
    onClose: onCodeRetrievalModalClose,
  } = useDisclosure();
  const onCodeRetriveSuccess = async (lastSubmission) => {
    try {
      if (lastSubmission?.data?.code) setCode(lastSubmission?.data?.code);
      onCodeRetrievalModalClose();
      if (!!lastSubmission?.data)
        toast({
          title: "Code Retrieved",
          description: "Your code has been retrieved successfully",
          position: "top",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      else
        toast({
          title: "No Code Found",
          description: "No code found for this problem",
          position: "top",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
    } catch (err) {
      console.log(err);
      onCodeRetrievalModalClose();
    }
  };
  const onCodeReset = () => {
    setCode(problemsData?.data[currentProblemIdx - 1].starterCode || "");
    toast({
      title: "Code Reset",
      description: "Your code has been reset successfully",
      position: "top",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onCodeResetModalClose();
  };
  // this custom hook works on onSuccess only.
  const {
    refetch: refrechLastSubmission,
    isLoading: lastSubmissionIsLoading,
    fetchStatus: lastSubmissionFetchStatus,
  } = useLastSubmissionData(
    problemsData?.data[currentProblemIdx - 1]?.id,
    onCodeRetriveSuccess
  );

  const { data: submissionData, refetch: refetchSubmissionData } =
    useExamSubmissionsData(examData?.id as number);
  const redirectIfDontHaveAccess = useCallback(() => {
    if (!problemsData && problemsDataIsError) {
      toast({
        title: "Exam Not Found",
        description: "The exam you are trying to access does not exist",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      router.push("/exams");
    }
  }, [problemsData, problemsDataIsError, router, toast]);

  const redirectIfExamNotStarted = useCallback(() => {
    if (!examData) return;
    const { isBounded, startTime } = examData;
    const sTime = new Date(startTime);
    const curr = new Date();

    if (isBounded && sTime.getTime() > curr.getTime()) {
      toast({
        title: "Exam Not Started",
        description: "The exam has not started yet",
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      router.push("/exams");
    } else {
    }
  }, [examData, router, toast]);
  useEffect(() => {
    if (!!!examData) {
      refetchExamData();
    }
    if (!!examData && !!!problemsData) {
      refetchProblemsData();
    }
    redirectIfDontHaveAccess();
    redirectIfExamNotStarted();
  }, [
    examData,
    problemsData,
    refetchExamData,
    refetchProblemsData,
    examDataLoading,
    problemsDataLoading,
    redirectIfExamNotStarted,
    redirectIfDontHaveAccess,
    problemsDataIsError,
  ]);
  useEffect(() => {
    if (!problemsData) return;
    setCode(
      localStorage.getItem(`code ${examData?.id} ${currentProblemIdx}`) ||
        problemsData?.data[currentProblemIdx - 1]?.starterCode ||
        ""
    );
    setShowConsole(false);
    setOutput(null);
  }, [currentProblemIdx, examData?.id, problemsData]);

  useEffect(() => {
    if (code.trim().length === 0) return;
    localStorage.setItem(
      `code ${examData?.id} ${currentProblemIdx}`,
      code
    );
  }, [code, examData, currentProblemIdx]);

  const handleOnCodeRetrive = async () => {
    refrechLastSubmission();
  };

  const runCode = async (submit = false) => {
    setIsLoading(true);
    setShowConsole(true);
    const payload = {
      code,
      lang,
      submit,
      problemId: problemsData.data[currentProblemIdx - 1].id,
      examId: examData.id,
    };
    try {
      const res = await axios.post("/runCode", payload);
      if (submit) {
        // TODO: refresh submissions
        refetchSubmissionData();
        setLastSubmissionPassed(res.data.isCorrect);
        onSubmissionModalOpen();
      }
      setOutput(res.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  if (!examData || problemsDataLoading) return <div>Loading...</div>;
  return (
    <MainLayout examData={examData}>
      <SetMeta
        title={`Coding Ducks - ${examData?.title} - Coding Exam Solutions`}
        description={`Access the solutions for the ${examData?.title} coding exam on Coding Ducks. Review the problem statements and improve your coding techniques in Python, JavaScript, C++, or Java.`}
        keywords={`${examData?.title}, coding exam, solution, Python, JavaScript, C++, Java`}
        url={`https://codingducks.live/${examData?.slug}`}
      />
      {examData?.warnOnBlur && <WarnOnTabLeave />}
      <Flex w={"100vw"} direction="row">
        <Flex>
          <LeftProblemsList
            examId={examData.id}
            problems={problemsData?.data}
            currentProblemIdx={currentProblemIdx}
            setCurrentProblemIdx={setCurrentProblemIdx}
          />
        </Flex>
        {problemsDataLoading || problemsData?.data.length === 0 ? (
          <Skeleton height="100vh" />
        ) : (
          <Flex flexGrow={1}>
            <Split
              className="split-h"
              minSize={300}
              style={{ height: "100%", width: "100%" }}
            >
              <ProblemStatement
                problem={problemsData.data[currentProblemIdx - 1]}
              />
              <Flex
                direction={"column"}
                justify="space-between"
                width="100%"
                px={2}
              >
                <Flex justify={"end"}>
                  <ToolBar
                    isLoading={isLoading}
                    runCode={runCode}
                    onCodeRetrievalModalOpen={onCodeRetrievalModalOpen}
                    onCodeReset={onCodeResetModalOpen}
                  />
                </Flex>
                <Flex flexGrow={1} direction="column" h={"45"}>
                  <Flex flexGrow={1} overflow="auto">
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      lang={lang}
                      theme={theme}
                      runCode={() => runCode(false)}
                    />
                  </Flex>
                  <Flex w={"full"}>
                    {showConsole && (
                      <Box overflow={"auto"} w={"full"}>
                        <NewConsole
                          output={output}
                          onClose={() => {
                            setShowConsole(false);
                          }}
                        />
                      </Box>
                    )}
                  </Flex>
                </Flex>
                <Flex h={"50px"}>
                  <BottomActions
                    isTutorialProblem={true}
                    showConsole={showConsole}
                    setShowConsole={setShowConsole}
                    runCode={runCode}
                    isLoading={isLoading}
                  />
                </Flex>
              </Flex>
            </Split>
          </Flex>
        )}
        <ConfirmModal
          onClose={onCodeResetModalClose}
          isOpen={isCodeResetModalOpen}
          onConfirm={onCodeReset}
        >
          This will replace your current code with the default code.
        </ConfirmModal>
        <ConfirmModal
          onClose={onCodeRetrievalModalClose}
          isOpen={isCodeRetrievalModalOpen}
          onConfirm={handleOnCodeRetrive}
          isLoading={
            lastSubmissionIsLoading && lastSubmissionFetchStatus !== "idle"
          }
        >
          This will replace your current code with the code from your last
          submission.
        </ConfirmModal>
        <SubmissionModal
          onClose={() => {
            setLastSubmissionPassed(false);
            onSubmissionModalClose();
          }}
          isOpen={isSubmissionModalOpen}
          passed={lastSubmissionPassed}
          setCurrentProblemIdx={setCurrentProblemIdx}
          canGoToNextProblem={currentProblemIdx < problemsData.data.length}
        />
      </Flex>
    </MainLayout>
  );
}

export default TakeTest;
