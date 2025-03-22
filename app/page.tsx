import { createClient } from "@/utils/supabase/server";
import { signout } from "./(auth)/signout/page";
import DeleteUserButton from "./home/page";

export default async function Home() {

  const supabase = await createClient();
  const { data: countries } = await supabase.from("posts").select('*');

  return (
    <div>
        {countries?.map((value) => (
          <div key={value.id}>{value.post}</div>
        ))}
      <form>
        <button formAction={signout} className="bg-red-500 text-white px-4 py-2 rounded">
          Log Out
        </button>
        <DeleteUserButton userId="94b115f6-5c9e-4de8-b6fb-977b9ae289e1" />
      </form>
    </div>
  );
}
