import { formatNumberWithDots } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
export const ChapterItemCard = ({
  id,
  item,
  setDefaultImage,
  setChapterName,
  setContent,
  setEditMode,
  setUnlockPrice,
}) => {
  return (
    <div
      className="relative group"
      onClick={() => {
        setUnlockPrice(item.unlockPrice.toString());
        setContent(item.content);
        setChapterName(item.chapterName);
        setDefaultImage(item.coverImage);
        setEditMode(id);
      }}
    >
      <div className="flex flex-row pt-3 pr-3 pl-3 group">
        <div className="overflow-hidden rounded w-[60px]">
          <AspectRatio ratio={1 / 1}>
            <img
              src={item.coverImage}
              alt={item.chapterName}
              className="object-cover transition-transform group-hover:scale-125 duration-300"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col ml-4">
          <div
            className="font-medium w-[150px] max-h-[38px overflow-hidden text-ellipsis
            text-[14px] line-clamp-2 -mt-0.5 mb-1 group-hover:text-blue-500"
            style={{ maxLines: 2, textOverflow: "ellipsis" }}
          >
            {item.chapterName}
          </div>
          <p className="text-[11px] font-extralight opacity-75">
            {formatNumberWithDots(item.views.toString())} lượt đọc
          </p>
        </div>
      </div>
    </div>
  );
};
