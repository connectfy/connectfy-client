import { useState } from "react";
import axios from "axios";
import api from "@/common/api/axios";
import { useUpdateAvatarMutation } from "../api/api";
import { useErrors } from "@/hooks/useErrors";
import { ProfilePhotoUpdateAction } from "@/common/enums/enums";
import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { snack } from "@/common/utils/snackManager";
import {
  ALLOWED_TYPES,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB,
} from "../constants/constants";
import { useTranslation } from "react-i18next";

export const useUpdateAvatar = (currentAvatarUrl?: string) => {
  const { t } = useTranslation();
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
  const { showResponseErrors } = useErrors();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      const formats = ALLOWED_TYPES.map((type) =>
        type.split("/")[1].toUpperCase(),
      ).join(", ");

      return t("error_messages.invalid_file_type", {
        formats,
      });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return t("error_messages.file_too_large", {
        size: MAX_SIZE_MB,
      });
    }
    return null;
  };

  const handleAvatarUpload = async ({
    _id,
    file,
    action,
  }: {
    _id: string;
    file?: File;
    action: ProfilePhotoUpdateAction;
  }) => {
    let objectUrl: string | null = null; // Scope-u yuxarı qaldırdıq

    try {
      if (action === ProfilePhotoUpdateAction.Update && file) {
        const validationError = validateFile(file);
        if (validationError) {
          snack.error(validationError);
          return;
        }

        // 1. Optimistic UI Update
        objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // 2. Presigned URL
        const { data: presignedData } = await api.post(
          API_ENDPOINTS.FILES.PRESIGNED_UPLOAD,
          {
            filename: file.name,
            moduleName: "profile",
            contentType: file.type,
          },
        );

        // 3. Direct S3 Upload
        await axios.put(presignedData.uploadUrl, file, {
          headers: { "Content-Type": file.type },
        });

        const payload = {
          _id,
          action,
          avatar: {
            key: presignedData.fileKey,
            url: presignedData.fileUrl,
            isCustom: true,
          },
        };

        // 4. Commit to Backend
        await updateAvatar(payload).unwrap();
      } else {
        // Default və ya Remove əməliyyatları
        await updateAvatar({ _id, action, avatar: null }).unwrap();
      }
    } catch (error) {
      console.error("❌ Process failed:", error);
      showResponseErrors(error);
      setPreviewUrl(null); // Rollback
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  };

  const displayAvatar = previewUrl || currentAvatarUrl;
  return { handleAvatarUpload, displayAvatar, validateFile, isLoading };
};
