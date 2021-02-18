export const taskQuery = (data, phaseId, global) => {
  return {
    title: data.title,
    description: data.description,
    global: global,
    phase: {
      connect: {
        id: phaseId,
      },
    },
    responsible: {
      connect: data.responsible && {
        id: data.responsible.id,
      },
    },
    tags: {
      connectOrCreate: data.tags?.map((tag) => ({
        where: {
          id: tag.id,
        },
        create: {
          title: tag.title,
        },
      })),
    },
    professions: {
      connect: data.professions.map((profession) => ({ id: profession })),
    },
  };
};
