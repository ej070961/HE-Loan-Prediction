/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import * as P from "./predict.style";
import { useForm } from "react-hook-form";
import CryptoJS from "crypto-js";
import axios from "axios";
import {
  employmentLengthOptions,
  homeOwnershipOptions,
  purposeOptions,
  gradeOptions,
} from "./mapping";

function PredictContent() {
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: onchange,
    defaultValues: {
      employmentLength: "10+ years",
      homeOwnership: "RENT",
      loan_amount: 2400,
      income: 12252.0,
      term: 36,
      int_rate: 15.96,
      installment: 84.33,
      grade: "B",
      purpose: "small_business",
      dti: 8.72,
      last_fico_range_high: 12.0,
      last_fico_range_low: 2.0,
      total_acc: 10.0,
      delinq_2yrs: 0.0,
    },
  });

  const [result, setResult] = useState();

  const onSubmit = async (data) => {
    const {
      employmentLength,
      homeOwnership,
      loan_amount,
      income,
      term,
      int_rate,
      installment,
      grade,
      purpose,
      dti,
      last_fico_range_high,
      last_fico_range_low,
      total_acc,
      delinq_2yrs,
    } = getValues();

    const emp_length = employmentLengthOptions[employmentLength];
    const home_ownership = homeOwnershipOptions[homeOwnership];
    const purpose_int = purposeOptions[purpose];
    const grade_int = gradeOptions[grade];
    const log_inc = Math.log(income);
    const log_loan_amnt = Math.log(loan_amount);

    let server_data = {
      log_inc: log_inc,
      log_loan_amnt: log_loan_amnt,
      int_rate: int_rate,
      purpose: purpose_int,
      grade: grade_int,
      emp_length: emp_length,
      dti: dti,
      last_fico_range_high: last_fico_range_high,
      last_fico_range_low: last_fico_range_low,
      home_ownership: home_ownership,
      total_acc: total_acc,
      delinq_2yrs: delinq_2yrs,
      term: term,
      installment: installment,
    };
    // console.log(server_data);
    handleEncrypt(server_data);
  };

  function generateRandomHex(length) {
    const characters = "abcdef0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const handleEncrypt = async (server_data) => {
    const dataString = JSON.stringify(server_data);
    const key = CryptoJS.enc.Hex.parse(process.env.REACT_APP_SECRET_KEY);
    const iv = CryptoJS.enc.Hex.parse(generateRandomHex(32)); // 32 characters for 16 bytes

    const ciphertext = CryptoJS.AES.encrypt(dataString, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();
    console.log("Ciphertext:", ciphertext);

    const res = await axios.post("/predict", {
      ciphertext: ciphertext,
      iv: iv.toString(CryptoJS.enc.Hex),
    });

    console.log(res);
    if (res.data === 0) {
      setResult("Will be Full Paid 😄 ");
    } else {
      setResult("Will be default 🫠");
    }
  };

  return (
    <div style={{ overflow: "auto", height: "100vh", width: "100%" }}>
      <form
        style={{ display: "flex", flexDirection: "row" }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <P.ContentWrapper>
          <span className="title">Borrower Details</span>
          <span className="detail">Enter Borrower details here.</span>
          <label>Employment Length(in year)</label>
          <select {...register("employmentLength", { required: true })}>
            {Object.keys(employmentLengthOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          {errors.employmentLength && <p>This field is required</p>}
          <label>Home Ownership</label>
          <select {...register("homeOwnership", { required: true })}>
            {Object.keys(homeOwnershipOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          {errors.homeOwnership && <p>This field is required</p>}
          <label>Annual Income</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("income", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          <label>Purpose for the loan</label>
          <select {...register("purpose", { required: true })}>
            {Object.keys(purposeOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          {errors.purpose && <p>This field is required</p>}
          <label>Debt-to-Income Ratio (DTI)</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("dti", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          <label>Delinquency count in the past 2 years</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("delinq_2yrs", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          <label>Grade</label>
          <select {...register("grade", { required: true })}>
            {Object.keys(gradeOptions).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          {errors.grade && <p>This field is required</p>}
          <label>Upper limit of the most recent FICO credit score range</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("last_fico_range_high", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          {errors.last_fico_range_high && errors.last_fico_range_high.message}
          <label>Lower limit of the most recent FICO credit score range</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("last_fico_range_low", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          {errors.last_fico_range_low && errors.last_fico_range_low.message}
          <label>Enter your total number of credit accounts:</label>
          <input
            type="number"
            placeholder="0"
            {...register("total_acc", {
              required: "This field is required",
            })}
          />
          {errors.total_acc && errors.total_acc.message}
        </P.ContentWrapper>
        <P.ContentWrapper>
          <span className="title">Loan Details</span>
          <span className="detail">Enter Loan details here.</span>
          <label>Loan Amount(in $)</label>
          <input
            type="number"
            placeholder="0"
            {...register("loan_amount", {
              required: "This field is required",
            })}
          />
          {errors.loan_amount && errors.loan_amount.message}
          <label>Term</label>
          <select {...register("term", { required: true })}>
            {[36, 60].map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <label>Interest Rate</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("int_rate", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          {errors.int_rate && errors.int_rate.message}
          <label>Monthly Amount</label>
          <input
            type="text"
            placeholder="0.00"
            {...register("installment", {
              required: "This field is required",
              pattern: {
                value: /^\d*\.?\d*$/, // 숫자와 소수점만 허용
                message: "Invalid format", // 패턴에 맞지 않을 경우 표시될 메시지
              },
            })}
          />
          {errors.installment && errors.installment.message}
          <button type="submit">Predict</button>
          {result && result.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <P.PredictionTitle>Prediction: </P.PredictionTitle>
              <P.StyledSpan>{result}</P.StyledSpan>
            </div>
          )}
        </P.ContentWrapper>
      </form>
    </div>
  );
}

export default PredictContent;
