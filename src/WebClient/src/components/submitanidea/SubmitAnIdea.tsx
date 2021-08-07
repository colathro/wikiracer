import styled from "styled-components";
import { Text, DefaultButton, TextField } from "@fluentui/react";
import { useState } from "react";
import AuthState from "../../state/AuthState";
import PopUpState from "../../state/PopUpState";

const BigLayout = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`;

const Layout = styled.div`
  min-width: 30em;
  display: flex;
  flex-direction: column;
`;

const Spacer = styled.div`
  height: 2em;
`;

const SubmitAnIdea = () => {
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeTitle = (e: any) => {
    setTitle(e.target.value);
  };

  const onChangeIssue = (e: any) => {
    setIssue(e.target.value);
  };

  const submitCallback = () => {
    setTitle("");
    setIssue("");
    setIsSubmitting(false);
    PopUpState.showSuccess(
      "Issue successfully submited! We are working on it!"
    );
  };

  const submit = () => {
    if (isSubmitting) {
      return;
    }
    if (title === "") {
      PopUpState.showError(
        "Please fillout the 'Issue Summary:' section of the form!"
      );
      return;
    }
    if (issue === "") {
      PopUpState.showError("Please fillout the 'Issue:' section of the form!");
      return;
    }
    setIsSubmitting(true);
    AuthState.submitIdea(submitCallback, title, issue);
  };

  return (
    <BigLayout>
      <Layout>
        <Text variant="xxLargePlus">Submit An Idea</Text>
        <Spacer></Spacer>
        <TextField
          label="Idea Summary: "
          onChange={(e: any) => {
            onChangeTitle(e);
          }}
          value={title}
        />
        <Spacer></Spacer>
        <TextField
          label="Idea: "
          multiline
          autoAdjustHeight
          onChange={(e: any) => {
            onChangeIssue(e);
          }}
          value={issue}
        />
        <Spacer></Spacer>
        <DefaultButton
          onClick={() => {
            submit();
          }}
        >
          Submit
        </DefaultButton>
      </Layout>
    </BigLayout>
  );
};

export default SubmitAnIdea;
