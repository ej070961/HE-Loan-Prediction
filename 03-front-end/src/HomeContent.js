import React from "react";
import styled from "styled-components";
function HomeContent() {
  return (
    <Wrapper>
      <h1>Lending-Club Loan Prediction App</h1>
      <p>
        Welcome to the Loan Status Predictor App!🥳
        <br />
        With just few inputs, ourmodel can predict whether a loan is Fully Paid
        or Default.
        <br />
        To get started, simply fill in the Borrower Details and Loan Details.
        <br />
        Don't worry about missing inputs as default values have been set for
        each feature🤙.
        <br />
        However, for optimal results, we recommend filling in all inputs.
        <br />
        Once you've entered all necessary details,
        <br />
        hit the Predict button to see the prediction.
        <br />
        We hope this app helps you make informed financial decisions.
        <br />
        Thank you for using our Loan Status Predictor App!
      </p>
    </Wrapper>
  );
}

export default HomeContent;

const Wrapper = styled.div`
  margin: 80px 0 0 80px;
  display: flex;
  flex-direction: column;
  width: 1000px;
  height: 100vh;
  p {
    font-size: 16px;
  }
`;
