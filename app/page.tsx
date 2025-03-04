import { createClient } from "@/utils/supabase/server";
import { signout } from "./(auth)/signout/page";

export default async function Home() {

  const supabase = await createClient();
  const { data: countries } = await supabase.from("posts").select('*');

  return (
    <div>
      <pre>
        {countries?.map((value) => (
          <div key={value.id}>{value.post}</div>
        ))}
      </pre>
      <form>
        <button formAction={signout} className="bg-red-500 text-white px-4 py-2 rounded">
          Log Out
        </button>
      </form>
    </div>
  );
}
