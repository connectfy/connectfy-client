import "./index.style.css";
import { useTranslation } from "react-i18next";
import { type RootState } from "@/store/store";
import { GENDER, Resource } from "@/types/enum.types";
import { useDispatch, useSelector } from "react-redux";
import { setSignupForm } from "@/features/auth/authSlice";

const GenderForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { signupForm } = useSelector(
    (state: RootState) => state[Resource.auth]
  );

  const changeSignupForm = (value: GENDER) =>
    dispatch(setSignupForm({ gender: value }));

  return (
    <div className="gender-group">
      <input
        autoComplete="off"
        type="radio"
        id="male"
        name="gender"
        value={GENDER.MALE}
        onChange={(e) => changeSignupForm(e.target.value as GENDER)}
        checked={signupForm.gender === GENDER.MALE}
      />
      <label htmlFor="male">{t("enum.male")}</label>

      <input
        autoComplete="off"
        type="radio"
        id="female"
        name="gender"
        value={GENDER.FEMALE}
        onChange={(e) => changeSignupForm(e.target.value as GENDER)}
        checked={signupForm.gender === GENDER.FEMALE}
      />
      <label htmlFor="female">{t("enum.female")}</label>

      <input
        autoComplete="off"
        type="radio"
        id="other"
        name="gender"
        value={GENDER.OTHER}
        onChange={(e) => changeSignupForm(e.target.value as GENDER)}
        checked={signupForm.gender === GENDER.OTHER}
      />
      <label htmlFor="other">{t("enum.other")}</label>
    </div>
  );
};

export default GenderForm;
