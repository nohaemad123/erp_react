import { Typography } from "@mui/material";
import Image from "next/image";
import avatar from "@/assets/images/avatar.png";
import { IUserLogin } from "@/@types/interfaces/IUser";

type AvatarAtomProps = Pick<IUserLogin, "username" | "role">;

/**
 * AvatarAtom is a component that displays a user's avatar image along with their username and role.
 *
 * @param {Object} props - The component props.
 * @param {string} props.username - The username of the user.
 * @param {string} props.role - The role of the user.
 *
 * @returns {JSX.Element} A styled avatar component with a username and role displayed.
 */
export function AvatarAtom({ username, role }: Readonly<AvatarAtomProps>) {
  return (
    <div className="flex items-center gap-4">
      <Image src={avatar} alt={"user-image"} width={40} style={{ borderRadius: "50%" }} />
      <div>
        <Typography component="h4" fontWeight={700} color="#404040">
          {username}
        </Typography>
        <Typography component="h4" fontWeight={200} color="#404040">
          {role}
        </Typography>
      </div>
    </div>
  );
}
