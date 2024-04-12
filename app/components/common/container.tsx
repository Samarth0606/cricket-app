import type { user } from "@prisma/client";
import Header from "../header";
import type { SerializeFrom } from "@remix-run/node";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

type ContainerProps = {
  user?: SerializeFrom<user> | null;
  children: React.ReactNode;
  title?: string;
};

export default function Container({ user, children, title }: ContainerProps) {
  return (
    <div className="relative">
      <Header user={user} />
      {title ? (
        <div className="flex items-center bg-purple-1 p-14 relative">
          <div className="absolute left-3 h-full top-[calc(50%-16px)]">
            <FontAwesomeIcon icon={faCircle} className="text-pink-1 w-8 h-8" />
          </div>
          <div className="absolute left-0 w-14 h-3 bg-pink-1 bottom-0"></div>

          <h1 className="text-white font-bold font-cwc-india text-5xl uppercase">
            {title}
          </h1>
        </div>
      ) : null}
      {children}
    </div>
  );
}
