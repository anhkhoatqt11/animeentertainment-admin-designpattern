import React from "react";
import { RadioGroup, Radio, cn } from "@nextui-org/react";
import { FiClock } from "react-icons/fi";

export const CustomRadioNotification = ({ info, value }) => {
  //   const { children, ...otherProps } = props;

  return (
    <Radio
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-gray-50 items-center justify-between",
          "flex-row-reverse w-[320px] min-w-[320px] max-w-[320px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
      value={value}
    >
      <div className="flex flex-row gap-3">
        <img
          src={info.image}
          alt={info.name}
          className="object-cover h-[60px] w-[60px] rounded"
        />
        <div className="flex flex-col justify-between gap-3">
          <p
            style={{ maxLines: 2 }}
            className="text-[14px] w-[140px] font-medium capitalize text-black text-ellipsis overflow-hidden"
          >
            {info.name}
          </p>
          <p className="text-gray-500 text-[10px] flex flex-row gap-1 items-center">
            <FiClock size={12} /> {new Date(info.time).toDateString()}
          </p>
        </div>
      </div>
    </Radio>
  );
};
