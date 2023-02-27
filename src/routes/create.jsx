import { redirect } from "react-router-dom";
import { createServer } from "../servers";

export async function action({ params }) {
  await createServer(params.serverId);
  return redirect(`/${params.serverId}`);
}