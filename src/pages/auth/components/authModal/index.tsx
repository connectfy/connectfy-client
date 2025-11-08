import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearError, googleSignup } from "@/features/auth/authSlice";
import { useFormik } from "formik";
import { googleSignupInitialState } from "../../constants/intialState";
import { valdiateGoogleSignup } from "../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { Resource } from "@/types/enum.types";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import { onPressEnter, onPressEsc } from "@/utils/keyPressDown";

// MUI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  alpha,
} from "@mui/material";

// Custom Components
import Input from "@/components/Input/Input";
import DatePicker from "@/components/DatePicker";
import Button from "@/components/Button/Button";

// Styles
import "./index.style.css";
import { ROUTER } from "@/constants/routet";
import GenderForm from "../../pages/main/pages/Signup/components/GenderForm";
import { snack } from "@/utils/snackManager";

interface SignupModalProps {
  idToken: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ idToken, isOpen, onClose }: SignupModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { ERROR_GOOGLE_SIGNUP, LOADING_GOOGLE_SIGNUP } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const formik = useFormik({
    initialValues: googleSignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => valdiateGoogleSignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(googleSignup(values));
      const res = unwrapResult(actionResult);
      if (res) {
        snack.success(t("user_messages.signup_successful"));
        navigate(ROUTER.MESSENGER.MAIN);
        localStorage.removeItem("authPage");
        localStorage.removeItem("loginMode");
        localStorage.removeItem("forgotPasswordMode");
        resetForm();
        onClose();
      }
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "Enter":
        onPressEnter(e, () => {
          if (isDisabled) return;
          formik.handleSubmit();
        });
        break;

      case "Escape":
        onPressEsc(e, onClose);
    }
  };

  const handleOnClose = () => {
    formik.resetForm();
    onClose();
  };

  useToastError({
    error: ERROR_GOOGLE_SIGNUP,
    clearErrorAction: () => clearError("signup"),
  });

  useEffect(() => {
    formik.setFieldValue("idToken", idToken);
  }, [idToken]);

  useEffect(() => {
    const { username, gender, birthdayDate } = formik.values;

    const hasEmptyUsername = !username || !checkEmptyString(username);
    const hasEmptyGender = !gender;
    const hasEmptyDate = !birthdayDate;

    const shouldDisable =
      hasEmptyUsername ||
      hasEmptyGender ||
      hasEmptyDate ||
      LOADING_GOOGLE_SIGNUP;

    setIsDisabled(shouldDisable);
  }, [formik.values, LOADING_GOOGLE_SIGNUP]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleOnClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: "var(--card-bg)",
          boxShadow: "var(--card-shadow)",
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backgroundImage: "none",
          overflow: "visible",
        },
      }}
      className="signup-modal-override"
    >
      <DialogTitle
        sx={{
          pb: 2,
          pt: 3,
          px: 3,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: "var(--card-bg)",
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "3px",
            background: "var(--primary-color)",
            borderRadius: "3px",
          },
        }}
        component={"div"}
      >
        <Typography
          variant="h5"
          component="h2"
          align="center"
          sx={{
            fontWeight: 600,
            color: "var(--text-color)",
          }}
        >
          {t("common.complete_signup")}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ mt: 2, px: 3, py: 3 }}>
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            background: "var(--active-bg-2)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <Typography
            variant="body2"
            color="var(--muted-color)"
            align="center"
            sx={{
              lineHeight: 1.6,
              fontSize: "0.875rem",
            }}
          >
            {t("common.google_signup_description")}
          </Typography>
        </Box>

        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Username Field */}
          <Box>
            <Input
              inputSize="large"
              label={t("common.username")}
              name="username"
              value={formik.values.username || ""}
              onChange={(e) =>
                formik.setFieldValue("username", e.target.value || null)
              }
              onBlur={() => formik.setFieldTouched("username", true, false)}
              onKeyDown={(e) => onKeyDown(e)}
              hasError={!!(formik.errors.username && formik.touched.username)}
            />
            {formik.errors.username && formik.touched.username && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  display: "block",
                  animation: "slideDownFadeIn 0.3s ease-in-out",
                  color: "var(--error-color)",
                  fontWeight: 500,
                  flexWrap: "wrap",
                  whiteSpace: "normal",
                  overflowWrap: "anywhere",
                  maxWidth: "100%",
                }}
                fontWeight={900}
                className="form-error"
              >
                {formik.errors.username}
              </Typography>
            )}
          </Box>

          {/* Birthday Date Field */}
          <Box>
            <DatePicker
              value={formik.values.birthdayDate?.toString() || ""}
              onChange={(date) => formik.setFieldValue("birthdayDate", date)}
              inputSize="medium"
              hasError={false}
              placeholder={t("common.birthday")}
              onKeyDown={(e) => onKeyDown(e)}
            />
            {formik.errors.birthdayDate && formik.touched.birthdayDate && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  display: "block",
                  animation: "slideDownFadeIn 0.3s ease-in-out",
                  color: "var(--error-color)",
                  fontWeight: 500,
                }}
              >
                {String(formik.errors.birthdayDate)}
              </Typography>
            )}
          </Box>

          {/* Gender Field */}
          <Box>
            <GenderForm formik={formik} formId="signup-modal" />
            {formik.errors.gender && formik.touched.gender && (
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  display: "block",
                  animation: "slideDownFadeIn 0.3s ease-in-out",
                  color: "var(--error-color)",
                  fontWeight: 500,
                }}
              >
                {formik.errors.gender}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 2, background: "var(--card-bg)" }}>
        <Button
          size="small"
          onClick={handleOnClose}
          disabled={LOADING_GOOGLE_SIGNUP}
          style={{ backgroundColor: "var(--muted-color)" }}
        >
          {t("common.cancel")}
        </Button>
        <Button
          size="small"
          onClick={() => {
            if (LOADING_GOOGLE_SIGNUP) return;
            formik.handleSubmit();
          }}
          disabled={isDisabled}
        >
          {LOADING_GOOGLE_SIGNUP ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            t("common.complete_signup")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SignupModal;
