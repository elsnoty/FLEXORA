import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <Spinner />
        </div>
    );
}