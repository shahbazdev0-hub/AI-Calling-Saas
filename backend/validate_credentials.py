import requests

data = {
    'CallSid': 'TEST123',
    'From': '+923208518724',
    'To': '+12514188449',
    'CallStatus': 'ringing',
    'Direction': 'inbound'
}

response = requests.post('http://localhost:8000/api/v1/voice/webhook/incoming', data=data)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")