import * as service from "../services/blockchainService.js";

export async function listBlocks(req, res, next) {
  try {
    res.json(service.getAllBlocks());
  } catch (err) {
    next({
      status: 500,
      message: `Failed to retrieve blocks: ${err.message}`,
    });
  }
}

export async function getBlockByIndex(req, res, next) {
  try {
    const block = service.getBlock(Number(req.params.index));

    if (!block) {
      next({
        status: 404,
        message: `Block with index ${req.params.index} not found`,
      });
      return;
    }

    res.json(block);
  } catch (err) {
    next({
      status: 500,
      message: `Failed to retrieve block: ${err.message}`,
    });
  }
}

export async function createNewBlock(req, res, next) {
  try {
    console.log("🌟 Creating new block with data:", req.body, "🌟");
    const block = await service.createBlock(req.body);
    res.status(201).json(block);
  } catch (err) {
    next({
      status: 500,
      message: `Failed to create block: ${err.message}`,
    });
  }
}
