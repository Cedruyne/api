/*
 * Copyright (c) 2020 genshin.dev
 * Licensed under the Open Software License version 3.0
 */
import Router from 'koa-router';
import {
  getAvailableEntities,
  getAvailableImages,
  getEntity,
  getImage,
  getTypes,
} from '../modules/filesystem';

const router = new Router();

router.get('/', async (ctx) => {
  const types = await getTypes();
  ctx.body = {
    types,
  };
});

router.get('/:type', async (ctx) => {
  const { type } = ctx.params;
  try {
    const entityNames = await getAvailableEntities(type);
    ctx.body = entityNames;
  } catch (e) {
    const availableTypes = await getTypes();
    ctx.body = {
      error: e.message,
      availableTypes,
    };
  }
});

router.get('/:type/:id', async (ctx) => {
  try {
    const { lang } = ctx.query;
    const { type, id } = ctx.params;

    ctx.body = await getEntity(type, id, lang);
  } catch (e) {
    ctx.status = 404;
    ctx.body = { error: e.message };
  }
});

router.get('/:type/:id/:imageType', async (ctx) => {
  const { type, id, imageType } = ctx.params;

  try {
    const image = await getImage(type, id, imageType);

    ctx.body = image.image;
    ctx.type = image.type;
  } catch (e) {
    try {
      const av = await getAvailableImages(type, id);
      ctx.body = { error: e.message, availableImages: av };
    } catch (e) {
      ctx.body = { error: e.message };
    }
  }
});

export default router;
