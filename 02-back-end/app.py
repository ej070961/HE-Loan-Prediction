import operations as ops
import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import piheaan as heaan
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64
import json
from piheaan.math import approx

app = Flask(__name__)
CORS(app)

load_dotenv()
current_dir = os.path.dirname(os.path.abspath(__file__))
key_file_path = os.path.join(current_dir, "keys") # key for pi-heaan
model_file_path = os.path.join(current_dir, "logistic_HE.bin") # ML model for prediction

# Load the context and keys
params = heaan.ParameterPreset.FGb
context = heaan.make_context(params)
heaan.make_bootstrappable(context)

secret_key = heaan.SecretKey(context, key_file_path + "/secretkey.bin")
heaan_public_key = heaan.KeyPack(context, key_file_path + "/")
heaan_public_key.load_enc_key()
heaan_public_key.load_mult_key()

eval = heaan.HomEvaluator(context, heaan_public_key)
dec = heaan.Decryptor(context)
enc = heaan.Encryptor(context)

# Load the model
ctxt_next = heaan.Ciphertext(context)
ctxt_next.load(model_file_path)

# Function to handle a POST request to /predict endpoint.
# The request data format is {'ciphertext': string, 'iv': string}.
# It returns the prediction result in the format result: 0 or 1.
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    print(data)

    ciphertext = data['ciphertext']
    iv = data['iv']

    key = bytes.fromhex(os.getenv('AES_KEY'))
    iv = bytes.fromhex(iv)
    
    # Decryption
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted_data = unpad(cipher.decrypt(base64.b64decode(ciphertext)), AES.block_size).decode()
    # print("Decrypted:", decrypted_data)
    decrypted_data = json.loads(decrypted_data)

    # Extract and convert input data
    input_values = [
        float(decrypted_data['log_inc']),
        float(decrypted_data['log_loan_amnt']),
        float(decrypted_data['int_rate']),
        float(decrypted_data['purpose']),
        float(decrypted_data['grade']),
        float(decrypted_data['emp_length']),
        float(decrypted_data['dti']),
        float(decrypted_data['last_fico_range_high']),
        float(decrypted_data['last_fico_range_low']),
        float(decrypted_data['home_ownership']),
        float(decrypted_data['total_acc']),
        float(decrypted_data['delinq_2yrs']),
        float(decrypted_data['term']),
        float(decrypted_data['installment'])
    ]

    log_slots = 15
    num_slots = 2**log_slots
    n = 1  # Since we are dealing with a single data point

    # Initialize message for the single data point
    msg_X_test = heaan.Message(log_slots)
    
    # Load the encrypted values from the JSON object
    for i, value in enumerate(input_values):
        msg_X_test[i] = value

    # Encrypt the full message into a single ciphertext
    ctxt_X_test = heaan.Ciphertext(context)
    enc.encrypt(msg_X_test, heaan_public_key, ctxt_X_test)
    
    # Perform inference
    ctxt_infer = ops.compute_sigmoid(ctxt_X_test, ctxt_next, n, log_slots, eval, context, num_slots)
    
    # Decrypt the results
    res = heaan.Message(log_slots)
    dec.decrypt(ctxt_infer, secret_key, res)
    
    # Return the result
    result = 1 if res[0].real >= 0.6 else 0
    return jsonify(result=result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
