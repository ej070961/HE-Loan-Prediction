import styled from "styled-components";
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;
export const ContentWrapper = styled.div`
  margin: 80px 0 0 80px;
  display: flex;
  flex-direction: column;

  .title {
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 900;
    font-size: 30px;
    line-height: 34px;
    color: #000000;
  }
  .detail {
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #454c53;
    margin: 15px 0;
  }
  label {
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #454c53;
    margin-top: 10px;
  }
  select,
  input {
    width: 450px;
    height: 35px;
    background: #e8ebed;
    border-radius: 5px;
    margin-top: 10px;
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    color: #454c53;
    border: 0;
    padding: 0 3px;
  }
  button {
    width: 110px;
    height: 40px;
    border: 1px solid #9ea4aa;
    border-radius: 5px;
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    color: #454c53;
    background: none;
    margin-top: 15px;
    cursor: pointer;

    &:hover {
      border: 1px solid #5293ff;
      color: #5293ff;
    }
  }
`;

export const PredictionTitle = styled.span`
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 900;
  font-size: 30px;
  line-height: 34px;
  color: #000000;
  margin-top: 20px;
`;

export const StyledSpan = styled.span`
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 34px;
  color: #5293ff;
  margin-top: 10px;
`;
