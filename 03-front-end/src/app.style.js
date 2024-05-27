import styled from "styled-components";

export const Navigation = styled.div`
  width: 343px;
  height: 100vh;
  background: #edf3fb;
  display: flex;
  flex-direction: column;

  .nav-wrapper {
    margin: 95px 30px;
    display: flex;
    flex-direction: column;

    .title {
      font-family: "Noto Sans";
      font-style: normal;
      font-weight: 400;
      font-size: 25px;
      line-height: 34px;
      color: #000000;
    }
    .button-wrapper {
      display: flex;
      flex-direction: row;
      margin: 5px 0;
      align-items: center;
      label {
        font-family: "Noto Sans";
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        color: #000000;
      }
    }
  }
`;
