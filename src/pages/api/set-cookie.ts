import { isDev } from "@utils/helpers/HelperBrowser";
import { rejectNull } from "@utils/helpers/HelperServer";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    rejectNull(req.body.token, "token", res)
    && rejectNull(req.body.refresh_token, "refresh_token", res)
  ) {
    const { token } = req.body;
    // eslint-disable-next-line camelcase
    const { refresh_token } = req.body;
    const HardCodedData = {
      token,
      // eslint-disable-next-line camelcase
      refresh_token,
    };
    const now = new Date();
    let time = now.getTime();
    time += 3600 * 1000 * 24;
    now.setTime(time);

    const data = `${"digikeep"}=${token};`;
    const expires = `expires=${now.toUTCString()};`;
    const path = "path=/;";
    const domain = `domain=${
      isDev
        ? process.env.NEXT_PUBLIC_DOMAIN_DEV
        : process.env.NEXT_PUBLIC_DOMAIN
    };`;
    const httpOnly = "httpOnly;";
    const SameSite = "SameSite=Strict;";
    const cookies = data + expires + path + domain + httpOnly + SameSite;
    res.setHeader("Set-Cookie", cookies);
    return res.status(200).json({
      code: 0,
      info: "Login Suceed",
      data: HardCodedData,
    });
  }
  return res.status(401).json({ message: "Invalid credentials" });
}
