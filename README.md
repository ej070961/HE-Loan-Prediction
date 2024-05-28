# Loan default prediction application 🏦🔐

This project is a real-time loan default prediction application that applies homomorphic encryption(HE) to the training and evaluation processes of financial data.

## Requirements

This project uses following technologies and libraries:

- **python 3.8.10**
  - pi-heaan 3.4.1.3
  - flask 3.0.3
- **Node.js 20.12.2**
  - React 18.3.1
  - axios 1.7.1

## Service Architecture

![service-architecture](https://github.com/KSJ27/app-with-HE/assets/52899088/6b2da81d-02cb-421d-b2d3-b9c4659ef76d)

## Project Phases

### 1. Data Analysis 📈

  1. Data Preprocessing

  In this Step, we perform preparing and cleaning users’ financial data before analysis. This process is coded in ‘01-data-analysis/preprocessing.ipynb’.

  Data Source: Lending Club 2007-2020Q3  
  <https://www.kaggle.com/datasets/ethon0426/lending-club-20072020q1>  
  The dataset contains loan information and personal data from the years 2007 to 2020.

    We performed null value removal, realization of categorical variables, and target variable preprocessing before analysis.

    - Removing Null Values: We removed null values from the dataset to enhance the accuracy of the model.

    - Converting Categorical Variables to Integers: We mapped categorical data such as 'purpose', 'term', 'grade', 'emp_length', and 'home_ownership' to integer values. Additionally, we removed '%' from the 'int_rate' column and converted it to float64.

    - Applying Log Transformation: We applied a log transformation to the 'annual_inc' and 'loan_amnt' variables to improve the normality of the data.

    - Preprocessing on the target variable 'loan_status': Our analysis aims to predict whether borrower repay the loan. Therefore, loans with a 'current' status and those not meeting current policy standards were excluded. The 'loan_status' variable was simplified into two categories: Good Loan(0) - Fully Paid, Bad Loan(1) - Default, Charged off, Late, In Grace Period

      Finally, we used the data from 2019 as the training set and the data from 2020 as the test set.

  2. Homomorphic Encryption
  2 - 5 stages are coded in ‘01-data-analysis/modeling_HE.ipynb’.
  In third phase, we utilized the pi-heaan library to perform homomorphic encryption on the training and test datasets.

  3. Model Development
  In this phase, we develop logistic regression model for training encrypted data.

      1. Initial Beta Value Setup
      Set beta values randomly and encrypted for secure computation.

      2. Define Step() function
          1. **Compute Linear Combination**
          Compute the linear combination of input features with their corresponding beta values utilizing eval.mult, eval.left_rotate, eval.add function.
          2. **Sigmoid Calculation**: Apply the sigmoid function to get the predicted probabilities.
          3. **Gradient Calculation**: Compute the gradient of the loss function with respect to the predictions by using mathematical operation.
          4. **Update beta values**: Update the beta values based on the computed gradient.

      3. Model Training  
      To train the logistic regression model, we use the step function iteratively.

  4. Model Evaluation

      - Accuracy: Most intuitive performance metric.
      - Recall: It is important in imbalanced datasets to understand how well the model identifies the minority class.
      - G-mean: It considers the performance on both positive and negative classes, making it a balanced metric.
      - ROC AUC: It is independent of the classification threshold and provides an aggregate measure of performance across all possible classification thresholds. It's particularly useful for evaluating the performance of binary classifiers in imbalanced datasets.

### 2. Backend Development 🤖

In 02-back-end/app.py, upon receiving a POST request to the /predict endpoint, the following tasks are performed:

1. Decrypt the JSON-formatted financial data encrypted with the AES algorithm,  received from the client.
    >Example of given data:  
    >{"log_inc":9.4134,"log_loan_amnt":7.78322,"int_rate":15.96,"purpose":8,"grade":1,"emp_length":10,"dti":8.72,"last_fico_range_high":12,"last_fico_range_low":2,"home_ownership":1,"total_acc":10,"delinq_2yrs":0,"term":36,"installment":84.33}

2. Encrypt the above message using the heaan library for homomorphic encryption.

3. Perform computations on the encrypted data.
  The compute_sigmoid function from operations.py is imported, with cntxt_beta's parameters generated from a binary file saved during the data analysis phase.

4. Decrypt the result and store it in the variable result.
  If the predicted value is greater than or equal to 0.6, store 1 in result; otherwise, store 0.

5. Respond to the client with the result, which is in the form of binary data (0 or 1).

### 3. Frontend Development 💻

In 03-front-end

![image](https://github.com/KSJ27/app-with-HE/assets/52899088/b340af09-bf4d-495c-bce9-ec6dedf104fd)

- Home: Upon accessing the webpage, users can initially see a brief introduction and explanation through HomeContent. They can navigate to PredictContent, where they can predict the default status, using the left-side navigation.

- Predict: Users can input 14 types of data: financial data of a person borrowing money and the detail of loan. Depending on the characteristics of the data, they can either directly input values or select from dropdown menus.

  In the input fields, users receive hints and warning messages to ensure correct input: "This field is required," "Invalid format."

  When the Predict button is clicked, it invokes the onSubmit function and calls the handleEncrypt function.

  In onSubmit, it retrieves the data from the input fields and maps categorical data to numerical values using functions in mapping.js. It formats each of the 14 data points into JSON format for transmission.

  handleEncrypt encrypts the given JSON data using the AES algorithm from CryptoJS library and sends a POST request to the /predict API route. If the response is 0, it displays "Will be Full Paid 😄"; if the response is 1, it displays "Will be default 🫠."
