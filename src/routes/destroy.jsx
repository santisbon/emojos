import { redirect } from "react-router-dom";
import { deleteServer } from "../servers";

export async function action({ params }) {
  await deleteServer(params.serverId);
  return redirect("/");
}