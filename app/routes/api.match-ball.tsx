import type { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const { _action, ...data } = Object.fromEntries(formData);

  switch (_action) {
    case "update-time-elapsed": {
      return null;
    }
  }
};
