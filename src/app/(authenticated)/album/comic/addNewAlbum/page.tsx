import { AddNewAlbum } from "../../(components)/AddNewAlbum";

export default function page() {
  return (
    <div className="w-full h-full bg-slate-100 p-6">
      <AddNewAlbum type={"comic"} />
    </div>
  );
}
