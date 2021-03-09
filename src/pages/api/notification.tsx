import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();
import qs from 'qs';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { description, employeeId, slackData },
    } = req;
    const newNotification = await prisma.notification.create({
      data: {
        employeeId: employeeId,
        description: description,
      },
    });
    if (slackData) {
      await axios.post(
        'https://slack.com/api/chat.postMessage',
        qs.stringify({
          token: process.env.SLACK_TOKEN,
          channel: slackData.channel,
          text: slackData.text,
        }),
      );
      res.status(HttpStatusCode.CREATED).json(newNotification);
    } else {
      res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
    }
    prisma.$disconnect();
  }
}
