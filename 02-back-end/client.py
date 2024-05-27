import requests
import piheaan as heaan
import os
import json

# 설정 및 초기화
current_dir = os.path.dirname(os.path.abspath(__file__))
key_file_path = os.path.join(current_dir, "keys")

# Load the context and keys
params = heaan.ParameterPreset.FGb
context = heaan.make_context(params)
heaan.make_bootstrappable(context)

secret_key = heaan.SecretKey(context, key_file_path + "/secretkey.bin")
public_key = heaan.KeyPack(context, key_file_path + "/")
public_key.load_enc_key()
public_key.load_mult_key()

enc = heaan.Encryptor(context)
dec = heaan.Decryptor(context)

# 암호화할 데이터를 준비합니다.
data = {
    0: 12.409013,
    1: 9.677214,
    2: 0.1612,
    3: 388.90,
    4: 0,
    5: 2,
    6: 7,
    7: 0,
    8: 0,
    9: 30.46,
    10: 604.0,
    11: 600.0,
    12: 35.0,
    13: 0.0
}

# 데이터를 암호화하여 JSON 형식으로 준비합니다.
encrypted_data = {}
for key, value in data.items():
    msg = heaan.Message(15)
    msg[0] = value
    ctxt = heaan.Ciphertext(context)
    enc.encrypt(msg, public_key, ctxt)
    encrypted_file_path = os.path.join(current_dir, f"ctxt_{key}.bin")
    ctxt.save(encrypted_file_path)
    
    with open(encrypted_file_path, "rb") as f:
        encrypted_data[key] = f.read().hex()

# 서버에 POST 요청을 보냅니다.
url = "http://localhost:5000/predict"
response = requests.post(url, json=encrypted_data)

# 응답값을 바이너리로 받아서 복호화합니다.
encrypted_result_path = os.path.join(current_dir, "encrypted_result.bin")
with open(encrypted_result_path, "wb") as f:
    f.write(bytes.fromhex(response.text))

ctxt_result = heaan.Ciphertext(context)
ctxt_result.load(encrypted_result_path)
msg_result = heaan.Message(15)
dec.decrypt(ctxt_result, secret_key, msg_result)

# 결과 출력
print("Decrypted prediction result:", msg_result[0].real)
