import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Container from "~/components/common/container";
import { authenticate } from "~/utils/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticate(request);
  return json({
    user,
  });
};

export default function Rewards() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <Container user={user}>
      <div className="bg-purple-1 h-[calc(100vh-80px)] overflow-hidden w-screen flex flex-col justify-center space-y-8 md:px-5">
        <Outlet />
        <div className="w-screen flex justify-center">
          <img
            src="/images/banner.jpeg"
            alt="Banner"
            className="md:h-[60vh] md:w-auto h-auto w-screen"
          />
        </div>
      </div>
    </Container>
  );
}
