import { formatNumberWithDots } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
export const EpisodeItemCard = ({
  id,
  item,
  setDefaultImage,
  setEpisodeName,
  setVideoUrl,
  setEditMode,
  setDuration,
}) => {
  return (
    <div
      className="relative group"
      onClick={() => {
        setDuration(item.totalTime);
        setVideoUrl(item.content);
        setEpisodeName(item.episodeName);
        setDefaultImage(item.coverImage);
        setEditMode(id);
      }}
    >
      <div className="flex flex-row pt-3 pr-3 pl-3 group">
        <div className="overflow-hidden rounded w-[120px]">
          <AspectRatio ratio={16 / 9}>
            <img
              src={item.coverImage}
              alt={item.episodeName}
              className="object-cover transition-transform group-hover:scale-125 duration-300"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col ml-2">
          <div
            className="font-medium w-[150px] max-h-[38px overflow-hidden text-ellipsis
            text-[14px] line-clamp-2 -mt-0.5 mb-1 group-hover:text-blue-500"
            style={{ maxLines: 2, textOverflow: "ellipsis" }}
          >
            {item.episodeName}
          </div>
          <p className="text-[11px] font-extralight opacity-75">
            {formatNumberWithDots(item.views.toString())} lượt xem
          </p>
        </div>
      </div>
    </div>
  );
};
