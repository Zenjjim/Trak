import { IProfession, ITag } from './types';

// TODO: Fix type any
// eslint-disable-next-line
export const taskQuery = (data: any, phaseId: string, global: boolean) => ({
  title: data.title,
  description: data.description,
  global: global,
  phase: {
    connect: {
      id: phaseId,
    },
  },
  ...(data.responsible && {
    responsible: {
      connect: {
        id: parseInt(data.responsible.id),
      },
    },
  }),
  tags: {
    connectOrCreate: data.tags?.map((tag: ITag) => ({
      where: {
        id: tag.id,
      },
      create: {
        title: tag.title,
      },
    })),
  },
  professions: {
    connect: data.professions.map((profession: IProfession) => ({ id: profession })),
  },
});
