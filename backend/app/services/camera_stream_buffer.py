import threading

camera_frames = {}
lock = threading.Lock()


def update_frame(camera_id, frame):
    with lock:
        camera_frames[camera_id] = frame


def get_frame(camera_id):
    with lock:
        return camera_frames.get(camera_id)