import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Actions, IEmployeeTask } from 'utils/types';

/**
 * POST
 * @param {{taskId:string, dueDate: Date, employeeId: number, responsibleId: number}} data
 * @returns {IEmployeeTask} Created employeeTask
 */

/**
 * PATCH
 * @param {Date} dueDate
 * @param {string} employeeTasksId
 */
export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data },
    } = req;
    const newEmployeeTask = await prisma.employeeTask.create({
      data: {
        task: {
          connect: {
            id: data.taskId,
          },
        },
        dueDate: data.dueDate,
        employee: {
          connect: {
            id: data.employeeId,
          },
        },
        responsible: {
          connect: {
            id: data.responsibleId,
          },
        },
      },
    });
    res.json(newEmployeeTask);
  } else if (req.method === 'PATCH') {
    if (req.body.action === Actions.UpdateDueDate) {
      try {
        const {
          body: { dueDate, employeeTasksId },
        } = req;
        await prisma.employeeTask.updateMany({
          where: {
            id: {
              in: employeeTasksId,
            },
          },
          data: {
            dueDate: dueDate,
          },
        });
        res.status(HttpStatusCode.NO_CONTENT).end();
      } catch (err) {
        if (err) {
          res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
        } else {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
        }
      }
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).end();
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
