"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useTranslation } from "react-i18next";
import { ForgotPasswordDto } from "@/@types/dto/ForgotPasswordDto";
import fetchClient from "@/lib/fetchClient";
import { END_POINT_AUTH } from "@/@types/enums/endPointAuth";
import { forgotPasswordValidationSchema } from "@/@types/validators/ForgotPasswordValidators";
import { ResultHandler } from "@/@types/classes/ResultHandler";
import { IUserLogin } from "@/@types/interfaces/IUser";
import LabelAtom from "@/components/atom/LabelAtom";
import { TextFieldAtom } from "@/components/atom/TextFieldAtom";
import { ErrorInputAtom } from "@/components/atom/ErrorInputAtom";
import { MobileFieldAtom } from "@/components/atom/MobileFieldAtom";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    defaultValues: new ForgotPasswordDto(),
    resolver: valibotResolver(forgotPasswordValidationSchema),
  });

  async function handleSubmitForm(data: ForgotPasswordDto) {
    console.log(data);

    try {
      const response = await fetchClient<ResultHandler<IUserLogin>>(END_POINT_AUTH.AUTH.CREATE_TENANT, {
        method: "POST",
        body: data,
      });

      const responseData = await response;
      console.log("register successful", responseData);

      // push("/login");
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
      <div className=" rounded-lg p-8 w-full max-w-2xl">
        {/* Form header */}
        <h2 className="text-center text-3xl font-bold mb-6">Landing Page</h2>

        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {/* Trade Name */}
          <div className="mb-4">
            <LabelAtom labelMessage="Trade Name" required />
            <TextFieldAtom
              {...register("name")}
              placeholder={t("Enter Commercial Name")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div>{errors.name && <ErrorInputAtom errorMessage={errors.name.message || ""} />}</div>
          </div>

          {/* Page Name */}
          <div className="mb-4">
            <LabelAtom labelMessage="User Name" required />
            <TextFieldAtom
              {...register("username")}
              placeholder={t("Enter User Name")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.username && <p className="text-red-500">{t(errors.username.message || "")}</p>}
          </div>

          <div className="w-full mb-3">
            <LabelAtom labelMessage="Phone Number" required />
            <MobileFieldAtom control={control} name="phone" />
            {errors.phone && <p className="text-red-500 text-sm m-0 mt-3">{t(errors.phone.message || "")}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <LabelAtom labelMessage="Email" required />
            <TextFieldAtom
              {...register("email")}
              placeholder={t("Enter your email")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div>{errors.email && <ErrorInputAtom errorMessage={errors.email.message || ""} />}</div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <LabelAtom labelMessage="Password" required />
            <TextFieldAtom
              {...register("password")}
              placeholder={t("Enter your password")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div>{errors.password && <ErrorInputAtom errorMessage={errors.password?.message || ""} />}</div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <LabelAtom labelMessage="Confirm Password" required />
            <TextFieldAtom
              {...register("confirmPassword")}
              placeholder={t("Enter your password")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.confirmPassword && <p className="text-red-500">{t(errors.confirmPassword.message || "")}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 transition duration-300">
            {t("Register")}
          </button>
        </form>
      </div>
    </div>
  );
}
