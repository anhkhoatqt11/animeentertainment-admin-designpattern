import { EditAlbum } from "../../(components)/EditAlbum";

export default function page({ params }) {
  return (
    <div className="w-full h-full bg-slate-100 p-6">
      <EditAlbum albumId={params.id} type={"anime"} />
    </div>
  );
}
