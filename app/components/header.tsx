import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoginButton from "./common/login-button";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";
import type { user } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import type { RemixNavLinkProps } from "@remix-run/react/dist/components";
import clsx from "clsx";
import type { SerializeFrom } from "@remix-run/node";
import Jersey from "./jersey";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Header({
  user,
}: {
  user?: SerializeFrom<user> | null;
}) {
  const [showHiddenNav, setShowHiddenNav] = useState(false);
  function handleLogout() {
    const { ONEAUTH_API_HOST, PUBLIC_URL } = (window as any).ENV;
    try {
      window.location.href = `${ONEAUTH_API_HOST}/logout?returnTo=${PUBLIC_URL}`;
    } catch (e) {}
  }
  return (
    <div className="bg-purple-1 h-20 flex items-center justify-between px-5 sticky top-0 z-20">
      <div className="flex items-center h-full space-x-2">
        <FontAwesomeIcon
          icon={faBars}
          className="lg:hidden text-pink-1 w-5 h-5 -translate-x-1"
          onClick={() => setShowHiddenNav(true)}
        />
        <Link className="flex items-center" to="/">
          <img
            src="/images/cb-logo-large.webp"
            alt="CB logo"
            className="w-28"
          />
          {/* <FontAwesomeIcon
              icon={faTimes}
              className="text-pink-1 w-5 h-5 -translate-x-1"
            /> */}
          {/* <span className="text-pink-1 text-3xl px-2">|</span>
          <img
            src="/images/cwc-logo-large.svg"
            alt="CWC logo"
            className="w-28 -translate-y-1"
          /> */}
        </Link>
      </div>
      <div className="flex-grow-1 space-x-5 h-full hidden lg:flex items-center">
        <Nav to="/dashboard">Dashboard</Nav>
        <Nav to="/fixtures/live">Fixtures</Nav>
        <Nav to="/standings">Standings</Nav>
        {user &&
        (user.verifiedmobile === null || user.verifiedmobile === "") ? (
          <Nav to="/rewards">Claim rewards 🎁</Nav>
        ) : null}
        {user ? <Nav to={`/user/${user.id}`}>My stats</Nav> : null}
      </div>
      <div>
        {user ? (
          <>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center space-x-3 focus:outline-none">
                  <Jersey
                    width="32px"
                    height="32px"
                    primaryColor={
                      user.team_color ? user.team_color.split("/")[0] : "#000"
                    }
                    secondaryColor={
                      user.team_color ? user.team_color.split("/")[1] : "#000"
                    }
                  />
                  <span className="text-white font-medium text-lg">
                    {`${user.firstname} ${user.lastname}`}
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white  p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade z-50 font-medium"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="group text-base leading-none text-purple-1 flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-red-1 data-[highlighted]:text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        ) : (
          <LoginButton>Login</LoginButton>
        )}
      </div>
      <div
        className={`bg-purple-1 w-screen h-screen fixed top-0 z-[100] transition-all duration-500 ease-in-out ${
          showHiddenNav ? "left-0" : "left-[-100vw]"
        }`}
      >
        <FontAwesomeIcon
          onClick={() => setShowHiddenNav(false)}
          icon={faTimes}
          className="text-pink-1 absolute top-2 right-2 w-6 h-6 -translate-x-1"
        />
        <div className="flex flex-col translate-y-[40vh] justify-center items-center p-5">
          <Nav onClick={() => setShowHiddenNav(false)} to="/dashboard">
            Dashboard
          </Nav>
          <Nav onClick={() => setShowHiddenNav(false)} to="/fixtures/live">
            Fixtures
          </Nav>
          <Nav onClick={() => setShowHiddenNav(false)} to="/standings">
            Standings
          </Nav>
          {user &&
          (user.verifiedmobile === null || user.verifiedmobile === "") ? (
            <Nav to="/rewards">Claim rewards 🎁</Nav>
          ) : null}
          {user ? (
            <Nav
              onClick={() => setShowHiddenNav(false)}
              to={`/user/${user.id}`}
            >
              My stats
            </Nav>
          ) : null}
        </div>
        <img
          className="absolute right-0 bottom-0 w-[20%]"
          src="/images/bottom-right-trophy.svg"
          alt=""
        />
      </div>
    </div>
  );
}

function Nav(props: RemixNavLinkProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(
          "text-white font-bold text-lg uppercase relative h-full flex items-center",
          "hover:after:content-[''] hover:after:bg-white hover:after:absolute hover:after:bottom-0  hover:after:left-0 hover:after:w-full hover:after:h-1",
          isActive
            ? "after:content-[''] after:bg-white after:absolute after:bottom-0  after:left-0 after:w-full after:h-1"
            : ""
        )
      }
      {...props}
    >
      {props.children}
    </NavLink>
  );
}
