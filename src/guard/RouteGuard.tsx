"use client";

import { ILayout } from "@/@types/interfaces/ILayout";
import { IUserLogin } from "@/@types/interfaces/IUser";
import { IDENTITY_ROUTES } from "@/@types/stables";
import { useAppStore } from "@/store";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RouteGuard({ children }: Readonly<ILayout>) {
  const pathname = usePathname();
  const { push } = useRouter();
  const { myUser } = useAppStore();
  const { tenant_id } = useParams();

  // [TODO] get new access and refresh token here with proper way
  useEffect(() => {
    const userStr = localStorage.getItem("myUser");

    if (userStr) {
      const myUser: IUserLogin = JSON.parse(userStr);
      useAppStore.setState({ myUser, userToken: myUser.token });
    } else {
      useAppStore.setState({ myUser: null, userToken: undefined });
    }
  }, []);

  useEffect(() => {
    const isIdentityRoute = IDENTITY_ROUTES.some((x) => pathname.startsWith(x));
    if (myUser === null && !isIdentityRoute) {
      push(`/login`);
    } else if (myUser && (isIdentityRoute || pathname === "/")) {
      // if (!tenant_id)
      // redirectTimeoutRef.current = setTimeout(() => {
      //   push(`/${myUser.username}`);
      // }, 2500);
      push(`/${myUser.username}`);
    }
  }, [myUser, tenant_id, pathname]);

  if (myUser === undefined) return <></>;

  return children;
}
