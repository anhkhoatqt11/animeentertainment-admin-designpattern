import { EditComic } from "./EditComic";

export default function page({ params }) {
  return (
    <div className="w-full h-full bg-slate-100 p-6">
      <EditComic comicId={params.id} />
    </div>
  );
}
