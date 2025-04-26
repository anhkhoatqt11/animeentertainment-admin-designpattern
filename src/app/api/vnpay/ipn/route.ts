// import prisma from '@/lib/prisma';
import AdvertisementPortalHistory from "@/model/advertisementsportalhistories";
import mongoose from "mongoose";
import AnimeEpisodesModel from "@/model/animeepisodes";
import AdvertisementModel from "@/model/advertisements";
import Credentials from "@/model/credentials";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search);
        let secureHash = searchParams.get('vnp_SecureHash');

        let orderId = searchParams.get('vnp_TxnRef');

        let rspCode = searchParams.get('vnp_ResponseCode');

        let secretKey = process.env.NEXT_PUBLIC_VNP_HASHSECERT;
        let querystring = require('qs');
        let signData = querystring.stringify(searchParams, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

        const hoaDon = await AdvertisementPortalHistory.findById(orderId);
        console.log(hoaDon);
        console.log(secureHash);
        console.log(signed);
        console.log("secure hash true");
        if (hoaDon.status == "pending") {
            if (rspCode == "00") {
                // const PaymentHistoryData = await PaymentHistory.findById(orderId);
                // await PaymentHistory.findByIdAndUpdate(orderId, { status: "completed" });
                // const skyCoinPackage = await SkyCoinPackage.findById(PaymentHistoryData.packageId);
                // const currentUserSkycoin = await UserModel.findById(PaymentHistoryData.userId);
                // await UserModel.findByIdAndUpdate(PaymentHistoryData.userId, ({ coinPoint: currentUserSkycoin.coinPoint + skyCoinPackage.quantity }));
                const PaymentHistoryData = await AdvertisementPortalHistory.findById(orderId);
                await AdvertisementPortalHistory.findByIdAndUpdate(orderId, { status: "completed" });

                const credentials = await Credentials.findOne({ _id: PaymentHistoryData.userId });

                const body = {
                    representative: credentials.username,
                    totalBill: PaymentHistoryData.price,
                    adVideoUrl: PaymentHistoryData.videoUrl,
                    forwardLink: PaymentHistoryData.linkUrl,
                    amount: null,
                };

                const ad = await AdvertisementModel.create({
                    ...body,
                });

                console.log(ad);

                const idList: mongoose.Types.ObjectId[] = [];
                PaymentHistoryData.episodeList.map((item) => {
                    idList.push(new mongoose.Types.ObjectId(item));
                });

                await AnimeEpisodesModel.updateMany(
                    { _id: { $in: idList } },
                    {
                        $set: {
                            advertisement: new mongoose.Types.ObjectId(ad._id),
                        },
                    }
                );

                return new Response(JSON.stringify({ code: '00', data: 'Thanh toán thành công', orderId: orderId }), { status: 200 });
            } else {
                return new Response(JSON.stringify({ code: '01', data: 'Thanh toán thất bại', orderId: orderId }), { status: 200 });
            }

        } else if (hoaDon.status == "completed") {
            return new Response(JSON.stringify({ code: '00', data: 'Thanh toán thành công', orderId: orderId }), { status: 200 });
        } else {
            // await prisma.hoaDon.delete({
            //     where: {
            //         id: id,
            //     }
            // });
            // await prisma.hoaDonVe.deleteMany({
            //     where: {
            //         hoaDonId: id,
            //     }
            // });
            // await PaymentHistory.findByIdAndDelete(orderId);
            return new Response(JSON.stringify({ code: '01', data: 'Thanh toán thất bại', orderId: orderId }), { status: 200 });
        }
    } catch (e) {
        return new Response(e, { status: 500 });
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
