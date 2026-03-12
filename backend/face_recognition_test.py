import cv2
import requests

ORG_ID = "61eea00e-a7f6-4d56-9e46-98cdf6efa729"

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # show camera
    cv2.imshow("Camera", frame)

    # encode frame
    _, img_encoded = cv2.imencode(".jpg", frame)

    files = {
        "file": ("frame.jpg", img_encoded.tobytes(), "image/jpeg")
    }

    try:
        r = requests.post(
            "http://localhost:8000/api/v1/recognition/camera",
            files=files,
            data={
                "camera_id": "CAMERA_TEST",
                "organization_id": ORG_ID
            }
        )
        print(r.json())

    except Exception as e:
        print("API error:", e)

    if cv2.waitKey(1) == 27:  # ESC to exit
        break

cap.release()
cv2.destroyAllWindows()