import { getUserMetadata } from "@/lib/user-metadata";

export async function generateMetadata() {
    return getUserMetadata({
        title: 'Fitness Dashboard',
        description: 'Your personalized fitness tracking hub',
        fallbackTitle: 'My Fitness Dashboard',
    });
}
export default function TraninerPage(){
    return(
        <div>Trainer page</div>
    )
}