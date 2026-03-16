import cv2
import uuid
import socket
import requests
import time


#CONFIGURATION
BACKEND_URL = "http://localhost:8000/api/v1"
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzM5MzAxNzgsInN1YiI6IjUwNzNjYzQyLTFjYzgtNDdkMC1hNzAxLWJlNjc4NmEyZWZmZiIsIm9yZ19pZCI6IjYxZWVhMDBlLWE3ZjYtNGQ1Ni05ZTQ2LTk4Y2RmNmVmYTcyOSIsInJvbGUiOiJIUl9BRE1JTiJ9.Iw6X5ltbS1-ssYgI0O8c2RfyvuENrcfA-CsMn6I_Ul8"

HEADERS = {
    "Authorization": f"Bearer {JWT_TOKEN}",
}



#GENERATE UNIQUE DEVICE IDENTIFIER BASED ON HOSTNAME AND MAC ADDRESS
def generate_device_identifier():
    hostname=socket.gethostname()
    mac=hex(uuid.getnode())[2:]
    return f"{hostname}-{mac}"





#REGISTER OR IDENTIFY CAMERA
def identify_camera():
    device_identifier = generate_device_identifier()

    payload = {
        "device_identifier": device_identifier,
        "camera_name": f"{socket.gethostname()} Camera",
        "camera_type": "Laptop Camera",
        "ip_address": socket.gethostbyname(socket.gethostname())
    }

    response = requests.post(f"{BACKEND_URL}/cameras/identify", json=payload, headers=HEADERS)

    if response.status_code != 200:
        print("Failed to identify camera:",response.text)
        exit()    
    data=response.json()

    print("Camera identified/registered successfully.")
    print("Camera ID:", data["camera_id"])
    return data["camera_id"]



#SEND FRAME TO BACKEND FOR RECOGNITION
def send_frame(camera_id, frame):
    _, buffer = cv2.imencode('.jpg', frame)
    files = {
        "file": ("frame.jpg", buffer.tobytes(), "image/jpeg")
    }
    data={
        "camera_id": camera_id
    }
    try:
        response = requests.post(
            f"{BACKEND_URL}/recognition/camera",
            files=files,
            data=data,
            headers=HEADERS
        )

        print("Status:", response.status_code)
        print("Response:", response.text)
        
    except Exception as e:
        print("Recognition error:", e)



#MAIN FUNCTION TO START CAMERA AND STREAM FRAMES
def start_camera(camera_id):
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Cannot open camera")
        exit()

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        cv2.imshow('Camera Feed', frame)

        send_frame(camera_id, frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        time.sleep(2)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    camera_id = identify_camera()
    start_camera(camera_id)