// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

/**
 * Open a return request against an order.
 *
 * @param {object} order  the order being returned against
 * @param {Array}  lines  the order lines the customer is sending back
 * @returns {object} the new return request
 */
function openReturn(order, lines) {
  if (!order) {
    throw new Error('an order must be provided');
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }
  const orderLines = order.lines || [];
  for (const line of lines) {
    const orderLine = orderLines.find((ol) => ol.sku === line.sku);
    if (!orderLine) {
      throw new Error(`SKU ${line.sku} is not found in order ${order.id}`);
    }
    if (line.quantity <= 0) {
      throw new Error(`quantity for SKU ${line.sku} must be greater than zero`);
    }
    if (line.quantity > orderLine.quantity) {
      throw new Error(
        `cannot return ${line.quantity} units of SKU ${line.sku}, order only contained ${orderLine.quantity}`
      );
    }
  }

  return {
    orderId: order.id,
    lines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}


function approve(returnRequest, clerkId, reason) {
  if (!reason) {
    throw new Error('a refund approval must carry a reason');
  }

  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
    reason,
  };
}

module.exports = { openReturn, approve };
