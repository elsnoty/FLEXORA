import { createClient } from "@/utils/supabase/server";
import { signout } from "./(auth)/signout/page";
import DeleteUserButton from "../components/home/page";
import { toast } from "@/hooks/use-toast";
import { OnToast } from "../components/home/TEstCmop";

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
      </form>
          <div>
        {
            <DeleteUserButton userId="668082e8-ed16-4236-a6ac-a80916197bc5"/>
          }
          </div>
          <OnToast />
          
    </div>
  );
}
