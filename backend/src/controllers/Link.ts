import { Request, Response } from "express";
import { generateRandomString, CharacterSetType } from "ts-randomstring/lib";
import { Link } from "../models/Link";
import { Content } from "../models/Content";

interface ContentRequest extends Request {
  userId?: string;
}

//bug here
const randomString = generateRandomString({
  length: 16,
  charSetType: CharacterSetType.Alphanumeric,
});

export const generateShareLinkController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const { share } = req.body;
    if (!share) {
      await Link.deleteOne({ userId: req.userId });
      return res.status(200).json({
        success: true,
        msg: "Shared Link disabled",
      });
    }

    const isLinkExist = await Link.findOne({ userId: req.userId });
    if (isLinkExist) {
      return res.status(200).json({
        msg: "Link already exists",
        link: isLinkExist.hash,
      });
    }

    const shareableLink = await Link.create({
      userId: req.userId,
      hash: randomString,
    });
    console.log(randomString);
    return res.status(200).json({
      success: true,
      msg: "Link created",
      link: shareableLink,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: "false",
      msg: "Server error",
    });
  }
};

export const openSharedLinkController = async (
  req: ContentRequest,
  res: Response
): Promise<any> => {
  try {
    const hash = req.params.sharedlink;

    const link = await Link.findOne({ hash });

    if (!link) {
      return res.status(411).json({
        success: false,
        msg: "Opps! the link you searched for have no content | invalid link",
      });
    }

    const userId = link.userId;

    const content = await Content.find({ userId }).populate({
      path: "userId",
      select: "username",
    });

    return res.status(200).json({
      success: true,
      content: content,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: "false",
      msg: "Server error",
    });
  }
};
