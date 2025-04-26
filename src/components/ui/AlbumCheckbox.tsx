import React from "react";
import { Checkbox, Link, User, Chip, cn } from "@nextui-org/react";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";

export const AlbumCheckbox = ({ info, statusColor, value }) => {
  return (
    <Checkbox
      aria-label={info.name}
      classNames={{
        base: cn(
          `inline-flex max-w-md ${
            info.type === "comic" ? "w-[172px]" : "w-[260px]"
          } bg-content1 m-0`,
          "hover:bg-content2 items-start justify-start",
          "cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
        label: `${info.type === "comic" ? "w-[176px]" : "w-[268px]"}`,
      }}
      value={value}
    >
      <div className="group relative overflow-hidden rounded">
        <AspectRatio ratio={info.type === "comic" ? 2 / 3 : 16 / 9}>
          <img
            src={info.image}
            alt={info.name}
            className="object-cover h-full w-full rounded"
          />
        </AspectRatio>
        <div className="px-2 absolute inset-0 z-20 flex items-end bg-gradient-to-t from-[#25253bdc] to-[#20202b00]">
          <p
            style={{ maxLines: 1, whiteSpace: "nowrap" }}
            className="text-[14px] font-medium capitalize text-slate-100 text-ellipsis overflow-hidden"
          >
            {info.name}
          </p>
        </div>
      </div>
    </Checkbox>
  );
};
