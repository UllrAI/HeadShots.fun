import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/shared/icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">
}

export function UserAvatar({ id, user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="Avatar Picture" src={user.image} referrerPolicy="no-referrer" />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          {/* <Icons.user className="size-4" /> */}
          <img src={`https://api.multiavatar.com/${user.name}.svg`} alt="default avatar" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
