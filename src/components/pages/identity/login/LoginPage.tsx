"use client";

import logo from "@/assets/images/logo.svg";
import styles from "./LoginPage.module.css";
import { useForm } from "react-hook-form";
import { LoginDto } from "@/@types/dto/LoginDto";
import { loginValidationSchema } from "@/@types/validators/loginValidator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslation } from "react-i18next";
import fetchClient from "@/lib/fetchClient";
import { END_POINT_AUTH } from "@/@types/enums/endPointAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import Link from "next/link";
import { IUserLogin } from "@/@types/interfaces/IUser";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";

export default function LoginPage() {
  const { t } = useTranslation();
  const { isHttpClientLoading } = useAppStore();
  const { push } = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    defaultValues: new LoginDto(),
    resolver: valibotResolver(loginValidationSchema),
  });

  async function handleSubmitForm(data: LoginDto) {
    setLoginError(null);

    try {
      const response = await fetchClient<ResultHandler<IUserLogin>>(END_POINT_AUTH.AUTH.LOGIN_WITHOUT_TENANT, {
        method: "POST",
        body: data,
      });

      console.log("Login ", response);

      console.log("Login successful", response);

      useAppStore.setState((state) => ({ ...state, myUser: response.data }));
      localStorage.setItem("myUser", JSON.stringify(response.data));

      push(`/${response.data?.username}`);
    } catch (error: any) {
      setLoginError(error.message);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center flex-auto min-w-0 sm:flex-row md:items-start sm:justify-center md:justify-start">
        {/* Right Side */}
        <div className="w-full px-4 py-8 md:flex md:items-center md:justify-center sm:w-auto md:h-full md:w-1/2 sm:p-12 md:p-16">
          <div className="w-full mx-auto max-w-[25rem] sm:w-100 sm:mx-0">
            {/* Logo */}
            <div className="w-3/5 h-3/5 mt-7">
              <img src={logo.src} alt="logo" width="240px" />
            </div>

            {/* Title */}
            <div className="mt-8 text-xl font-extrabold leading-tight tracking-tight">{t("Please enter your login information")}</div>

            {/* Sign in form */}
            <form className="mt-8" onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="w-full mb-3">
                <LabelAtom labelMessage="Email" />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  {...register("email")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter your email")}
                />
                {errors.email && <p className="text-red-500">{t(errors.email.message || "")}</p>}
              </div>

              <div className="w-full mt-6">
                <LabelAtom labelMessage="Password" />
                <TextFieldAtom
                  disabled={isHttpClientLoading}
                  type="password"
                  {...register("password")}
                  className="w-full h-[48px] mt-2 border p-2 rounded"
                  placeholder={t("Enter your password")}
                />
                {errors.password && <p className="text-red-500">{t(errors.password.message || "")}</p>}
              </div>

              {loginError && <p className="text-red-500">{loginError}</p>}

              <div className="flex justify-between my-8 items-center">
                <Link href="/forgot-password" className=" text-[#226AB2] shadow-none hover:underline">
                  {t("Forgot your password?")}
                </Link>
              </div>

              <button
                className="w-full bg-[#226AB2] text-white border-0 py-2 rounded hover:bg-blue-[#144e87]"
                type="submit"
                disabled={isHttpClientLoading}
              >
                {t("Sign In")}
              </button>

              <p className="mt-4">
                <span className="me-4">{t("Don't have an account?")}</span>
                <Link href="/register" className="text-[#226AB2] shadow-none underline">
                  {t("Sign Up")}
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Left Side */}
        <div
          className={`${styles["bg1"]} h-[100vh] relative bg1 items-center justify-center flex-auto hidden w-1/2  p-16 overflow-hidden bg-cover bg-center
         bg-gray-800 md:flex lg:px-28 dark:border-l`}
        >
          <div className={`${styles["bg2"]} relative bg2 z-10 w-3/4 h-3/4 bg-contain bg-center bg-no-repeat`}></div>
        </div>
      </div>
    </>
  );
}
