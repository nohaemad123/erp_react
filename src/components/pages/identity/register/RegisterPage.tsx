"use client";

import logo from "@/assets/images/logo.svg";
import styles from "./RegisterPage.module.css";
import { useForm } from "react-hook-form";
import { RegisterDto } from "@/@types/dto/RegisterDto";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslation } from "react-i18next";
import { registerValidationSchema } from "@/@types/validators/RegisterValidators";
import { useRouter } from "next/navigation";
import fetchClient from "@/lib/fetchClient";
import { END_POINT_AUTH } from "@/@types/enums/endPointAuth";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import Link from "next/link";
import { IUserLogin } from "@/@types/interfaces/IUser";
import {} from "@mui/material";
import { useAppStore } from "@/store";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterDto>({
    defaultValues: new RegisterDto(),
    resolver: valibotResolver(registerValidationSchema),
  });

  async function handleSubmitForm(data: RegisterDto) {
    try {
      const response = await fetchClient<ResultHandler<IUserLogin>>(END_POINT_AUTH.AUTH.CREATE_TENANT, {
        method: "POST",
        body: data,
      });

      const responseData = await response;
      console.log("register successful", responseData);

      push("/login");
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex items-center sm:justify-center h-[100dvh]">
        {/* Right Side */}
        <div className="md:flex md:items-center md:justify-center px-4 py-8 min-h-[100dvh] overflow-y-auto  md:h-full lg:w-1/2 lg:p-12 md:px-16">
          <div className="h-full">
            {/* Logo  */}
            <div className="mt-7">
              <img src={logo.src} alt="logo" width="225px" height="80px" />
            </div>

            {/* Title  */}
            <div className="mt-8 text-lg font-bold">{t("Please enter your login information")}</div>

            {/* Sign up form */}
            <form className="mt-8" onSubmit={handleSubmit(handleSubmitForm)}>
              {/* name */}
              <div className="w-full mb-3">
                <LabelAtom labelMessage="Commercial Name" required />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  {...register("name")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter Commercial Name")}
                />
                {errors.name && <p className="text-red-500 text-sm m-0 mt-3">{t(errors.name.message || "")}</p>}
              </div>

              {/* email */}
              <div className="w-full mb-3">
                <LabelAtom labelMessage="Email" required />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  {...register("email")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter your email")}
                />
                {errors.email && <p className="text-red-500 text-sm m-0 mt-3">{t(errors.email.message || "")}</p>}
              </div>

              {/* phone */}
              <div className="w-full mb-3">
                <LabelAtom labelMessage="Phone Number" required />
                <MobileFieldAtom control={control} name="phone" />

                {errors.phone && <ErrorInputAtom errorMessage={errors.phone?.message || ""} />}
              </div>

              {/* page */}
              <div className="w-full mb-3">
                <LabelAtom labelMessage="User Name" required />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  {...register("username")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter User Name")}
                />
                {errors.username && <ErrorInputAtom errorMessage={errors.username?.message || ""} />}
              </div>

              {/* password */}
              <div className="w-full mb-3">
                <LabelAtom labelMessage="Password" required />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  {...register("password")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter your password")}
                />

                {errors.password && <ErrorInputAtom errorMessage={errors.password?.message || ""} />}
              </div>

              {/* confirm password */}
              <div className="w-full mb-3">
                <LabelAtom labelMessage="Confirm Password" required />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  {...register("confirmPassword")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter your password")}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm m-0 mt-3">{t(errors.confirmPassword.message || "")}</p>}
              </div>

              <button
                className="w-full bg-[#226AB2] text-white border-0 py-2 rounded hover:bg-blue-[#144e87]"
                type="submit"
                disabled={isHttpClientLoading}
              >
                {t("Sign Up")}
              </button>

              <p className="mt-4">
                <span className="me-4">{t("I have an account")}</span>
                {""}
                <Link href="/login" className="text-[#226AB2] shadow-none underline">
                  {t("Sign In")}
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Left Side */}
        <div
          className={`${styles["bg1"]} h-[100dvh] relative bg1 lg:flex items-center justify-center hidden w-1/2 p-16 overflow-hidden bg-cover bg-center`}
        >
          <div className={`${styles["bg2"]} relative bg2 z-10 w-3/4 h-3/4 bg-contain bg-center bg-no-repeat`}></div>
        </div>
      </div>
    </>
  );
}
