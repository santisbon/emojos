import { Form, useLoaderData, redirect, useNavigate,} from "react-router-dom";
import { updateServer } from "../servers";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateServer(params.serverId, updates);
  return redirect(`/${params.serverId}`);
}

export default function EditServer() {
  const server = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="server-form">
      <p>
        {server.id || server.title ? (
          <>
            {server.id}
          </>
        ) : (
          <i>No Name</i>
        )}
      </p>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          placeholder="Your personal notes about this server."
          defaultValue={server.notes}
          rows={3}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button 
          type="button" 
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}