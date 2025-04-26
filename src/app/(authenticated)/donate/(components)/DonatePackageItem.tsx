import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";

const DonatePackageItem = ({ item }) => {
  return (
    <Link href={`donate/${item?._id}`}>
      <Card className="py-4 max-w-sm m-2 w-full transition ease-in-out duration-300 hover:scale-105 shadow">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p
            className="font-bold text-sm text-ellipsis overflow-hidden h-5"
            style={{ maxLines: 1, textOverflow: "ellipsis" }}
          >
            {item.title}
          </p>
          <p className="text-tiny uppercase font-bold text-gray-600">
            {item.subTitle}
          </p>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <img
            src={item.coverImage}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          ></img>
        </CardBody>
      </Card>
    </Link>
  );
};

export default DonatePackageItem;
