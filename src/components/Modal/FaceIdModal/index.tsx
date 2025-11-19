import "./index.style.css";
import { useEffect, useRef, useState, type FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import * as faceapi from "face-api.js";
// import { useDispatch } from "react-redux";
import { CircularProgress } from "@mui/material";
import { useAppSelector } from "@/hooks/useStore";
import { Resource } from "@/types/enum.types";
import Spinner from "@/components/Spinner/Spinner";
import { FormikProps } from "formik";
import { ILoginForm } from "@/types/auth/auth/auth.type";
import Button from "@/components/Button/Button";
import { snack } from "@/utils/snackManager";

type FaceIdModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  formik: FormikProps<ILoginForm>;
  isDisabled: boolean;
};

const FaceIdModal: FC<FaceIdModalProps> = ({
  isOpen,
  onClose,
  mode,
  formik,
  isDisabled,
}) => {
  const { t } = useTranslation();
  // const dispatch = useDispatch();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [loadingCamera, setLoadingCamera] = useState<boolean>(false);
  const [hasDescriptor, setHasDescriptor] = useState<boolean>(false);

  const hasDescriptorRef = useRef<boolean>(false);

  const { LOADING_FACE_ID } = useAppSelector((state) => state[Resource.auth]);

  useEffect(() => {
    hasDescriptorRef.current = hasDescriptor;
  }, [hasDescriptor]);

  const stopStream = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    try {
      stopStream();

      if (mode === "login") formik.setFieldValue("password", null);
      else formik.setFieldValue("faceDescriptor", null);

      setHasDescriptor(false);
      hasDescriptorRef.current = false;
    } catch (error) {
      snack.error((error as Error).message);
    } finally {
      onClose();
    }
  }, [onClose, formik, mode, stopStream]);

  useEffect(() => {
    faceapi.nets.tinyFaceDetector
      .loadFromUri("/models/tiny_face_detector")
      .catch((e) => {
        console.error("Failed to load tinyFaceDetector:", e);
      });
    faceapi.nets.faceLandmark68Net
      .loadFromUri("/models/face_landmark_68")
      .catch((e) => {
        console.error("Failed to load faceLandmark68Net:", e);
      });
    faceapi.nets.faceRecognitionNet
      .loadFromUri("/models/face_recognition")
      .catch((e) => {
        console.error("Failed to load faceRecognitionNet:", e);
      });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setLoadingCamera(true);

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () =>
            videoRef.current?.play().catch(() => {});
        }

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        intervalRef.current = setInterval(async () => {
          if (hasDescriptorRef.current) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return;
          }

          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (!video || !canvas) return;

          try {
            const detection = await faceapi
              .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();

            const displaySize = {
              width: video.videoWidth || 320,
              height: video.videoHeight || 240,
            };

            faceapi.matchDimensions(canvas, displaySize);

            const ctx = canvas.getContext("2d");
            if (ctx) ctx.clearRect(0, 0, displaySize.width, displaySize.height);

            if (detection) {
              const resized = faceapi.resizeResults(detection, displaySize);
              if (ctx) {
                faceapi.draw.drawDetections(canvas, [resized]);
              }

              const descriptor = Array.from(detection.descriptor);
              if (mode === "login") {
                formik.setFieldValue("password", descriptor);
              } else {
                formik.setFieldValue("faceDescriptor", descriptor);
              }

              setHasDescriptor(true);
              hasDescriptorRef.current = true;

              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          } catch (err) {
            snack.error(t("error_messages.try_again"));
          }
        }, 500);
      } catch (error) {
        if ((error as Error).message === "Permission dismissed")
          snack.error(t("error_messages.permission_dismissed"));
        else snack.error((error as Error).message);
      } finally {
        setLoadingCamera(false);
      }
    })();

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, [isOpen, mode, formik]);

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (isDisabled || !hasDescriptorRef.current || LOADING_FACE_ID) return;
        formik.submitForm().catch((err) => console.error("submit error:", err));
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (isDisabled || !hasDescriptorRef.current || LOADING_FACE_ID) return;
        handleClose();
      }
    },
    [isOpen, isDisabled, LOADING_FACE_ID, formik, handleClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [isOpen, globalKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="faceid-overlay"
      tabIndex={0}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="faceid-modal">
        <button className="faceid-close" onClick={handleClose}>
          &times;
        </button>
        <h2 className="faceid-title">
          {mode === "login"
            ? t(`common.login_with_faceId`)
            : t(`common.add_face_id`)}
        </h2>
        <p className="faceid-text">
          {t(`common.face_id_subtitle`, {
            field: mode === "login" ? t("common.login") : t("common.register"),
          })}
        </p>

        <div className="faceid-preview">
          {loadingCamera && (
            <div className="faceid-loading">
              <CircularProgress size={24} />
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline muted />
          <canvas ref={canvasRef} />
        </div>

        <div className="faceid-actions">
          <Button
            size="small"
            className={`faceid-btn ${LOADING_FACE_ID ? "disabledButtons" : ""}`}
            onClick={() => formik.submitForm()}
            disabled={LOADING_FACE_ID || isDisabled || !hasDescriptor}
          >
            {LOADING_FACE_ID ? <Spinner /> : t(`common.${mode}`)}
          </Button>
          <Button
            size="small"
            className={`faceid-btn secondary ${
              LOADING_FACE_ID ? "disabledButtons" : ""
            }`}
            onClick={handleClose}
            disabled={LOADING_FACE_ID}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FaceIdModal;
