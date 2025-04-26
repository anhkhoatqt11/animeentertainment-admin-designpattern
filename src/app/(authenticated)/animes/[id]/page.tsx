import { EditAnime } from "./EditAnime";

export default function page({ params }) {
  return (
    <div className="w-full h-full bg-slate-100 p-6">
      <EditAnime animeId={params.id} />
    </div>
  );
}
