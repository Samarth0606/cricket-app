import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import clsx from "clsx";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";
import Container from "~/components/common/container";
import { authenticate } from "~/utils/auth.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import HowToPlay from "~/components/common/how-to-play";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  return json({ user });
};

export default function Fixtures() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Container user={user} title="Fixtures">
      <div className="grid lg:grid-cols-[1fr_3fr] p-8 lg:p-14 gap-x-10">
        <div className="flex flex-col mb-4">
          <Nav to="past">Past matches</Nav>
          <Nav to="live">Live matches</Nav>
          <Nav to="upcoming">Upcoming matches</Nav>
        </div>
        <Outlet />
      </div>
      <HowToPlay />
    </Container>
  );
}

type NavProps = RemixNavLinkProps;

function Nav(props: NavProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          "text-xl font-medium px-2 py-4",
          isActive ? "bg-pink-1 text-white" : "text-purple-1 hover:text-pink-1"
        )
      }
      {...props}
    >
      {props.children}
    </NavLink>
  );
}
