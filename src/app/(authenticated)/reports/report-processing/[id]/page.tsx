import { ChatManagement } from "../../(components)/ChatManagement";

export default function page({ params }) {
  return (
    <div className="w-full h-full bg-[#F6F6F6] p-12">
      <ChatManagement reportId={params.id} />
    </div>
  );
}
